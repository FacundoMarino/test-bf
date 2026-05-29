/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { randomBytes, randomUUID } from 'crypto';
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { QueryClubDto } from './dto/query-club.dto';
import { CreateCourtDto } from './dto/create-court.dto';
import { QueryCourtDto } from './dto/query-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { CreateCourtScheduleDto } from './dto/create-court-schedule.dto';
import { QueryCourtSlotsDto } from './dto/query-court-slots.dto';
import { ReplaceCourtExceptionsDto } from './dto/replace-court-exceptions.dto';
import { CreateCourtCustomSlotDto } from './dto/create-court-custom-slot.dto';
import { CreateCourtBookingDto } from './dto/create-court-booking.dto';
import { CreateFixedSeriesBookingsDto } from './dto/create-fixed-series-bookings.dto';
import { QueryClubBookingsDto } from './dto/query-club-bookings.dto';
import { QueryClubDashboardDto } from './dto/query-club-dashboard.dto';
import { QueryClubAnalyticsDto } from './dto/query-club-analytics.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { QueryMatchDto } from './dto/query-match.dto';
import { CreateLooseMatchDto } from './dto/create-loose-match.dto';
import { QueryLooseMatchDto } from './dto/query-loose-match.dto';
import { MailService } from '../mail/mail.service';
import { PuntooMailEvent } from '../mail/mail.constants';
import {
  bookingStatusLabel,
  closedBookingConfirmationEmail,
  droppedFromFullEmail,
  leaveOrganizerEmail,
  leaveSelfEmail,
  matchConfirmedAllEmail,
  matchGenderLabel,
  openMatchPublishedEmail,
  playerJoinedOrganizerEmail,
  playerJoinedSelfEmail,
  type MatchGenderUi,
  type ParticipantSlot,
} from '../mail/puntoo-templates';
import { COURT_PLAN_LIMIT_REACHED_MESSAGE } from './court-plan-limit.constants';
import {
  dateFromScheduleAbsoluteMinutes,
  effectiveEndTimeMinutes,
  isIntervalWithinSchedule,
  isMinuteWithinSchedule,
  isValidScheduleTimeRange,
  scheduleDurationMinutes,
  scheduleTimeRangesOverlap,
} from './court-schedule-time.util';

const FIXED_SERIES_DEFAULT_YEARS = 10;

type CourtScheduleRow = {
  id: string;
  dayOfWeek: number;
  startTimeMinutes: number;
  endTimeMinutes: number;
  slotDurationMinutes: number;
};

@Injectable()
export class ClubService {
  private readonly logger = new Logger(ClubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailService,
  ) {}

  private async resolveEmailsFromAuth(
    userIds: string[],
  ): Promise<Map<string, string>> {
    const client = this.supabaseService.getClient();
    const pairs = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const { data, error } = await client.auth.admin.getUserById(userId);
          if (error) return [userId, null] as const;
          const email = data.user?.email?.trim();
          return [userId, email && email.length > 0 ? email : null] as const;
        } catch {
          return [userId, null] as const;
        }
      }),
    );

    return new Map(
      pairs.filter(
        (p): p is readonly [string, string] => typeof p[1] === 'string',
      ),
    );
  }

  /** Precio/hora del tramo del horario de cancha (misma resolución que `findMatchDetail`). */
  private async findScheduleRowContainingMinute(
    courtId: string,
    dayOfWeek: number,
    minute: number,
  ) {
    const rows = await this.prisma.courtSchedule.findMany({
      where: {
        courtId,
        dayOfWeek,
        startTimeMinutes: { lte: minute },
      },
      orderBy: { startTimeMinutes: 'asc' },
    });
    return (
      (rows ?? []).find((s) =>
        isMinuteWithinSchedule(minute, s.startTimeMinutes, s.endTimeMinutes),
      ) ?? null
    );
  }

  private assertValidScheduleTimeRangeDto(dto: CreateCourtScheduleDto): void {
    if (!isValidScheduleTimeRange(dto.startTimeMinutes, dto.endTimeMinutes)) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la de inicio',
      );
    }
    if (
      dto.slotDurationMinutes === undefined ||
      dto.slotDurationMinutes === null ||
      !Number.isFinite(Number(dto.slotDurationMinutes)) ||
      Number(dto.slotDurationMinutes) < 1
    ) {
      throw new BadRequestException('La duración es obligatoria');
    }
    if (
      dto.pricePerHour === undefined ||
      dto.pricePerHour === null ||
      !Number.isFinite(Number(dto.pricePerHour)) ||
      Number(dto.pricePerHour) < 1
    ) {
      throw new BadRequestException('El precio debe ser mayor que 0');
    }
  }

  private async resolveSlotPricePerHour(
    courtId: string,
    start: Date,
  ): Promise<number | null> {
    const localDayOfWeek = start.getDay();
    const utcDayOfWeek = start.getUTCDay();
    const localMinutesFromMidnight = start.getHours() * 60 + start.getMinutes();
    const utcMinutesFromMidnight =
      start.getUTCHours() * 60 + start.getUTCMinutes();

    const scheduleForSlot =
      (await this.findScheduleRowContainingMinute(
        courtId,
        localDayOfWeek,
        localMinutesFromMidnight,
      )) ??
      (await this.findScheduleRowContainingMinute(
        courtId,
        utcDayOfWeek,
        utcMinutesFromMidnight,
      ));

    const raw = scheduleForSlot?.pricePerHour;
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
      return raw;
    }
    return null;
  }

  private async computeBookingMoney(params: {
    courtId: string;
    start: Date;
    end: Date;
    maxPlayers?: number | null;
  }): Promise<{
    total: number;
    share: number;
    pricePerHour: number | null;
  }> {
    const hours =
      (params.end.getTime() - params.start.getTime()) / (60 * 60 * 1000);
    const pricePerHour = await this.resolveSlotPricePerHour(
      params.courtId,
      params.start,
    );
    const rate = pricePerHour ?? 0;
    const total = Math.round(hours * rate * 100) / 100;
    const div = Math.max(1, params.maxPlayers ?? 4);
    const share = Math.round((total / div) * 100) / 100;
    return { total, share, pricePerHour };
  }

  private matchGenderUiFromBooking(
    manualClubNotes: string | null | undefined,
  ): MatchGenderUi {
    return this.parseMatchGender(manualClubNotes) as MatchGenderUi;
  }

  private buildMatchParticipantSlots(params: {
    organizerUserId: string;
    participants: Array<{
      profileId: string;
      createdAt: Date;
      profile: { fullName: string | null };
    }>;
    maxPlayers: number;
    strikeProfileId?: string;
  }): ParticipantSlot[] {
    const others = params.participants
      .filter((p) => p.profileId !== params.organizerUserId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const slots: ParticipantSlot[] = [];
    const extraSlots = Math.max(0, params.maxPlayers - 1);
    for (let i = 0; i < extraSlots; i++) {
      const label = `Jugador ${i + 2}`;
      const p = others[i];
      const name = p?.profile.fullName?.trim() || null;
      const struck =
        params.strikeProfileId !== undefined &&
        p?.profileId === params.strikeProfileId;
      slots.push({
        label,
        name,
        struck: struck === true,
      });
    }
    return slots;
  }

  private async generateUniqueInviteCode(): Promise<string> {
    // 10 chars hex -> safe for URL sharing and easy to read.
    for (let attempt = 0; attempt < 10; attempt++) {
      const code = randomBytes(5).toString('hex').toUpperCase();
      // Keep it globally unique across both match types.
      const [inCourt, inLoose] = await Promise.all([
        this.prisma.courtBooking.findFirst({
          where: { inviteCode: code },
          select: { id: true },
        }),
        this.prisma.looseMatch.findFirst({
          where: { inviteCode: code },
          select: { id: true },
        }),
      ]);

      if (!inCourt && !inLoose) return code;
    }

    throw new BadRequestException('Unable to generate invite code');
  }

  /** Canchas con `listed=false` no son visibles para reservas salvo el dueño del club. */
  private async assertPlayerCanAccessCourt(
    clubId: string,
    courtId: string,
    userId: string,
  ): Promise<void> {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: { createdBy: true, approvalStatus: true },
    });
    if (!club) throw new NotFoundException('Club not found');
    const isOwner = club.createdBy === userId;
    if (!isOwner && club.approvalStatus !== 'APPROVED') {
      throw new NotFoundException('Club not found');
    }

    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
      select: { listed: true },
    });
    if (!court) throw new NotFoundException('Court not found');
    if (court.listed) return;
    if (isOwner) return;
    throw new NotFoundException('Court not found');
  }

  async create(dto: CreateClubDto, userId: string) {
    return this.prisma.club.create({
      data: {
        name: dto.name,
        courtCount: dto.courtCount,
        courtType: dto.courtType,
        address: dto.address,
        location: dto.location?.trim() || null,
        email: dto.email,
        web: dto.web,
        avatarUrl: dto.avatarUrl,
        pricing: dto.pricing as unknown as Prisma.InputJsonValue,
        approvalStatus: 'PENDING',
        createdBy: userId,
      },
    });
  }

  async findAll(query: QueryClubDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ClubWhereInput = {};
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' };
    if (query.address)
      where.address = { contains: query.address, mode: 'insensitive' };
    if (query.courtType) where.courtType = query.courtType;
    where.approvalStatus = 'APPROVED';

    const [data, total] = await Promise.all([
      this.prisma.club.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.club.count({ where }),
    ]);

    const ownerIds = Array.from(
      new Set(
        data
          .map((c) => c.createdBy)
          .filter(
            (id): id is string => typeof id === 'string' && id.length > 0,
          ),
      ),
    );
    const ownerProfiles = ownerIds.length
      ? await this.prisma.profile.findMany({
          where: { id: { in: ownerIds } },
          select: { id: true, amenities: true },
        })
      : [];
    const amenitiesByOwnerId = new Map(
      ownerProfiles.map((p) => [p.id, p.amenities]),
    );

    return {
      data: data.map((club) => ({
        ...club,
        amenities:
          (club.createdBy
            ? (amenitiesByOwnerId.get(club.createdBy) ?? null)
            : null) ?? null,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({ where: { id } });
    if (!club) throw new NotFoundException('Club not found');
    if (!club.createdBy) {
      return {
        ...club,
        amenities: null,
        phone: null,
        description: null,
      };
    }
    const ownerProfile = await this.prisma.profile.findUnique({
      where: { id: club.createdBy },
      select: { amenities: true, phone: true, description: true },
    });
    return {
      ...club,
      amenities: ownerProfile?.amenities ?? null,
      phone: ownerProfile?.phone ?? null,
      description: ownerProfile?.description ?? null,
    };
  }

  async findMine(userId: string) {
    const club = await this.prisma.club.findFirst({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
    return { club };
  }

  async listClubsForAdmin(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    const where: Prisma.ClubWhereInput = status
      ? { approvalStatus: status }
      : {};
    const data = await this.prisma.club.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return { data };
  }

  async approveClub(clubId: string) {
    const existing = await this.prisma.club.findUnique({
      where: { id: clubId },
    });
    if (!existing) throw new NotFoundException('Club not found');
    return this.prisma.club.update({
      where: { id: clubId },
      data: { approvalStatus: 'APPROVED' },
    });
  }

  async rejectClub(clubId: string) {
    const existing = await this.prisma.club.findUnique({
      where: { id: clubId },
    });
    if (!existing) throw new NotFoundException('Club not found');
    return this.prisma.club.update({
      where: { id: clubId },
      data: { approvalStatus: 'REJECTED' },
    });
  }

  async update(id: string, dto: UpdateClubDto, userId: string) {
    await this.assertClubOwner(id, userId);
    try {
      const existing = await this.prisma.club.findUnique({
        where: { id },
        select: { approvalStatus: true },
      });
      return await this.prisma.club.update({
        where: { id },
        data: {
          name: dto.name,
          courtCount: dto.courtCount,
          courtType: dto.courtType,
          address: dto.address,
          ...(dto.location !== undefined
            ? {
                location:
                  dto.location == null || dto.location === ''
                    ? null
                    : dto.location.trim() || null,
              }
            : {}),
          email: dto.email,
          web: dto.web,
          avatarUrl: dto.avatarUrl,
          pricing: dto.pricing as unknown as Prisma.InputJsonValue,
          ...(existing?.approvalStatus === 'REJECTED'
            ? { approvalStatus: 'PENDING' as const }
            : {}),
        },
      });
    } catch {
      throw new NotFoundException('Club not found');
    }
  }

  async remove(id: string, userId: string) {
    await this.assertClubOwner(id, userId);
    try {
      await this.prisma.club.delete({ where: { id } });
      return { message: 'Club deleted successfully' };
    } catch {
      throw new NotFoundException('Club not found');
    }
  }

  async createCourt(clubId: string, dto: CreateCourtDto) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Club not found');

    const existingCount = await this.prisma.court.count({ where: { clubId } });
    if (existingCount >= club.courtCount) {
      throw new BadRequestException(COURT_PLAN_LIMIT_REACHED_MESSAGE);
    }

    return this.prisma.court.create({
      data: {
        name: dto.name,
        type: dto.type,
        surface: dto.surface,
        lighting: dto.lighting,
        listed: dto.listed ?? true,
        clubId,
      },
    });
  }

  async findCourts(clubId: string, query: QueryCourtDto, viewerId?: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: { createdBy: true },
    });
    const isOwner = !!(viewerId && club?.createdBy === viewerId);

    const where: Prisma.CourtWhereInput = { clubId };
    if (!isOwner) {
      where.listed = true;
    }
    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }
    if (query.type) {
      where.type = query.type;
    }
    if (query.surface) {
      where.surface = { contains: query.surface, mode: 'insensitive' };
    }
    if (typeof query.lighting === 'boolean') {
      where.lighting = query.lighting;
    }

    const [data, total] = await Promise.all([
      this.prisma.court.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.court.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateCourt(clubId: string, courtId: string, dto: UpdateCourtDto) {
    const existing = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!existing) throw new NotFoundException('Court not found');

    try {
      const data: Prisma.CourtUpdateInput = {};
      if (dto.name !== undefined) data.name = dto.name;
      if (dto.type !== undefined) data.type = dto.type;
      if (dto.surface !== undefined) data.surface = dto.surface;
      if (dto.lighting !== undefined) data.lighting = dto.lighting;
      if (dto.listed !== undefined) data.listed = dto.listed;
      return await this.prisma.court.update({
        where: { id: courtId },
        data,
      });
    } catch {
      throw new BadRequestException('Could not update court');
    }
  }

  async removeCourt(clubId: string, courtId: string) {
    const existing = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!existing) throw new NotFoundException('Court not found');

    const now = new Date();
    const activeFutureBookings = await this.prisma.courtBooking.count({
      where: {
        courtId,
        end: { gt: now },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (activeFutureBookings > 0) {
      throw new BadRequestException('La pista tiene reservas activas');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        const bookings = await tx.courtBooking.findMany({
          where: { courtId },
          select: { id: true },
        });
        const bookingIds = bookings.map((b) => b.id);
        if (bookingIds.length) {
          await tx.courtBookingParticipant.deleteMany({
            where: { bookingId: { in: bookingIds } },
          });
        }
        await tx.courtBooking.deleteMany({ where: { courtId } });
        await tx.courtSchedule.deleteMany({ where: { courtId } });
        await tx.court.delete({ where: { id: courtId } });
      });
      return { message: 'Court deleted successfully' };
    } catch {
      throw new BadRequestException('Could not delete court');
    }
  }

  async listCourtSchedules(clubId: string, courtId: string) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    return this.prisma.courtSchedule.findMany({
      where: { courtId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTimeMinutes: 'asc' }],
    });
  }

  private schedulePeriodsCalendarOverlap(
    a: CreateCourtScheduleDto,
    b: CreateCourtScheduleDto,
  ): boolean {
    const aPs = a.periodStart ? new Date(a.periodStart) : null;
    const aPe = a.periodEnd ? new Date(a.periodEnd) : null;
    const bPs = b.periodStart ? new Date(b.periodStart) : null;
    const bPe = b.periodEnd ? new Date(b.periodEnd) : null;
    if (!aPs || !aPe || !bPs || !bPe) {
      return true;
    }
    return aPs.getTime() <= bPe.getTime() && bPs.getTime() <= aPe.getTime();
  }

  private schedulesTimeRangesOverlap(
    a: CreateCourtScheduleDto,
    b: CreateCourtScheduleDto,
  ): boolean {
    if (a.dayOfWeek !== b.dayOfWeek) return false;
    if (!this.schedulePeriodsCalendarOverlap(a, b)) return false;
    return scheduleTimeRangesOverlap(
      a.startTimeMinutes,
      a.endTimeMinutes,
      b.startTimeMinutes,
      b.endTimeMinutes,
    );
  }

  private parseMatchGender(
    raw: string | null | undefined,
  ): 'male' | 'female' | 'mixed' | null {
    if (typeof raw !== 'string') return null;
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return null;
    const match = /^match_gender:(male|female|mixed)$/.exec(normalized);
    if (!match) return null;
    return match[1] as 'male' | 'female' | 'mixed';
  }

  private assertSchedulesNoPairwiseOverlap(
    schedules: CreateCourtScheduleDto[],
  ) {
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        if (this.schedulesTimeRangesOverlap(schedules[i], schedules[j])) {
          throw new BadRequestException(
            'El rango horario se solapa con uno existente',
          );
        }
      }
    }
  }

  private normalizeDateToYmd(
    value: Date | string | null | undefined,
  ): string | null {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  }

  private scheduleIdentityWithoutPeriodEnd(row: {
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number | null;
    periodName?: string | null;
    periodStart?: Date | string | null;
  }): string {
    return [
      row.dayOfWeek,
      row.startTimeMinutes,
      row.endTimeMinutes,
      row.slotDurationMinutes,
      row.pricePerHour ?? 0,
      row.periodName ?? '',
      this.normalizeDateToYmd(row.periodStart) ?? '',
    ].join('|');
  }

  private assertOnlyPeriodEndEditableWithFutureBookings(
    currentRows: Array<{
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
      slotDurationMinutes: number;
      pricePerHour: number;
      periodName: string | null;
      periodStart: Date | null;
      periodEnd: Date | null;
    }>,
    incomingRows: CreateCourtScheduleDto[],
    now: Date,
  ): void {
    if (currentRows.length !== incomingRows.length) {
      throw new BadRequestException(
        'Con reservas activas solo podés editar la fecha "Hasta" de horarios existentes.',
      );
    }

    const byIdentity = new Map<string, (typeof currentRows)[number][]>();
    for (const row of currentRows) {
      const key = this.scheduleIdentityWithoutPeriodEnd(row);
      const list = byIdentity.get(key) ?? [];
      list.push(row);
      byIdentity.set(key, list);
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (const dto of incomingRows) {
      const key = this.scheduleIdentityWithoutPeriodEnd({
        dayOfWeek: dto.dayOfWeek,
        startTimeMinutes: dto.startTimeMinutes,
        endTimeMinutes: dto.endTimeMinutes,
        slotDurationMinutes: dto.slotDurationMinutes,
        pricePerHour: dto.pricePerHour ?? 0,
        periodName: dto.periodName ?? null,
        periodStart: dto.periodStart ?? null,
      });
      const matchList = byIdentity.get(key);
      if (!matchList || matchList.length === 0) {
        throw new BadRequestException(
          'Con reservas activas solo podés editar la fecha "Hasta".',
        );
      }
      const matchedCurrent = matchList.pop();
      if (!matchedCurrent) {
        throw new BadRequestException(
          'Con reservas activas solo podés editar la fecha "Hasta".',
        );
      }

      const incomingEndYmd = this.normalizeDateToYmd(dto.periodEnd);
      if (!incomingEndYmd) {
        throw new BadRequestException(
          'Con reservas activas, la fecha "Hasta" es obligatoria y debe ser válida.',
        );
      }
      const incomingEndDate = new Date(`${incomingEndYmd}T00:00:00`);
      const currentEndYmd = this.normalizeDateToYmd(matchedCurrent.periodEnd);
      const unchangedEnd = currentEndYmd === incomingEndYmd;
      if (incomingEndDate.getTime() < today.getTime() && !unchangedEnd) {
        throw new BadRequestException(
          'La fecha "Hasta" debe ser hoy o futura cuando hay reservas activas.',
        );
      }
    }
  }

  private bookingCoveredBySchedules(
    booking: { start: Date; end: Date },
    schedules: CreateCourtScheduleDto[],
  ): boolean {
    const dow = booking.start.getDay();
    const y = booking.start.getFullYear();
    const mo = booking.start.getMonth();
    const d = booking.start.getDate();
    const bookingDayStart = new Date(y, mo, d, 0, 0, 0, 0);
    const bookingStartMin =
      booking.start.getHours() * 60 + booking.start.getMinutes();
    const bookingEndMin =
      booking.end.getHours() * 60 + booking.end.getMinutes();

    for (const row of schedules) {
      if (row.dayOfWeek !== dow) continue;

      if (row.periodStart && row.periodEnd) {
        const ps = new Date(row.periodStart);
        const pe = new Date(row.periodEnd);
        const peEndOfDay = new Date(
          pe.getFullYear(),
          pe.getMonth(),
          pe.getDate(),
          23,
          59,
          59,
          999,
        );
        if (
          bookingDayStart.getTime() < ps.getTime() ||
          bookingDayStart.getTime() > peEndOfDay.getTime()
        ) {
          continue;
        }
      }

      if (
        isIntervalWithinSchedule(
          bookingStartMin,
          bookingEndMin,
          row.startTimeMinutes,
          row.endTimeMinutes,
        )
      ) {
        return true;
      }
    }
    return false;
  }

  async replaceCourtSchedules(
    clubId: string,
    courtId: string,
    schedules: CreateCourtScheduleDto[],
    confirmCancelAffectedBookings = false,
  ) {
    void confirmCancelAffectedBookings;
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    for (const dto of schedules) {
      this.assertValidScheduleTimeRangeDto(dto);
      if (dto.periodStart && dto.periodEnd) {
        const start = new Date(dto.periodStart);
        const end = new Date(dto.periodEnd);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
          throw new BadRequestException('Fechas de período inválidas');
        }
        if (start.getTime() > end.getTime()) {
          throw new BadRequestException(
            'La fecha de inicio del período debe ser anterior o igual al fin',
          );
        }
      }
    }

    this.assertSchedulesNoPairwiseOverlap(schedules);

    const now = new Date();
    const existingSchedules = await this.prisma.courtSchedule.findMany({
      where: { courtId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTimeMinutes: 'asc' }],
    });
    const futureActive = await this.prisma.courtBooking.findMany({
      where: {
        courtId,
        end: { gt: now },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (futureActive.length > 0) {
      this.assertOnlyPeriodEndEditableWithFutureBookings(
        existingSchedules,
        schedules,
        now,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.courtSchedule.deleteMany({ where: { courtId } });
      for (const dto of schedules) {
        await tx.courtSchedule.create({
          data: {
            courtId,
            dayOfWeek: dto.dayOfWeek,
            startTimeMinutes: dto.startTimeMinutes,
            endTimeMinutes: dto.endTimeMinutes,
            slotDurationMinutes: dto.slotDurationMinutes,
            pricePerHour: dto.pricePerHour ?? 0,
            periodName: dto.periodName ?? null,
            periodStart: dto.periodStart ? new Date(dto.periodStart) : null,
            periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : null,
          },
        });
      }
    });

    return { replaced: schedules.length };
  }

  async createCourtSchedule(
    clubId: string,
    courtId: string,
    dto: CreateCourtScheduleDto,
  ) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    this.assertValidScheduleTimeRangeDto(dto);
    if (dto.periodStart && dto.periodEnd) {
      const start = new Date(dto.periodStart);
      const end = new Date(dto.periodEnd);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new BadRequestException('Invalid period date');
      }
      if (start.getTime() > end.getTime()) {
        throw new BadRequestException(
          'periodStart must be before or equal to periodEnd',
        );
      }
    }

    return this.prisma.courtSchedule.create({
      data: {
        courtId,
        dayOfWeek: dto.dayOfWeek,
        startTimeMinutes: dto.startTimeMinutes,
        endTimeMinutes: dto.endTimeMinutes,
        slotDurationMinutes: dto.slotDurationMinutes,
        pricePerHour: dto.pricePerHour ?? 0,
        periodName: dto.periodName ?? null,
        periodStart: dto.periodStart ? new Date(dto.periodStart) : null,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : null,
      },
    });
  }

  async listCourtSlots(
    clubId: string,
    courtId: string,
    query: QueryCourtSlotsDto,
    viewerId: string,
  ) {
    await this.assertPlayerCanAccessCourt(clubId, courtId, viewerId);

    const targetDate = new Date(`${query.date}T00:00:00`);
    if (Number.isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const dayOfWeek = targetDate.getDay();

    const targetDayStart = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      0,
      0,
      0,
      0,
    );
    const targetDayEnd = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      23,
      59,
      59,
      999,
    );

    const [schedules, exceptions, customSlotRows] = await Promise.all([
      this.prisma.courtSchedule.findMany({
        where: {
          courtId,
          dayOfWeek,
          OR: [
            { periodStart: null, periodEnd: null },
            {
              AND: [
                { periodStart: { lte: targetDayEnd } },
                { periodEnd: { gte: targetDayStart } },
              ],
            },
          ],
        },
        orderBy: { startTimeMinutes: 'asc' },
      }),
      this.prisma.courtScheduleException.findMany({
        where: { courtId, date: targetDayStart },
      }),
      this.prisma.courtCustomSlot.findMany({
        where: { courtId, date: targetDayStart },
        orderBy: { startTimeMinutes: 'asc' },
      }),
    ]);

    const dayClosed = exceptions.some((e) => e.isClosedAllDay);
    if (dayClosed) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 100, totalPages: 0 },
      };
    }

    const regularIntervals = this.buildRegularSlotIntervalsFromSchedules(
      schedules,
      targetDate,
    );

    const slots: {
      start: Date;
      end: Date;
      isAvailable: boolean;
      pricePerHour: number;
      isCustom: boolean;
    }[] = [];

    for (const interval of regularIntervals) {
      const overlapsCustom = customSlotRows.some((c) =>
        this.minutesOverlap(
          interval.start,
          interval.end,
          c.startTimeMinutes,
          c.endTimeMinutes,
        ),
      );
      if (overlapsCustom) continue;

      const start = dateFromScheduleAbsoluteMinutes(
        targetDate,
        interval.start,
      );
      const end = dateFromScheduleAbsoluteMinutes(targetDate, interval.end);
      slots.push({
        start,
        end,
        isAvailable: true,
        pricePerHour: interval.pricePerHour,
        isCustom: false,
      });
    }

    for (const custom of customSlotRows) {
      slots.push({
        start: dateFromScheduleAbsoluteMinutes(
          targetDate,
          custom.startTimeMinutes,
        ),
        end: dateFromScheduleAbsoluteMinutes(
          targetDate,
          custom.endTimeMinutes,
        ),
        isAvailable: true,
        pricePerHour: custom.price ?? 0,
        isCustom: true,
      });
    }

    slots.sort((a, b) => a.start.getTime() - b.start.getTime());

    if (!slots.length) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 100, totalPages: 0 },
      };
    }

    const dayStart = targetDayStart;
    const dayEnd = targetDayEnd;

    const bookings = await this.prisma.courtBooking.findMany({
      where: {
        courtId,
        start: { gte: dayStart },
        end: { lte: dayEnd },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    for (const slot of slots) {
      const overlapping = bookings.some((booking) => {
        return (
          booking.start < slot.end &&
          booking.end > slot.start &&
          this.bookingOccupiesSlotRow(booking)
        );
      });
      const slotStartMinutes =
        slot.start.getHours() * 60 + slot.start.getMinutes();
      const slotEndMinutes = slot.end.getHours() * 60 + slot.end.getMinutes();
      const blockedByException =
        !slot.isCustom &&
        this.bookingIntervalBlockedByExceptions(
          exceptions,
          slotStartMinutes,
          slotEndMinutes,
        );
      if (overlapping || blockedByException) slot.isAvailable = false;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? slots.length;
    const total = slots.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginated = slots.slice(startIndex, endIndex).map((slot) => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      isAvailable: slot.isAvailable,
      pricePerHour: slot.pricePerHour,
      isCustom: slot.isCustom,
    }));

    return {
      data: paginated,
      meta: { total, page, limit, totalPages },
    };
  }

  async listCourtAvailabilityExceptions(
    clubId: string,
    courtId: string,
    month: string,
  ) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    const [year, monthIndex] = month.split('-').map(Number);
    const from = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));

    return this.prisma.courtScheduleException.findMany({
      where: {
        courtId,
        date: { gte: from, lt: to },
      },
      orderBy: [{ date: 'asc' }, { startTimeMinutes: 'asc' }],
    });
  }

  async replaceCourtAvailabilityExceptions(
    clubId: string,
    courtId: string,
    month: string,
    exceptions: ReplaceCourtExceptionsDto['exceptions'],
  ) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    const [year, monthIndex] = month.split('-').map(Number);
    const from = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));

    for (const ex of exceptions) {
      if (!ex.isClosedAllDay) {
        if (
          typeof ex.startTimeMinutes !== 'number' ||
          typeof ex.endTimeMinutes !== 'number' ||
          ex.endTimeMinutes <= ex.startTimeMinutes
        ) {
          throw new BadRequestException(
            'Invalid exception time range for non all-day exception',
          );
        }
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.courtScheduleException.deleteMany({
        where: { courtId, date: { gte: from, lt: to } },
      });
      for (const ex of exceptions) {
        await tx.courtScheduleException.create({
          data: {
            courtId,
            date: new Date(ex.date),
            isClosedAllDay: ex.isClosedAllDay,
            startTimeMinutes: ex.isClosedAllDay ? null : ex.startTimeMinutes,
            endTimeMinutes: ex.isClosedAllDay ? null : ex.endTimeMinutes,
          },
        });
      }
    });

    return { replaced: exceptions.length };
  }

  async listCourtCustomSlots(clubId: string, courtId: string, month: string) {
    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    const [year, monthIndex] = month.split('-').map(Number);
    const from = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));

    return this.prisma.courtCustomSlot.findMany({
      where: {
        courtId,
        date: { gte: from, lt: to },
      },
      orderBy: [{ date: 'asc' }, { startTimeMinutes: 'asc' }],
    });
  }

  async createCourtCustomSlot(
    clubId: string,
    courtId: string,
    userId: string,
    dto: CreateCourtCustomSlotDto,
  ) {
    await this.assertClubOwner(clubId, userId);

    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    if (dto.endTimeMinutes <= dto.startTimeMinutes) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la de inicio',
      );
    }

    const calendarDay = this.parseLocalDateOnly(dto.date);
    const targetDayStart = calendarDay;
    const targetDayEnd = new Date(
      calendarDay.getFullYear(),
      calendarDay.getMonth(),
      calendarDay.getDate(),
      23,
      59,
      59,
      999,
    );

    const dayOfWeek = calendarDay.getDay();

    const [schedules, exceptions, existingCustom] = await Promise.all([
      this.prisma.courtSchedule.findMany({
        where: {
          courtId,
          dayOfWeek,
          OR: [
            { periodStart: null, periodEnd: null },
            {
              AND: [
                { periodStart: { lte: targetDayEnd } },
                { periodEnd: { gte: targetDayStart } },
              ],
            },
          ],
        },
      }),
      this.prisma.courtScheduleException.findMany({
        where: { courtId, date: targetDayStart },
      }),
      this.prisma.courtCustomSlot.findMany({
        where: { courtId, date: targetDayStart },
      }),
    ]);

    const mergedExceptions = this.mergeCancelledSlotsIntoExceptions(
      exceptions,
      dto.cancelledSlots,
    );

    if (mergedExceptions.some((e) => e.isClosedAllDay)) {
      throw new BadRequestException('El día está cerrado por completo');
    }

    this.assertCustomSlotDoesNotOverlapActiveSlots(
      dto.startTimeMinutes,
      dto.endTimeMinutes,
      this.buildRegularSlotIntervalsFromSchedules(schedules, calendarDay),
      mergedExceptions,
      existingCustom,
    );

    return this.prisma.$transaction(async (tx) => {
      for (const range of dto.cancelledSlots ?? []) {
        if (range.endTimeMinutes <= range.startTimeMinutes) continue;
        const exists = await tx.courtScheduleException.findFirst({
          where: {
            courtId,
            date: targetDayStart,
            isClosedAllDay: false,
            startTimeMinutes: range.startTimeMinutes,
            endTimeMinutes: range.endTimeMinutes,
          },
        });
        if (!exists) {
          await tx.courtScheduleException.create({
            data: {
              courtId,
              date: targetDayStart,
              isClosedAllDay: false,
              startTimeMinutes: range.startTimeMinutes,
              endTimeMinutes: range.endTimeMinutes,
            },
          });
        }
      }

      return tx.courtCustomSlot.create({
        data: {
          courtId,
          date: targetDayStart,
          startTimeMinutes: dto.startTimeMinutes,
          endTimeMinutes: dto.endTimeMinutes,
          price: dto.price ?? 0,
          note: dto.note?.trim() || null,
        },
      });
    });
  }

  async deleteCourtCustomSlot(
    clubId: string,
    courtId: string,
    slotId: string,
    userId: string,
  ) {
    await this.assertClubOwner(clubId, userId);

    const row = await this.prisma.courtCustomSlot.findFirst({
      where: { id: slotId, courtId, court: { clubId } },
    });
    if (!row) throw new NotFoundException('Custom slot not found');

    await this.prisma.courtCustomSlot.delete({ where: { id: slotId } });
    return { deleted: true };
  }

  /** Reserva que bloquea el calendario (turno no disponible para otros). */
  private bookingOccupiesSlotRow(b: {
    status: string;
    occupiesSlot: boolean;
  }): boolean {
    if (b.status === 'CANCELLED' || b.status === 'REJECTED') return false;
    return b.occupiesSlot;
  }

  /** Texto de contacto para “Próxima reserva” (invitado manual, título de partido u organizador). */
  private resolveNextReservationBookerDisplay(
    booking: {
      isMatch: boolean;
      title: string | null | undefined;
      manualGuests: Prisma.JsonValue | null | undefined;
    },
    profile:
      | {
          fullName: string | null;
          phone: string | null;
          email: string | null;
        }
      | undefined,
  ): {
    bookerName: string | null;
    bookerPhone: string | null;
    bookerEmail: string | null;
  } {
    const manualGuestList = this.parseManualBookingGuests(booking.manualGuests);
    const manualFirst = manualGuestList[0];
    if (manualFirst != null) {
      const name =
        typeof manualFirst.name === 'string' &&
        manualFirst.name.trim().length > 0
          ? manualFirst.name.trim()
          : (profile?.fullName ?? null);
      const phoneFromGuest =
        typeof manualFirst.phone === 'string' &&
        manualFirst.phone.trim().length > 0
          ? manualFirst.phone.trim()
          : null;
      return {
        bookerName: name,
        bookerPhone: phoneFromGuest ?? profile?.phone ?? null,
        bookerEmail: profile?.email ?? null,
      };
    }
    if (booking.isMatch) {
      const t = booking.title?.trim();
      if (t && t.length > 0) {
        return {
          bookerName: t,
          bookerPhone: profile?.phone ?? null,
          bookerEmail: profile?.email ?? null,
        };
      }
    }
    return {
      bookerName: profile?.fullName ?? null,
      bookerPhone: profile?.phone ?? null,
      bookerEmail: profile?.email ?? null,
    };
  }

  private async cancelTentativePublicMatchesOverlapping(
    tx: Prisma.TransactionClient,
    courtId: string,
    start: Date,
    end: Date,
  ): Promise<void> {
    await tx.courtBooking.updateMany({
      where: {
        courtId,
        start: { lt: end },
        end: { gt: start },
        status: { in: ['PENDING', 'CONFIRMED'] },
        isMatch: true,
        visibility: 'public',
        occupiesSlot: false,
      },
      data: { status: 'CANCELLED' },
    });
  }

  private parseLocalDateOnly(ymd: string): Date {
    const [y, mo, d] = ymd.split('-').map(Number);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) {
      throw new BadRequestException('Invalid date');
    }
    return new Date(y, mo - 1, d, 0, 0, 0, 0);
  }

  private combineLocalDateAndMinutes(
    calendarDay: Date,
    minutesFromMidnight: number,
  ): Date {
    const y = calendarDay.getFullYear();
    const m = calendarDay.getMonth();
    const d = calendarDay.getDate();
    const h = Math.floor(minutesFromMidnight / 60);
    const min = minutesFromMidnight % 60;
    return new Date(y, m, d, h, min, 0, 0);
  }

  private async getCourtSchedulesForCalendarDay(
    courtId: string,
    calendarDay: Date,
  ): Promise<CourtScheduleRow[]> {
    const targetDayStart = new Date(
      calendarDay.getFullYear(),
      calendarDay.getMonth(),
      calendarDay.getDate(),
      0,
      0,
      0,
      0,
    );
    const targetDayEnd = new Date(
      calendarDay.getFullYear(),
      calendarDay.getMonth(),
      calendarDay.getDate(),
      23,
      59,
      59,
      999,
    );
    const dayOfWeek = calendarDay.getDay();

    const rows = await this.prisma.courtSchedule.findMany({
      where: {
        courtId,
        dayOfWeek,
        OR: [
          { periodStart: null, periodEnd: null },
          {
            AND: [
              { periodStart: { lte: targetDayEnd } },
              { periodEnd: { gte: targetDayStart } },
            ],
          },
        ],
      },
      orderBy: { startTimeMinutes: 'asc' },
    });

    return rows.map((r) => ({
      id: r.id,
      dayOfWeek: r.dayOfWeek,
      startTimeMinutes: r.startTimeMinutes,
      endTimeMinutes: r.endTimeMinutes,
      slotDurationMinutes: r.slotDurationMinutes,
    }));
  }

  private pickScheduleContainingInterval(
    schedules: CourtScheduleRow[],
    intervalStartMin: number,
    intervalEndMin: number,
  ): CourtScheduleRow | null {
    for (const s of schedules) {
      if (
        isIntervalWithinSchedule(
          intervalStartMin,
          intervalEndMin,
          s.startTimeMinutes,
          s.endTimeMinutes,
        )
      ) {
        return s;
      }
    }
    return null;
  }

  private bookingIntervalBlockedByExceptions(
    exceptions: {
      isClosedAllDay: boolean;
      startTimeMinutes: number | null;
      endTimeMinutes: number | null;
    }[],
    bookingStartMin: number,
    bookingEndMin: number,
  ): boolean {
    if (exceptions.some((e) => e.isClosedAllDay)) return true;
    return exceptions.some((e) => {
      if (
        typeof e.startTimeMinutes !== 'number' ||
        typeof e.endTimeMinutes !== 'number'
      ) {
        return false;
      }
      return (
        e.startTimeMinutes < bookingEndMin && e.endTimeMinutes > bookingStartMin
      );
    });
  }

  private minutesOverlap(
    aStart: number,
    aEnd: number,
    bStart: number,
    bEnd: number,
  ): boolean {
    return aStart < bEnd && aEnd > bStart;
  }

  private buildRegularSlotIntervalsFromSchedules(
    schedules: Array<{
      startTimeMinutes: number;
      endTimeMinutes: number;
      slotDurationMinutes: number;
      pricePerHour: number;
    }>,
    targetDate: Date,
  ): Array<{ start: number; end: number; pricePerHour: number }> {
    const generatedByKey = new Map<
      string,
      { start: number; end: number; pricePerHour: number }
    >();
    const sortedRows = [...schedules].sort(
      (a, b) => a.startTimeMinutes - b.startTimeMinutes,
    );
    for (const schedule of sortedRows) {
      let current = schedule.startTimeMinutes;
      const pricePerHour = schedule.pricePerHour ?? 0;
      const effectiveEnd = effectiveEndTimeMinutes(
        schedule.startTimeMinutes,
        schedule.endTimeMinutes,
      );
      while (current + schedule.slotDurationMinutes <= effectiveEnd) {
        const end = current + schedule.slotDurationMinutes;
        const key = `${current}-${end}`;
        if (!generatedByKey.has(key)) {
          generatedByKey.set(key, { start: current, end, pricePerHour });
        }
        current = end;
      }
    }
    return Array.from(generatedByKey.values()).sort(
      (a, b) => a.start - b.start,
    );
  }

  private mergeCancelledSlotsIntoExceptions(
    dbExceptions: Array<{
      isClosedAllDay: boolean;
      startTimeMinutes: number | null;
      endTimeMinutes: number | null;
    }>,
    clientCancelled?: Array<{
      startTimeMinutes: number;
      endTimeMinutes: number;
    }>,
  ): Array<{
    isClosedAllDay: boolean;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
  }> {
    const merged = dbExceptions.map((e) => ({ ...e }));
    for (const range of clientCancelled ?? []) {
      const dup = merged.some(
        (e) =>
          !e.isClosedAllDay &&
          e.startTimeMinutes === range.startTimeMinutes &&
          e.endTimeMinutes === range.endTimeMinutes,
      );
      if (!dup) {
        merged.push({
          isClosedAllDay: false,
          startTimeMinutes: range.startTimeMinutes,
          endTimeMinutes: range.endTimeMinutes,
        });
      }
    }
    return merged;
  }

  private formatMinutesLabel(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  private assertCustomSlotDoesNotOverlapActiveSlots(
    customStart: number,
    customEnd: number,
    regularIntervals: Array<{ start: number; end: number }>,
    exceptions: Array<{
      isClosedAllDay: boolean;
      startTimeMinutes: number | null;
      endTimeMinutes: number | null;
    }>,
    existingCustom: Array<{ startTimeMinutes: number; endTimeMinutes: number }>,
  ): void {
    for (const interval of regularIntervals) {
      const cancelled = this.bookingIntervalBlockedByExceptions(
        exceptions,
        interval.start,
        interval.end,
      );
      if (cancelled) continue;
      if (
        this.minutesOverlap(
          customStart,
          customEnd,
          interval.start,
          interval.end,
        )
      ) {
        throw new BadRequestException(
          `El horario se superpone con el turno ${this.formatMinutesLabel(interval.start)}-${this.formatMinutesLabel(interval.end)} que no está cancelado. Cancelalo primero o guardá las excepciones con "Listo".`,
        );
      }
    }
    for (const custom of existingCustom) {
      if (
        this.minutesOverlap(
          customStart,
          customEnd,
          custom.startTimeMinutes,
          custom.endTimeMinutes,
        )
      ) {
        throw new BadRequestException(
          'El horario se superpone con otro turno personalizado',
        );
      }
    }
  }

  private async findCustomSlotAtStart(
    courtId: string,
    targetDayStart: Date,
    startMinutes: number,
  ) {
    return this.prisma.courtCustomSlot.findFirst({
      where: {
        courtId,
        date: targetDayStart,
        startTimeMinutes: startMinutes,
      },
    });
  }

  private intervalsOverlapDateRange(
    aStart: Date,
    aEnd: Date,
    bStart: Date,
    bEnd: Date,
  ): boolean {
    return aStart < bEnd && aEnd > bStart;
  }

  private localDateKeyFromDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private filterSchedulesActiveOnCalendarDay(
    rows: Array<{
      id: string;
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
      slotDurationMinutes: number;
      periodStart: Date | null;
      periodEnd: Date | null;
    }>,
    calendarDay: Date,
  ): CourtScheduleRow[] {
    const targetDayStart = new Date(
      calendarDay.getFullYear(),
      calendarDay.getMonth(),
      calendarDay.getDate(),
      0,
      0,
      0,
      0,
    );
    const targetDayEnd = new Date(
      calendarDay.getFullYear(),
      calendarDay.getMonth(),
      calendarDay.getDate(),
      23,
      59,
      59,
      999,
    );
    const dow = calendarDay.getDay();

    return rows
      .filter((row) => {
        if (row.dayOfWeek !== dow) return false;
        if (!row.periodStart || !row.periodEnd) return true;
        const ps = new Date(row.periodStart);
        const pe = new Date(row.periodEnd);
        return (
          ps.getTime() <= targetDayEnd.getTime() &&
          pe.getTime() >= targetDayStart.getTime()
        );
      })
      .map((r) => ({
        id: r.id,
        dayOfWeek: r.dayOfWeek,
        startTimeMinutes: r.startTimeMinutes,
        endTimeMinutes: r.endTimeMinutes,
        slotDurationMinutes: r.slotDurationMinutes,
      }));
  }

  async createCourtBooking(
    clubId: string,
    courtId: string,
    userId: string,
    dto: CreateCourtBookingDto,
  ) {
    await this.assertPlayerCanAccessCourt(clubId, courtId, userId);

    const manualGuestsInput = this.parseManualGuestsForCreate(dto.manualGuests);

    const manualNotesTrimmed = dto.manualNotes?.trim() ?? '';

    const manualGuestsRequested =
      dto.manualGuests !== null && dto.manualGuests !== undefined;

    const wantsManualClubFields =
      manualGuestsRequested || manualNotesTrimmed.length > 0;

    if (wantsManualClubFields) {
      await this.assertClubOwner(clubId, userId);
    }

    if (manualGuestsRequested && manualGuestsInput.length === 0) {
      throw new BadRequestException(
        'Indicá al menos un jugador con nombre para la reserva manual',
      );
    }

    const start = new Date(dto.start);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Invalid start datetime');
    }

    const minutesFromMidnight = start.getHours() * 60 + start.getMinutes();

    const calendarDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const targetDayStart = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0,
      0,
    );

    const customSlotAtStart = await this.findCustomSlotAtStart(
      courtId,
      targetDayStart,
      minutesFromMidnight,
    );

    const schedules = await this.getCourtSchedulesForCalendarDay(
      courtId,
      start,
    );

    let endMinutes: number;
    let scheduleForBooking: CourtScheduleRow | null;

    if (customSlotAtStart) {
      endMinutes = customSlotAtStart.endTimeMinutes;
      if (
        dto.durationMinutes !== undefined &&
        dto.durationMinutes !== null &&
        Number.isFinite(Number(dto.durationMinutes)) &&
        Number(dto.durationMinutes) !== endMinutes - minutesFromMidnight
      ) {
        throw new BadRequestException(
          'La duración no coincide con el turno personalizado',
        );
      }
      scheduleForBooking =
        this.pickScheduleContainingInterval(
          schedules,
          minutesFromMidnight,
          endMinutes,
        ) ?? schedules[0] ?? null;
    } else if (
      dto.durationMinutes !== undefined &&
      dto.durationMinutes !== null &&
      Number.isFinite(Number(dto.durationMinutes))
    ) {
      const dm = Number(dto.durationMinutes);
      if (dm < 1 || dm > 24 * 60) {
        throw new BadRequestException('Invalid durationMinutes');
      }
      endMinutes = minutesFromMidnight + dm;
      if (endMinutes > 24 * 60) {
        throw new BadRequestException('Booking cannot cross midnight');
      }
      scheduleForBooking = this.pickScheduleContainingInterval(
        schedules,
        minutesFromMidnight,
        endMinutes,
      );
    } else {
      const schedule = schedules.find((s) =>
        isMinuteWithinSchedule(
          minutesFromMidnight,
          s.startTimeMinutes,
          s.endTimeMinutes,
        ),
      );
      if (!schedule) {
        throw new BadRequestException(
          'No schedule for this court at the given time',
        );
      }
      const slotOffset = minutesFromMidnight - schedule.startTimeMinutes;
      if (slotOffset % schedule.slotDurationMinutes !== 0) {
        throw new BadRequestException(
          'Start time is not aligned with slot duration',
        );
      }
      endMinutes = minutesFromMidnight + schedule.slotDurationMinutes;
      const scheduleEffectiveEnd = effectiveEndTimeMinutes(
        schedule.startTimeMinutes,
        schedule.endTimeMinutes,
      );
      if (endMinutes > scheduleEffectiveEnd) {
        throw new BadRequestException('Slot exceeds schedule end time');
      }
      scheduleForBooking = schedule;
    }

    if (!customSlotAtStart && !scheduleForBooking) {
      throw new BadRequestException(
        'No schedule for this court at the given time',
      );
    }

    const end = dateFromScheduleAbsoluteMinutes(calendarDay, endMinutes);

    const exceptions = await this.prisma.courtScheduleException.findMany({
      where: { courtId, date: targetDayStart },
    });
    if (
      !customSlotAtStart &&
      this.bookingIntervalBlockedByExceptions(
        exceptions,
        minutesFromMidnight,
        endMinutes,
      )
    ) {
      throw new BadRequestException(
        'Court availability is blocked at this time',
      );
    }

    const inviteCode = await this.generateUniqueInviteCode();

    const booking = await this.prisma.$transaction(async (tx) => {
      await this.cancelTentativePublicMatchesOverlapping(
        tx,
        courtId,
        start,
        end,
      );

      const overlapping = await tx.courtBooking.findFirst({
        where: {
          courtId,
          start: { lt: end },
          end: { gt: start },
          status: { in: ['PENDING', 'CONFIRMED'] },
          occupiesSlot: true,
        },
      });

      if (overlapping) {
        throw new BadRequestException('Slot already booked');
      }

      return tx.courtBooking.create({
        data: {
          courtId,
          userId,
          start,
          end,
          status: 'CONFIRMED',
          occupiesSlot: true,
          inviteCode,
          ...(manualGuestsInput.length > 0
            ? {
                manualGuests:
                  manualGuestsInput as unknown as Prisma.InputJsonValue,
                manualClubNotes:
                  manualNotesTrimmed.length > 0 ? manualNotesTrimmed : null,
              }
            : manualNotesTrimmed.length > 0
              ? { manualClubNotes: manualNotesTrimmed }
              : {}),
        },
      });
    });

    void this.notifyClosedCourtBookingMail(booking.id).catch((err) => {
      this.logger.warn(`notifyClosedCourtBookingMail: ${String(err)}`);
    });

    return booking;
  }

  /**
   * Turnos fijos recurrentes (materializados). Solo el dueño del club.
   * `preview`: solo análisis. Si hay solape ocupado → error 409. Si hay tentativos solapados → confirmRemoveOverlapping.
   */
  async createFixedSeriesBookings(
    clubId: string,
    courtId: string,
    userId: string,
    dto: CreateFixedSeriesBookingsDto,
  ) {
    await this.assertClubOwner(clubId, userId);

    const court = await this.prisma.court.findFirst({
      where: { id: courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    const startDay = this.parseLocalDateOnly(dto.startDate);
    if (startDay.getDay() !== dto.dayOfWeek) {
      throw new BadRequestException(
        'startDate must be the same weekday as dayOfWeek',
      );
    }

    let endDay: Date;
    if (dto.endDate?.trim()) {
      endDay = this.parseLocalDateOnly(dto.endDate);
      if (endDay.getTime() < startDay.getTime()) {
        throw new BadRequestException('endDate must be on or after startDate');
      }
    } else {
      endDay = new Date(startDay);
      endDay.setFullYear(endDay.getFullYear() + FIXED_SERIES_DEFAULT_YEARS);
    }

    const startMin = dto.startTimeMinutes;
    const endMin = startMin + dto.durationMinutes;
    if (endMin > 24 * 60) {
      throw new BadRequestException(
        'Fixed series occurrence cannot cross midnight',
      );
    }

    const allScheduleRows = await this.prisma.courtSchedule.findMany({
      where: { courtId, dayOfWeek: dto.dayOfWeek },
    });

    const excRangeStart = new Date(
      startDay.getFullYear(),
      startDay.getMonth(),
      startDay.getDate(),
    );
    const excRangeEnd = new Date(
      endDay.getFullYear(),
      endDay.getMonth(),
      endDay.getDate(),
    );

    const allExceptions = await this.prisma.courtScheduleException.findMany({
      where: {
        courtId,
        date: { gte: excRangeStart, lte: excRangeEnd },
      },
    });

    const exceptionsByDayKey = new Map<
      string,
      Array<{
        isClosedAllDay: boolean;
        startTimeMinutes: number | null;
        endTimeMinutes: number | null;
      }>
    >();
    for (const ex of allExceptions) {
      const dk = this.localDateKeyFromDate(ex.date);
      const arr = exceptionsByDayKey.get(dk) ?? [];
      arr.push(ex);
      exceptionsByDayKey.set(dk, arr);
    }

    const occurrences: { start: Date; end: Date }[] = [];
    const skippedNoScheduleDates: string[] = [];
    for (
      let d = new Date(startDay);
      d.getTime() <= endDay.getTime();
      d.setDate(d.getDate() + 7)
    ) {
      const schedules = this.filterSchedulesActiveOnCalendarDay(
        allScheduleRows,
        d,
      );
      const schedule = this.pickScheduleContainingInterval(
        schedules,
        startMin,
        endMin,
      );
      if (!schedule) {
        const formattedDate = this.localDateKeyFromDate(d);
        skippedNoScheduleDates.push(formattedDate);
        continue;
      }

      const dk = this.localDateKeyFromDate(d);
      const exceptions = exceptionsByDayKey.get(dk) ?? [];
      if (
        this.bookingIntervalBlockedByExceptions(exceptions, startMin, endMin)
      ) {
        throw new BadRequestException(
          `Court has an availability exception on ${dk}`,
        );
      }

      occurrences.push({
        start: this.combineLocalDateAndMinutes(d, startMin),
        end: this.combineLocalDateAndMinutes(d, endMin),
      });
    }

    if (occurrences.length === 0) {
      const startLabel = `${String(Math.floor(startMin / 60)).padStart(2, '0')}:${String(startMin % 60).padStart(2, '0')}`;
      const endLabel = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
      throw new BadRequestException(
        `No schedule covers this interval (${startLabel}-${endLabel}) in the requested date range`,
      );
    }

    const minStart = occurrences[0].start;
    const maxEnd = occurrences[occurrences.length - 1].end;

    const existingInRange = await this.prisma.courtBooking.findMany({
      where: {
        courtId,
        start: { lt: maxEnd },
        end: { gt: minStart },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    const overlapsOcc = (b: { start: Date; end: Date }) =>
      occurrences.some((o) =>
        this.intervalsOverlapDateRange(b.start, b.end, o.start, o.end),
      );

    const blocking = existingInRange.filter(
      (b) => this.bookingOccupiesSlotRow(b) && overlapsOcc(b),
    );
    const removable = existingInRange.filter(
      (b) => !this.bookingOccupiesSlotRow(b) && overlapsOcc(b),
    );

    const guestNameTrim = dto.guestName?.trim() ?? '';
    const guestPhoneTrim = dto.guestPhone?.trim() ?? '';
    const notesTrim = dto.notes?.trim() ?? '';
    const manualGuestsForSeries =
      guestNameTrim.length > 0
        ? [{ name: guestNameTrim, phone: guestPhoneTrim || null }]
        : [];
    if (guestNameTrim.length > 200) {
      throw new BadRequestException('Nombre de jugador demasiado largo');
    }
    if (guestPhoneTrim.length > 40) {
      throw new BadRequestException('Teléfono demasiado largo');
    }

    const rulePayload = {
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
      dayOfWeek: dto.dayOfWeek,
      startTimeMinutes: dto.startTimeMinutes,
      durationMinutes: dto.durationMinutes,
      guestName: guestNameTrim || null,
      guestPhone: guestPhoneTrim || null,
      notes: notesTrim || null,
    };

    if (dto.preview) {
      return {
        preview: true,
        occurrenceCount: occurrences.length,
        skippedNoScheduleDates,
        blockedByOccupied: blocking.map((b) => ({
          id: b.id,
          start: b.start.toISOString(),
          end: b.end.toISOString(),
        })),
        removableOverlaps: removable.map((b) => ({
          id: b.id,
          start: b.start.toISOString(),
          end: b.end.toISOString(),
        })),
        canProceed: blocking.length === 0,
      };
    }

    if (blocking.length > 0) {
      throw new ConflictException({
        message:
          'Hay reservas que ocupan slot en el horario del turno fijo; no se puede crear.',
        blockingBookingIds: blocking.map((b) => b.id),
      });
    }

    if (removable.length > 0 && dto.confirmRemoveOverlapping !== true) {
      throw new BadRequestException({
        message:
          'Hay turnos superpuestos que se pueden eliminar; confirmá con confirmRemoveOverlapping.',
        removableBookingIds: removable.map((b) => b.id),
        requiresConfirmation: true,
      });
    }

    const seriesId = randomUUID();

    const result = await this.prisma.$transaction(async (tx) => {
      if (removable.length > 0) {
        await tx.courtBooking.updateMany({
          where: { id: { in: removable.map((b) => b.id) } },
          data: { status: 'CANCELLED' },
        });
      }

      const batchSize = 80;
      for (let i = 0; i < occurrences.length; i += batchSize) {
        const slice = occurrences.slice(i, i + batchSize);
        await tx.courtBooking.createMany({
          data: slice.map((occ, j) => ({
            courtId,
            userId,
            start: occ.start,
            end: occ.end,
            status: 'CONFIRMED' as const,
            occupiesSlot: true,
            isFixedSeries: true,
            fixedSeriesId: seriesId,
            fixedSeriesOccurrenceIndex: i + j,
            fixedSeriesRule: rulePayload as unknown as Prisma.InputJsonValue,
            inviteCode: null,
            ...(manualGuestsForSeries.length > 0
              ? {
                  manualGuests:
                    manualGuestsForSeries as unknown as Prisma.InputJsonValue,
                }
              : {}),
            ...(notesTrim.length > 0 ? { manualClubNotes: notesTrim } : {}),
          })),
        });
      }

      return {
        preview: false,
        seriesId,
        created: occurrences.length,
        skippedNoScheduleDates,
        cancelledBookingIds: removable.map((b) => b.id),
      };
    });

    const createdRows = await this.prisma.courtBooking.findMany({
      where: { fixedSeriesId: result.seriesId },
      select: { id: true },
    });
    for (const row of createdRows) {
      void this.notifyClosedCourtBookingMail(row.id).catch((err) => {
        this.logger.warn(`notifyClosedCourtBookingMail series: ${String(err)}`);
      });
    }

    return result;
  }

  private getDashboardWindows(range: 'today' | 'week' | 'month') {
    const now = new Date();
    const todayStart = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    let periodStart: Date;
    let periodEnd: Date;

    if (range === 'today') {
      periodStart = todayStart;
      periodEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    } else if (range === 'week') {
      periodStart = todayStart;
      periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      periodStart = todayStart;
      periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const durationMs = periodEnd.getTime() - periodStart.getTime();
    const prevPeriodEnd = periodStart;
    const prevPeriodStart = new Date(prevPeriodEnd.getTime() - durationMs);

    return { periodStart, periodEnd, prevPeriodStart, prevPeriodEnd };
  }

  private parsePricePerHourMap(pricing: unknown): Map<string, number> {
    const m = new Map<string, number>();
    if (!Array.isArray(pricing)) return m;
    for (const row of pricing) {
      if (
        row &&
        typeof row === 'object' &&
        'day' in row &&
        'pricePerHour' in row
      ) {
        const day = String((row as { day: unknown }).day).toLowerCase();
        const p = Number((row as { pricePerHour: unknown }).pricePerHour);
        if (!Number.isNaN(p)) m.set(day, p);
      }
    }
    return m;
  }

  private hourPriceForInstant(
    priceMap: Map<string, number>,
    instant: Date,
    fallback: number,
  ): number {
    const keys = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ] as const;
    const localKey = keys[instant.getDay()];
    const utcKey = keys[instant.getUTCDay()];
    return priceMap.get(localKey) ?? priceMap.get(utcKey) ?? fallback;
  }

  private sumAvailableMinutesForClub(
    courts: {
      schedules: {
        dayOfWeek: number;
        startTimeMinutes: number;
        endTimeMinutes: number;
      }[];
    }[],
    periodStart: Date,
    periodEnd: Date,
  ): number {
    let total = 0;
    for (const court of courts) {
      total += this.availableMinutesForCourt(
        court.schedules,
        periodStart,
        periodEnd,
      );
    }
    return total;
  }

  private availableMinutesForCourt(
    schedules: {
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
    }[],
    periodStart: Date,
    periodEnd: Date,
  ): number {
    let total = 0;
    const dayMs = 24 * 60 * 60 * 1000;
    for (let t = periodStart.getTime(); t < periodEnd.getTime(); t += dayMs) {
      const d = new Date(t);
      const dow = d.getUTCDay();
      for (const s of schedules) {
        if (s.dayOfWeek === dow) {
          total += scheduleDurationMinutes(
            s.startTimeMinutes,
            s.endTimeMinutes,
          );
        }
      }
    }
    return total;
  }

  private sumAvailableSlotsForClub(
    courts: {
      schedules: {
        dayOfWeek: number;
        startTimeMinutes: number;
        endTimeMinutes: number;
        slotDurationMinutes: number;
      }[];
    }[],
    periodStart: Date,
    periodEnd: Date,
  ): number {
    let total = 0;
    for (const court of courts) {
      total += this.availableSlotsForCourt(
        court.schedules,
        periodStart,
        periodEnd,
      );
    }
    return total;
  }

  private availableSlotsForCourt(
    schedules: {
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
      slotDurationMinutes: number;
    }[],
    periodStart: Date,
    periodEnd: Date,
  ): number {
    let total = 0;
    const dayMs = 24 * 60 * 60 * 1000;
    for (let t = periodStart.getTime(); t < periodEnd.getTime(); t += dayMs) {
      const d = new Date(t);
      const dow = d.getUTCDay();
      for (const s of schedules) {
        if (s.dayOfWeek === dow) {
          const scheduleMinutes = scheduleDurationMinutes(
            s.startTimeMinutes,
            s.endTimeMinutes,
          );
          const slotMinutes =
            Number.isFinite(s.slotDurationMinutes) && s.slotDurationMinutes > 0
              ? s.slotDurationMinutes
              : scheduleMinutes;
          total += Math.floor(scheduleMinutes / slotMinutes);
        }
      }
    }
    return total;
  }

  private overlapMs(
    bookingStart: Date,
    bookingEnd: Date,
    windowStart: Date,
    windowEnd: Date,
  ): number {
    const s = Math.max(bookingStart.getTime(), windowStart.getTime());
    const e = Math.min(bookingEnd.getTime(), windowEnd.getTime());
    return Math.max(0, e - s);
  }

  private startOfUtcDay(d: Date): Date {
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
    );
  }

  private scheduleHourPriceForInstant(
    schedules:
      | {
          dayOfWeek: number;
          startTimeMinutes: number;
          endTimeMinutes: number;
          pricePerHour: number;
        }[]
      | null
      | undefined,
    instant: Date,
  ): number | null {
    if (!schedules?.length) return null;
    const localDow = instant.getDay();
    const localMinute = instant.getHours() * 60 + instant.getMinutes();
    const utcDow = instant.getUTCDay();
    const utcMinute = instant.getUTCHours() * 60 + instant.getUTCMinutes();
    const hasValidRate = (s: {
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
      pricePerHour: number;
    }) => Number.isFinite(s.pricePerHour) && s.pricePerHour > 0;
    const match =
      schedules.find(
        (s) =>
          hasValidRate(s) &&
          s.dayOfWeek === localDow &&
          s.startTimeMinutes <= localMinute &&
          s.endTimeMinutes > localMinute,
      ) ??
      schedules.find(
        (s) =>
          hasValidRate(s) &&
          s.dayOfWeek === utcDow &&
          s.startTimeMinutes <= utcMinute &&
          s.endTimeMinutes > utcMinute,
      );
    return match?.pricePerHour ?? null;
  }

  private confirmedBookingRevenueDetailsInWindow(
    bookingStart: Date,
    bookingEnd: Date,
    priceMap: Map<string, number>,
    defaultHourPrice: number,
    courtSchedules:
      | Array<{
          dayOfWeek: number;
          startTimeMinutes: number;
          endTimeMinutes: number;
          pricePerHour: number;
        }>
      | null
      | undefined,
    windowStart: Date,
    windowEnd: Date,
  ): { total: number; byWeekday: number[] } {
    const byWeekday = [0, 0, 0, 0, 0, 0, 0];
    const i0 = Math.max(bookingStart.getTime(), windowStart.getTime());
    const i1 = Math.min(bookingEnd.getTime(), windowEnd.getTime());
    if (i0 >= i1) return { total: 0, byWeekday };

    let total = 0;
    let cursor = i0;
    const dayMs = 24 * 60 * 60 * 1000;
    while (cursor < i1) {
      const cursorDate = new Date(cursor);
      const dayStart = this.startOfUtcDay(cursorDate);
      const nextDayStart = dayStart.getTime() + dayMs;
      const segmentEnd = Math.min(nextDayStart, i1);
      const hours = (segmentEnd - cursor) / (60 * 60 * 1000);
      const slotRate = this.scheduleHourPriceForInstant(
        courtSchedules,
        cursorDate,
      );
      const rate =
        slotRate ??
        this.hourPriceForInstant(priceMap, cursorDate, defaultHourPrice);
      const amt = hours * rate;
      total += amt;
      byWeekday[cursorDate.getUTCDay()] += amt;
      cursor = segmentEnd;
    }
    return { total, byWeekday };
  }

  private confirmedBookingRevenueInWindow(
    bookingStart: Date,
    bookingEnd: Date,
    priceMap: Map<string, number>,
    defaultHourPrice: number,
    courtSchedules:
      | Array<{
          dayOfWeek: number;
          startTimeMinutes: number;
          endTimeMinutes: number;
          pricePerHour: number;
        }>
      | null
      | undefined,
    windowStart: Date,
    windowEnd: Date,
  ): number {
    return this.confirmedBookingRevenueDetailsInWindow(
      bookingStart,
      bookingEnd,
      priceMap,
      defaultHourPrice,
      courtSchedules,
      windowStart,
      windowEnd,
    ).total;
  }

  private getAnalyticsWindows(range: 'week' | 'month' | 'year') {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    let periodStart: Date;
    let periodEnd: Date;

    if (range === 'week') {
      const todayStart = this.startOfUtcDay(now);
      const dow = todayStart.getUTCDay();
      const daysFromMonday = dow === 0 ? 6 : dow - 1;
      periodStart = new Date(todayStart.getTime() - daysFromMonday * dayMs);
      periodEnd = new Date(periodStart.getTime() + 7 * dayMs);
    } else if (range === 'month') {
      periodStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
      );
      periodEnd = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0),
      );
    } else {
      periodStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      periodEnd = new Date(
        Date.UTC(now.getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0),
      );
    }

    const durationMs = periodEnd.getTime() - periodStart.getTime();
    const prevPeriodEnd = periodStart;
    const prevPeriodStart = new Date(prevPeriodEnd.getTime() - durationMs);
    return { periodStart, periodEnd, prevPeriodStart, prevPeriodEnd };
  }

  private readonly peakHourBucketDefs = [
    { startMin: 7 * 60, endMin: 9 * 60, label: '07:00–09:00' },
    { startMin: 9 * 60, endMin: 12 * 60, label: '09:00–12:00' },
    { startMin: 12 * 60, endMin: 16 * 60, label: '12:00–16:00' },
    { startMin: 16 * 60, endMin: 20 * 60, label: '16:00–20:00' },
    { startMin: 20 * 60, endMin: 23 * 60, label: '20:00–23:00' },
  ] as const;

  private addBookedMinutesToPeakBuckets(
    bookingStart: Date,
    bookingEnd: Date,
    windowStart: Date,
    windowEnd: Date,
    acc: number[],
  ): void {
    const i0 = Math.max(bookingStart.getTime(), windowStart.getTime());
    const i1 = Math.min(bookingEnd.getTime(), windowEnd.getTime());
    if (i0 >= i1) return;

    const dayMs = 24 * 60 * 60 * 1000;
    const buckets = this.peakHourBucketDefs;
    let cursor = i0;
    while (cursor < i1) {
      const cursorDate = new Date(cursor);
      const dayStart = this.startOfUtcDay(cursorDate);
      const nextDayStart = dayStart.getTime() + dayMs;
      const segmentEnd = Math.min(nextDayStart, i1);
      const m0 = (cursor - dayStart.getTime()) / 60000;
      const m1 = (segmentEnd - dayStart.getTime()) / 60000;
      for (let i = 0; i < buckets.length; i++) {
        const b = buckets[i];
        const lo = Math.max(m0, b.startMin);
        const hi = Math.min(m1, b.endMin);
        if (hi > lo) acc[i] += hi - lo;
      }
      cursor = segmentEnd;
    }
  }

  private sumAvailableMinutesInPeakBuckets(
    courts: {
      schedules: {
        dayOfWeek: number;
        startTimeMinutes: number;
        endTimeMinutes: number;
      }[];
    }[],
    periodStart: Date,
    periodEnd: Date,
  ): number[] {
    const acc = this.peakHourBucketDefs.map(() => 0);
    const buckets = this.peakHourBucketDefs;
    const dayMs = 24 * 60 * 60 * 1000;
    for (let t = periodStart.getTime(); t < periodEnd.getTime(); t += dayMs) {
      const d = new Date(t);
      const dow = d.getUTCDay();
      for (const court of courts) {
        for (const s of court.schedules) {
          if (s.dayOfWeek !== dow) continue;
          const sz = s.startTimeMinutes;
          const ez = s.endTimeMinutes;
          for (let i = 0; i < buckets.length; i++) {
            const b = buckets[i];
            const lo = Math.max(sz, b.startMin);
            const hi = Math.min(ez, b.endMin);
            if (hi > lo) acc[i] += hi - lo;
          }
        }
      }
    }
    return acc;
  }

  private trendPercent(current: number, previous: number): number | null {
    if (previous === 0) return null;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  private parseManualBookingGuests(
    raw: Prisma.JsonValue | null | undefined,
  ): { name: string; phone: string | null }[] {
    let value: unknown = raw;
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value) as unknown;
      } catch {
        return [];
      }
    }
    if (!value || !Array.isArray(value)) return [];
    const out: { name: string; phone: string | null }[] = [];
    for (const item of value) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      const name = typeof o.name === 'string' ? o.name.trim() : '';
      if (!name.length) continue;
      const phoneRaw = o.phone ?? o.phoneNumber ?? o.phone_number;
      const phone =
        typeof phoneRaw === 'string' && phoneRaw.trim().length > 0
          ? phoneRaw.trim()
          : null;
      out.push({ name, phone });
    }
    return out;
  }

  private parseManualGuestsForCreate(raw: unknown): {
    name: string;
    phone: string | null;
  }[] {
    if (raw == null) return [];
    if (!Array.isArray(raw)) {
      throw new BadRequestException('manualGuests debe ser un arreglo');
    }
    const out: { name: string; phone: string | null }[] = [];
    for (const item of raw) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      const name = typeof o.name === 'string' ? o.name.trim() : '';
      if (!name.length) continue;
      if (name.length > 200) {
        throw new BadRequestException('Nombre de jugador demasiado largo');
      }
      const phoneRaw = o.phone ?? o.phoneNumber ?? o.phone_number;
      const phone =
        typeof phoneRaw === 'string' && phoneRaw.trim().length > 0
          ? phoneRaw.trim()
          : null;
      if (phone && phone.length > 40) {
        throw new BadRequestException('Teléfono demasiado largo');
      }
      out.push({ name, phone });
    }
    return out;
  }

  private async assertClubOwner(clubId: string, userId: string) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Club not found');
    if (club.createdBy !== userId) {
      throw new ForbiddenException('You are not the owner of this club');
    }
  }

  async approveCourtBooking(clubId: string, bookingId: string, userId: string) {
    await this.assertClubOwner(clubId, userId);

    const booking = await this.prisma.courtBooking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const court = await this.prisma.court.findUnique({
      where: { id: booking.courtId },
    });
    if (!court || court.clubId !== clubId) {
      throw new NotFoundException('Booking not found for this club');
    }

    return this.prisma.courtBooking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });
  }

  async rejectCourtBooking(clubId: string, bookingId: string, userId: string) {
    await this.assertClubOwner(clubId, userId);

    const booking = await this.prisma.courtBooking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const court = await this.prisma.court.findUnique({
      where: { id: booking.courtId },
    });
    if (!court || court.clubId !== clubId) {
      throw new NotFoundException('Booking not found for this club');
    }

    return this.prisma.courtBooking.update({
      where: { id: bookingId },
      data: { status: 'REJECTED' },
    });
  }

  async cancelCourtBooking(clubId: string, bookingId: string, userId: string) {
    const booking = await this.prisma.courtBooking.findUnique({
      where: { id: bookingId },
      include: { court: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.court.clubId !== clubId) {
      throw new NotFoundException('Booking not found for this club');
    }

    const now = new Date();
    if (booking.end <= now) {
      throw new BadRequestException(
        'No se pueden cancelar reservas que ya han finalizado',
      );
    }

    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: { createdBy: true },
    });
    const isClubOwner = club?.createdBy === userId;
    const isBookingOwner = booking.userId === userId;
    if (!isClubOwner && !isBookingOwner) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    return this.prisma.courtBooking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }

  async listUserBookings(userId: string) {
    const now = new Date();

    const bookings = await this.prisma.courtBooking.findMany({
      where: {
        OR: [{ userId }, { participants: { some: { profileId: userId } } }],
      },
      include: {
        court: {
          include: {
            club: true,
          },
        },
        participants: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { start: 'asc' },
    });

    const upcoming: unknown[] = [];
    const history: unknown[] = [];

    for (const booking of bookings) {
      const view = {
        id: booking.id,
        ownerId: booking.userId,
        isMatch: booking.isMatch,
        visibility: booking.visibility,
        club: {
          id: booking.court.club.id,
          name: booking.court.club.name,
          address: booking.court.club.address,
          avatarUrl: booking.court.club.avatarUrl,
        },
        court: {
          id: booking.court.id,
          name: booking.court.name,
          type: booking.court.type,
        },
        time: {
          start: booking.start,
          end: booking.end,
        },
        status: booking.status,
        participants: booking.participants.map((p) => ({
          id: p.profileId,
          fullName: p.profile.fullName,
          avatarUrl: p.profile.avatarUrl,
        })),
      };

      if (
        booking.status === 'CANCELLED' ||
        booking.status === 'REJECTED' ||
        booking.end < now
      ) {
        history.push(view);
      } else {
        upcoming.push(view);
      }
    }

    return { upcoming, history };
  }

  async listClubBookings(
    clubId: string,
    userId: string,
    query: QueryClubBookingsDto,
  ) {
    await this.assertClubOwner(clubId, userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.CourtBookingWhereInput = {
      court: { clubId },
      ...(query.status ? { status: query.status } : {}),
      ...(query.from || query.to
        ? {
            start: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              {
                court: {
                  name: { contains: query.search, mode: 'insensitive' },
                },
              },
              {
                title: { contains: query.search, mode: 'insensitive' },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.courtBooking.findMany({
        where,
        include: {
          court: { include: { schedules: true } },
          participants: {
            include: { profile: true },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { start: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.courtBooking.count({ where }),
    ]);

    const ownerIds = Array.from(new Set(data.map((b) => b.userId)));
    const profiles = ownerIds.length
      ? await this.prisma.profile.findMany({
          where: { id: { in: ownerIds } },
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            phone: true,
            email: true,
            level: true,
          },
        })
      : [];
    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const ownerIdsWithoutEmail = ownerIds.filter((id) => {
      const email = profileMap.get(id)?.email;
      return !(typeof email === 'string' && email.trim().length > 0);
    });
    const authEmailMap =
      ownerIdsWithoutEmail.length > 0
        ? await this.resolveEmailsFromAuth(ownerIdsWithoutEmail)
        : new Map<string, string>();

    return {
      data: data.map((booking) => {
        const ownerProfile = profileMap.get(booking.userId);
        const manualGuestList = this.parseManualBookingGuests(
          booking.manualGuests,
        );
        const manualFirst = manualGuestList[0];
        const user =
          manualFirst != null
            ? {
                fullName: manualFirst.name,
                avatarUrl: null as string | null,
                phone: manualFirst.phone,
                email: null as string | null,
                level: null as number | null,
              }
            : {
                fullName: ownerProfile?.fullName ?? null,
                avatarUrl: ownerProfile?.avatarUrl ?? null,
                phone: ownerProfile?.phone ?? null,
                email:
                  ownerProfile?.email?.trim() ||
                  authEmailMap.get(booking.userId) ||
                  null,
                level: ownerProfile?.level ?? null,
              };

        const startDate = booking.start;
        const localMinutes = startDate.getHours() * 60 + startDate.getMinutes();
        const utcMinutes =
          startDate.getUTCHours() * 60 + startDate.getUTCMinutes();
        const localDay = startDate.getDay();
        const utcDay = startDate.getUTCDay();
        const matchesSlot = (s: {
          dayOfWeek: number;
          startTimeMinutes: number;
          endTimeMinutes: number;
          pricePerHour: number;
        }) => Number.isFinite(s.pricePerHour) && s.pricePerHour > 0;
        const courtSchedules = Array.isArray(booking.court?.schedules)
          ? booking.court.schedules
          : [];
        const scheduleForSlot =
          courtSchedules.find(
            (s) =>
              matchesSlot(s) &&
              s.dayOfWeek === localDay &&
              s.startTimeMinutes <= localMinutes &&
              s.endTimeMinutes > localMinutes,
          ) ??
          courtSchedules.find(
            (s) =>
              matchesSlot(s) &&
              s.dayOfWeek === utcDay &&
              s.startTimeMinutes <= utcMinutes &&
              s.endTimeMinutes > utcMinutes,
          );
        const rawSlotPrice = scheduleForSlot?.pricePerHour;
        const slotPricePerHour =
          typeof rawSlotPrice === 'number' &&
          Number.isFinite(rawSlotPrice) &&
          rawSlotPrice > 0
            ? rawSlotPrice
            : null;

        return {
          id: booking.id,
          userId: booking.userId,
          isFixedSeries: booking.isFixedSeries,
          fixedSeriesId: booking.fixedSeriesId,
          fixedSeriesOccurrenceIndex: booking.fixedSeriesOccurrenceIndex,
          fixedSeriesRule: booking.fixedSeriesRule,
          user,
          court: {
            id: booking.court.id,
            name: booking.court.name,
            type: booking.court.type,
          },
          start: booking.start,
          end: booking.end,
          status: booking.status,
          createdAt: booking.createdAt,
          occupiesSlot: booking.occupiesSlot,
          isMatch: booking.isMatch,
          title: booking.title,
          maxPlayers: booking.maxPlayers,
          level: booking.level,
          visibility: booking.visibility,
          participants: booking.participants.map((p) => ({
            profileId: p.profileId,
            fullName: p.profile.fullName,
            avatarUrl: p.profile.avatarUrl,
            level: p.profile.level ?? null,
            phone: p.profile.phone ?? null,
          })),
          manualGuests:
            manualGuestList.length > 0 ? manualGuestList : undefined,
          manualClubNotes: booking.manualClubNotes ?? null,
          slotPricePerHour,
        };
      }),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getClubDashboard(
    clubId: string,
    userId: string,
    query: QueryClubDashboardDto,
  ) {
    await this.assertClubOwner(clubId, userId);

    const range = query.range ?? 'today';
    const { periodStart, periodEnd, prevPeriodStart, prevPeriodEnd } =
      this.getDashboardWindows(range);

    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      include: {
        courts: { include: { schedules: true } },
      },
    });
    if (!club) throw new NotFoundException('Club not found');

    const priceMap = this.parsePricePerHourMap(club.pricing);
    const scheduleFallbackHourPrice =
      club.courts
        .flatMap((c) => c.schedules)
        .find(
          (s) =>
            typeof s.pricePerHour === 'number' &&
            Number.isFinite(s.pricePerHour) &&
            s.pricePerHour > 0,
        )?.pricePerHour ?? 0;
    const defaultHourPrice =
      priceMap.get('monday') ??
      priceMap.get('saturday') ??
      scheduleFallbackHourPrice;
    const courtSchedulesById = new Map(
      club.courts.map((c) => [c.id, c.schedules]),
    );

    const availableCurrentSlots = this.sumAvailableSlotsForClub(
      club.courts,
      periodStart,
      periodEnd,
    );
    const availablePrevSlots = this.sumAvailableSlotsForClub(
      club.courts,
      prevPeriodStart,
      prevPeriodEnd,
    );

    const bookingWhereBase: Prisma.CourtBookingWhereInput = {
      status: 'CONFIRMED',
      court: { clubId },
    };

    const metricsBookings = await this.prisma.courtBooking.findMany({
      where: {
        AND: [
          bookingWhereBase,
          {
            OR: [
              {
                start: { lt: periodEnd },
                end: { gt: periodStart },
              },
              {
                start: { lt: prevPeriodEnd },
                end: { gt: prevPeriodStart },
              },
            ],
          },
        ],
      },
      include: { court: true },
    });

    let bookingsCurrent = 0;
    let bookingsPrev = 0;
    /** Reservas que bloquean turno (cerradas + partidos abiertos llenos confirmados). */
    let occupancyBookingsCurrent = 0;
    let occupancyBookingsPrev = 0;
    let revenueCurrent = 0;
    let revenuePrev = 0;
    const now = new Date();

    for (const b of metricsBookings) {
      const oc = this.overlapMs(b.start, b.end, periodStart, periodEnd);
      const op = this.overlapMs(b.start, b.end, prevPeriodStart, prevPeriodEnd);

      if (oc > 0) {
        bookingsCurrent += 1;
        if (this.bookingOccupiesSlotRow(b)) {
          occupancyBookingsCurrent += 1;
        }
        revenueCurrent += this.confirmedBookingRevenueInWindow(
          b.start,
          b.end,
          priceMap,
          defaultHourPrice,
          courtSchedulesById.get(b.courtId),
          periodStart,
          periodEnd,
        );
      }

      if (op > 0) {
        bookingsPrev += 1;
        if (this.bookingOccupiesSlotRow(b)) {
          occupancyBookingsPrev += 1;
        }
        revenuePrev += this.confirmedBookingRevenueInWindow(
          b.start,
          b.end,
          priceMap,
          defaultHourPrice,
          courtSchedulesById.get(b.courtId),
          prevPeriodStart,
          prevPeriodEnd,
        );
      }
    }

    const occCurrent =
      availableCurrentSlots > 0
        ? Math.min(
            100,
            (occupancyBookingsCurrent / availableCurrentSlots) * 100,
          )
        : 0;
    const occPrev =
      availablePrevSlots > 0
        ? Math.min(100, (occupancyBookingsPrev / availablePrevSlots) * 100)
        : 0;

    const todayStartUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const todayEndUtc = new Date(todayStartUtc);
    todayEndUtc.setUTCDate(todayEndUtc.getUTCDate() + 1);

    /** Reservas confirmadas que solapan el día UTC (incluye partidos privados del club y turnos ya pasados hoy). */
    const todayOverlappingBookings = await this.prisma.courtBooking.findMany({
      where: {
        court: { clubId },
        status: 'CONFIRMED',
        start: { lt: todayEndUtc },
        end: { gt: todayStartUtc },
      },
      include: { court: true },
      orderBy: { start: 'asc' },
    });

    const firstBookingByCourtId = new Map<
      string,
      (typeof todayOverlappingBookings)[0]
    >();
    for (const b of todayOverlappingBookings) {
      if (!firstBookingByCourtId.has(b.courtId)) {
        firstBookingByCourtId.set(b.courtId, b);
      }
    }

    const nextOwnerIds = Array.from(
      new Set([...firstBookingByCourtId.values()].map((b) => b.userId)),
    );
    const nextProfiles = nextOwnerIds.length
      ? await this.prisma.profile.findMany({
          where: { id: { in: nextOwnerIds } },
          select: { id: true, fullName: true, phone: true, email: true },
        })
      : [];
    const nextProfileMap = new Map(nextProfiles.map((p) => [p.id, p]));

    const courtsSorted = [...club.courts].sort((a, b) =>
      a.name.localeCompare(b.name, 'es'),
    );

    const nextReservationByCourt = courtsSorted.map((c) => {
      const booking = firstBookingByCourtId.get(c.id) ?? null;
      return {
        courtId: c.id,
        courtName: c.name,
        booking: booking
          ? {
              id: booking.id,
              start: booking.start.toISOString(),
              end: booking.end.toISOString(),
              status: booking.status,
              ...this.resolveNextReservationBookerDisplay(
                {
                  isMatch: booking.isMatch,
                  title: booking.title,
                  manualGuests: booking.manualGuests,
                },
                nextProfileMap.get(booking.userId),
              ),
              priceEUR:
                Math.round(
                  this.confirmedBookingRevenueInWindow(
                    booking.start,
                    booking.end,
                    priceMap,
                    defaultHourPrice,
                    courtSchedulesById.get(booking.courtId),
                    booking.start,
                    booking.end,
                  ) * 100,
                ) / 100,
            }
          : null,
      };
    });

    const openMatchRows = await this.prisma.courtBooking.findMany({
      where: {
        court: { clubId },
        isMatch: true,
        status: { in: ['PENDING', 'CONFIRMED'] },
        end: { gt: now },
      },
      include: {
        court: true,
        participants: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { start: 'asc' },
    });

    const openMatchProfileIds = new Set<string>();
    for (const b of openMatchRows) {
      openMatchProfileIds.add(b.userId);
      for (const p of b.participants) {
        openMatchProfileIds.add(p.profileId);
      }
    }
    const openMatchProfiles = openMatchProfileIds.size
      ? await this.prisma.profile.findMany({
          where: { id: { in: [...openMatchProfileIds] } },
          select: {
            id: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
          },
        })
      : [];
    const openMatchProfileMap = new Map(
      openMatchProfiles.map((p) => [p.id, p]),
    );

    const utcDay = (d: Date) => d.toISOString().slice(0, 10);
    const todayUtc = utcDay(now);
    const tomorrowUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
    )
      .toISOString()
      .slice(0, 10);

    const openMatches = openMatchRows
      .map((b) => {
        const maxP = b.maxPlayers ?? 4;
        const organizerIn = b.participants.some(
          (p) => p.profileId === b.userId,
        );
        const filled = Math.min(
          maxP,
          b.participants.length + (organizerIn ? 0 : 1),
        );
        const free = maxP - filled;
        if (free <= 0) return null;

        const startDay = utcDay(b.start);
        let dayLabel: string;
        if (startDay === todayUtc) dayLabel = 'Hoy';
        else if (startDay === tomorrowUtc) dayLabel = 'Mañana';
        else {
          dayLabel = new Intl.DateTimeFormat('es', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            timeZone: 'UTC',
          }).format(b.start);
        }

        const participantRows = b.participants.map((p) => {
          const pr = openMatchProfileMap.get(p.profileId);
          return {
            profileId: p.profileId,
            fullName: pr?.fullName ?? null,
            avatarUrl: pr?.avatarUrl ?? null,
            phone: pr?.phone ?? null,
          };
        });
        const ordered = [...participantRows].sort((a, c) => {
          if (a.profileId === b.userId) return -1;
          if (c.profileId === b.userId) return 1;
          return 0;
        });
        if (!ordered.some((r) => r.profileId === b.userId)) {
          const org = openMatchProfileMap.get(b.userId);
          ordered.unshift({
            profileId: b.userId,
            fullName: org?.fullName ?? null,
            avatarUrl: org?.avatarUrl ?? null,
            phone: org?.phone ?? null,
          });
        }

        type Slot =
          | { empty: true }
          | {
              empty: false;
              profileId: string;
              fullName: string | null;
              avatarUrl: string | null;
              phone: string | null;
              isOrganizer: boolean;
            };
        const slots: Slot[] = [];
        for (let i = 0; i < maxP; i++) {
          const r = ordered[i];
          if (r) {
            slots.push({
              empty: false,
              profileId: r.profileId,
              fullName: r.fullName,
              avatarUrl: r.avatarUrl,
              phone: r.phone,
              isOrganizer: r.profileId === b.userId,
            });
          } else {
            slots.push({ empty: true });
          }
        }

        return {
          id: b.id,
          courtName: b.court.name,
          level: b.level,
          start: b.start.toISOString(),
          end: b.end.toISOString(),
          maxPlayers: maxP,
          filledSlots: filled,
          freeSlots: free,
          dayLabel,
          slots,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return {
      range,
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString(),
      },
      comparisonLabel:
        range === 'today'
          ? 'vs. ayer'
          : range === 'week'
            ? 'vs. periodo anterior'
            : 'vs. periodo anterior',
      metrics: {
        bookings: {
          value: bookingsCurrent,
          changePercent: this.trendPercent(bookingsCurrent, bookingsPrev),
        },
        revenue: {
          valueEUR: Math.round(revenueCurrent * 100) / 100,
          changePercent: this.trendPercent(revenueCurrent, revenuePrev),
        },
        occupancy: {
          valuePercent: Math.round(occCurrent * 10) / 10,
          changePercent: this.trendPercent(occCurrent, occPrev),
        },
      },
      nextReservationByCourt,
      openMatches,
    };
  }

  async getClubAnalytics(
    clubId: string,
    userId: string,
    query: QueryClubAnalyticsDto,
  ) {
    await this.assertClubOwner(clubId, userId);

    const range = query.range ?? 'month';
    const { periodStart, periodEnd, prevPeriodStart, prevPeriodEnd } =
      this.getAnalyticsWindows(range);

    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      include: { courts: { include: { schedules: true } } },
    });
    if (!club) throw new NotFoundException('Club not found');

    const priceMap = this.parsePricePerHourMap(club.pricing);
    const scheduleFallbackHourPrice =
      club.courts
        .flatMap((c) => c.schedules)
        .find(
          (s) =>
            typeof s.pricePerHour === 'number' &&
            Number.isFinite(s.pricePerHour) &&
            s.pricePerHour > 0,
        )?.pricePerHour ?? 0;
    const defaultHourPrice =
      priceMap.get('monday') ??
      priceMap.get('saturday') ??
      scheduleFallbackHourPrice;
    const courtSchedulesById = new Map(
      club.courts.map((c) => [c.id, c.schedules]),
    );

    const bookingWhereBase: Prisma.CourtBookingWhereInput = {
      status: 'CONFIRMED',
      court: { clubId },
    };

    const bookings = await this.prisma.courtBooking.findMany({
      where: {
        AND: [
          bookingWhereBase,
          {
            OR: [
              { start: { lt: periodEnd }, end: { gt: periodStart } },
              { start: { lt: prevPeriodEnd }, end: { gt: prevPeriodStart } },
            ],
          },
        ],
      },
      include: {
        court: true,
        participants: { select: { profileId: true } },
      },
    });

    const weekdayShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monFirstOrder = [1, 2, 3, 4, 5, 6, 0];

    let revenueCurrent = 0;
    let revenuePrev = 0;
    let bookingsCurrent = 0;
    let bookingsPrev = 0;
    const revenueByWeekdayUtc = [0, 0, 0, 0, 0, 0, 0];
    const totalSlotsCurrent = this.sumAvailableSlotsForClub(
      club.courts,
      periodStart,
      periodEnd,
    );
    const totalSlotsPrev = this.sumAvailableSlotsForClub(
      club.courts,
      prevPeriodStart,
      prevPeriodEnd,
    );

    const occByCourt = new Map<string, { name: string; bookings: number }>();
    for (const c of club.courts) {
      occByCourt.set(c.id, {
        name: c.name,
        bookings: 0,
      });
    }
    const peakBookingCounts = this.peakHourBucketDefs.map(() => 0);

    const playerMap = new Map<string, { bookings: number; spend: number }>();

    for (const b of bookings) {
      const oc = this.overlapMs(b.start, b.end, periodStart, periodEnd);
      const op = this.overlapMs(b.start, b.end, prevPeriodStart, prevPeriodEnd);
      const occupies = this.bookingOccupiesSlotRow(b);

      if (oc > 0) {
        bookingsCurrent += 1;
        if (occupies) {
          const courtRow = occByCourt.get(b.courtId);
          if (courtRow) courtRow.bookings += 1;

          const bookingStartMinUtc =
            b.start.getUTCHours() * 60 + b.start.getUTCMinutes();
          const peakBucketIndex = this.peakHourBucketDefs.findIndex(
            (bucket) =>
              bookingStartMinUtc >= bucket.startMin &&
              bookingStartMinUtc < bucket.endMin,
          );
          if (peakBucketIndex >= 0) peakBookingCounts[peakBucketIndex] += 1;

          const revenueDet: { total: number; byWeekday: number[] } | null =
            this.confirmedBookingRevenueDetailsInWindow(
              b.start,
              b.end,
              priceMap,
              defaultHourPrice,
              courtSchedulesById.get(b.courtId),
              periodStart,
              periodEnd,
            );
          if (revenueDet) {
            revenueCurrent += revenueDet.total;
            for (let d0 = 0; d0 < 7; d0++) {
              revenueByWeekdayUtc[d0] += revenueDet.byWeekday[d0];
            }
          }

          if (!b.isMatch) {
            let pr = playerMap.get(b.userId);
            if (!pr) {
              pr = { bookings: 0, spend: 0 };
              playerMap.set(b.userId, pr);
            }
            pr.bookings += 1;
            if (revenueDet) pr.spend += revenueDet.total;
          } else {
            const participantIds = new Set<string>([
              b.userId,
              ...b.participants.map((p) => p.profileId),
            ]);
            for (const profileId of participantIds) {
              let pr = playerMap.get(profileId);
              if (!pr) {
                pr = { bookings: 0, spend: 0 };
                playerMap.set(profileId, pr);
              }
              pr.bookings += 1;
            }
            if (revenueDet && revenueDet.total > 0) {
              let org = playerMap.get(b.userId);
              if (!org) {
                org = { bookings: 0, spend: 0 };
                playerMap.set(b.userId, org);
              }
              org.spend += revenueDet.total;
            }
          }
        }
      }

      if (op > 0) {
        bookingsPrev += 1;
        if (occupies) {
          revenuePrev += this.confirmedBookingRevenueInWindow(
            b.start,
            b.end,
            priceMap,
            defaultHourPrice,
            courtSchedulesById.get(b.courtId),
            prevPeriodStart,
            prevPeriodEnd,
          );
        }
      }
    }

    const occupancyByCourt: {
      courtId: string;
      name: string;
      occupancyPercent: number;
    }[] = [];
    for (const c of club.courts) {
      const row = occByCourt.get(c.id)!;
      const pct =
        totalSlotsCurrent > 0
          ? Math.min(100, (row.bookings / totalSlotsCurrent) * 100)
          : 0;
      occupancyByCourt.push({
        courtId: c.id,
        name: row.name,
        occupancyPercent: Math.round(pct * 10) / 10,
      });
    }
    const occupancyAvg =
      totalSlotsCurrent > 0
        ? Math.min(
            100,
            Math.round((bookingsCurrent / totalSlotsCurrent) * 1000) / 10,
          )
        : 0;
    const occupancyAvgPrev =
      totalSlotsPrev > 0
        ? Math.min(100, Math.round((bookingsPrev / totalSlotsPrev) * 1000) / 10)
        : 0;

    const comparisonLabel =
      range === 'week'
        ? 'vs. semana anterior'
        : range === 'month'
          ? 'vs. mes anterior'
          : 'vs. año anterior';

    const peakHours = this.peakHourBucketDefs.map((def, i) => ({
      label: def.label,
      occupancyPercent:
        totalSlotsCurrent > 0
          ? Math.min(
              100,
              Math.round((peakBookingCounts[i] / totalSlotsCurrent) * 1000) /
                10,
            )
          : 0,
    }));

    const revenueByWeekday = monFirstOrder.map((d) => ({
      weekdayUtc: d,
      labelShort: weekdayShort[d],
      amountEUR: Math.round(revenueByWeekdayUtc[d] * 100) / 100,
    }));

    const topPlayersSorted = Array.from(playerMap.entries())
      .map(([userId, v]) => ({ userId, ...v }))
      .filter((p) => p.bookings > 0)
      .sort((a, b) => b.spend - a.spend || b.bookings - a.bookings)
      .slice(0, 10);

    const playerIds = topPlayersSorted.map((p) => p.userId);
    const profiles = playerIds.length
      ? await this.prisma.profile.findMany({
          where: { id: { in: playerIds } },
          select: { id: true, fullName: true },
        })
      : [];
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    return {
      range,
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString(),
      },
      comparisonLabel,
      summary: {
        revenueEUR: Math.round(revenueCurrent * 100) / 100,
        bookings: bookingsCurrent,
        occupancyAvgPercent: occupancyAvg,
        revenueChangePercent: this.trendPercent(revenueCurrent, revenuePrev),
        bookingsChangePercent: this.trendPercent(bookingsCurrent, bookingsPrev),
        occupancyChangePercent: this.trendPercent(
          occupancyAvg,
          occupancyAvgPrev,
        ),
      },
      revenueByWeekday,
      occupancyByCourt,
      peakHours,
      topPlayers: topPlayersSorted.map((p, idx) => ({
        rank: idx + 1,
        userId: p.userId,
        fullName: profileMap.get(p.userId)?.fullName ?? null,
        bookings: p.bookings,
        spendEUR: Math.round(p.spend * 100) / 100,
      })),
    };
  }

  async createMatch(clubId: string, userId: string, dto: CreateMatchDto) {
    const court = await this.prisma.court.findFirst({
      where: { id: dto.courtId, clubId },
    });
    if (!court) throw new NotFoundException('Court not found');

    if (!court.listed) {
      const club = await this.prisma.club.findUnique({
        where: { id: clubId },
        select: { createdBy: true },
      });
      if (club?.createdBy !== userId) {
        throw new NotFoundException('Court not found');
      }
    }

    // El tipo efectivo es siempre el de la cancha (`court.type`); no validamos
    // `dto.courtType` (p. ej. cancha `unspecified` vs cliente indoor/outdoor).

    const start = new Date(dto.start);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Invalid start datetime');
    }

    const dayOfWeek = start.getDay();
    const minutesFromMidnight = start.getHours() * 60 + start.getMinutes();

    const schedule = await this.findScheduleRowContainingMinute(
      dto.courtId,
      dayOfWeek,
      minutesFromMidnight,
    );

    if (!schedule) {
      throw new BadRequestException(
        'No schedule for this court at the given time',
      );
    }

    const slotOffset = minutesFromMidnight - schedule.startTimeMinutes;
    if (slotOffset % schedule.slotDurationMinutes !== 0) {
      throw new BadRequestException(
        'Start time is not aligned with slot duration',
      );
    }

    const endMinutes = minutesFromMidnight + schedule.slotDurationMinutes;
    const scheduleEffectiveEnd = effectiveEndTimeMinutes(
      schedule.startTimeMinutes,
      schedule.endTimeMinutes,
    );
    if (endMinutes > scheduleEffectiveEnd) {
      throw new BadRequestException('Slot exceeds schedule end time');
    }

    const calendarDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const end = dateFromScheduleAbsoluteMinutes(calendarDay, endMinutes);

    const isPrivate = dto.isPrivate === true;
    const inviteCode = await this.generateUniqueInviteCode();

    if (isPrivate) {
      const booking = await this.prisma.$transaction(async (tx) => {
        await this.cancelTentativePublicMatchesOverlapping(
          tx,
          dto.courtId,
          start,
          end,
        );

        const overlapping = await tx.courtBooking.findFirst({
          where: {
            courtId: dto.courtId,
            start: { lt: end },
            end: { gt: start },
            status: { in: ['PENDING', 'CONFIRMED'] },
            occupiesSlot: true,
          },
        });

        if (overlapping) {
          throw new BadRequestException('Slot already booked');
        }

        return tx.courtBooking.create({
          data: {
            courtId: dto.courtId,
            userId,
            start,
            end,
            status: 'CONFIRMED',
            occupiesSlot: true,
            isMatch: true,
            title: dto.title,
            maxPlayers: dto.maxPlayers,
            level: dto.level,
            manualClubNotes: dto.matchGender
              ? `match_gender:${dto.matchGender}`
              : null,
            visibility: 'private',
            inviteCode,
          },
        });
      });

      await this.prisma.courtBookingParticipant.create({
        data: {
          bookingId: booking.id,
          profileId: userId,
        },
      });

      return booking;
    }

    const overlapsPublicOpen = await this.prisma.courtBooking.findFirst({
      where: {
        courtId: dto.courtId,
        start: { lt: end },
        end: { gt: start },
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          { occupiesSlot: true },
          {
            AND: [
              { isMatch: true },
              { visibility: 'public' },
              { occupiesSlot: false },
            ],
          },
        ],
      },
    });

    if (overlapsPublicOpen) {
      throw new BadRequestException('Slot already booked');
    }

    const booking = await this.prisma.courtBooking.create({
      data: {
        courtId: dto.courtId,
        userId,
        start,
        end,
        status: 'PENDING',
        occupiesSlot: false,
        isMatch: true,
        title: dto.title,
        maxPlayers: dto.maxPlayers,
        level: dto.level,
        manualClubNotes: dto.matchGender
          ? `match_gender:${dto.matchGender}`
          : null,
        visibility: 'public',
        inviteCode,
      },
    });

    await this.prisma.courtBookingParticipant.create({
      data: {
        bookingId: booking.id,
        profileId: userId,
      },
    });

    void this.notifyOpenMatchPublishedMail(booking.id).catch((err) => {
      this.logger.warn(`notifyOpenMatchPublishedMail: ${String(err)}`);
    });

    return booking;
  }

  async findMatches(clubId: string, query: QueryMatchDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const orConditions: Prisma.CourtBookingWhereInput[] = [];

    if (query.search) {
      orConditions.push(
        { title: { contains: query.search, mode: 'insensitive' } },
        {
          court: {
            name: { contains: query.search, mode: 'insensitive' },
          },
        },
        {
          court: {
            club: {
              name: { contains: query.search, mode: 'insensitive' },
            },
          },
        },
      );
    }

    const where: Prisma.CourtBookingWhereInput = {
      isMatch: true,
      status: { in: ['PENDING', 'CONFIRMED'] },
      visibility: 'public',
      court: {
        clubId,
        club: { approvalStatus: 'APPROVED' },
        ...(query.courtType ? { type: query.courtType } : {}),
      } as any,
      ...(typeof query.level === 'number' ? { level: query.level } : {}),
      ...(orConditions.length ? { OR: orConditions } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.courtBooking.findMany({
        where,
        include: {
          court: { include: { club: true } },
          participants: true,
        },
        orderBy: { start: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.courtBooking.count({ where }),
    ]);

    const mapped = data.map((booking) => ({
      id: booking.id,
      title: booking.title,
      club: {
        id: booking.court.club.id,
        name: booking.court.club.name,
        address: booking.court.club.address,
      },
      court: {
        id: booking.court.id,
        name: booking.court.name,
        type: booking.court.type,
      },
      time: {
        start: booking.start,
        end: booking.end,
      },
      level: booking.level,
      matchGender: this.parseMatchGender(booking.manualClubNotes),
      maxPlayers: booking.maxPlayers,
      status: booking.status,
      participantsCount: booking.participants.length,
    }));

    return {
      data: mapped,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMyMatches(userId: string, query: QueryMatchDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const orConditions: Prisma.CourtBookingWhereInput[] = [
      { userId },
      { participants: { some: { profileId: userId } } },
    ];

    if (query.search) {
      orConditions.push({
        title: { contains: query.search, mode: 'insensitive' },
      });
    }

    const nowMine = new Date();
    const where: Prisma.CourtBookingWhereInput = {
      isMatch: true,
      end: { gte: nowMine },
      OR: orConditions,
      ...(query.courtType
        ? {
            court: {
              type: query.courtType,
            } as any,
          }
        : {}),
      ...(typeof query.level === 'number' ? { level: query.level } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.courtBooking.findMany({
        where,
        include: {
          court: { include: { club: true } },
          participants: true,
        },
        orderBy: { start: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.courtBooking.count({ where }),
    ]);

    const mapped = data.map((booking) => ({
      id: booking.id,
      title: booking.title,
      club: {
        id: booking.court.club.id,
        name: booking.court.club.name,
        address: booking.court.club.address,
      },
      court: {
        id: booking.court.id,
        name: booking.court.name,
        type: booking.court.type,
      },
      time: {
        start: booking.start,
        end: booking.end,
      },
      level: booking.level,
      matchGender: this.parseMatchGender(booking.manualClubNotes),
      maxPlayers: booking.maxPlayers,
      status: booking.status,
      participantsCount: booking.participants.length,
      isOrganizer: booking.userId === userId,
      isParticipant: booking.participants.some((p) => p.profileId === userId),
    }));

    return {
      data: mapped,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findPublicMatches(userId: string, query: QueryMatchDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const forYou = query.forYou === true;

    /** Ciudad del perfil; con `forYou` es obligatoria (sin ella no hay resultados). */
    let viewerCityForClub: string | undefined;
    if (forYou) {
      const viewer = await this.prisma.profile.findUnique({
        where: { id: userId },
        select: { location: true },
      });
      const viewerLoc = viewer?.location?.trim();
      if (!viewerLoc) {
        return {
          data: [],
          meta: { total: 0, page, limit, totalPages: 0 },
        };
      }
      viewerCityForClub = viewerLoc;
    }

    const clubInCourtFilter: Prisma.ClubWhereInput = {
      approvalStatus: 'APPROVED',
      ...(forYou
        ? {
            location: {
              equals: viewerCityForClub as string,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const courtFilter: Prisma.CourtWhereInput = query.courtType
      ? {
          type: query.courtType,
          club: clubInCourtFilter,
        }
      : { club: clubInCourtFilter };

    const orConditions: Prisma.CourtBookingWhereInput[] = [];

    if (query.search) {
      orConditions.push(
        { title: { contains: query.search, mode: 'insensitive' } },
        {
          court: {
            name: { contains: query.search, mode: 'insensitive' },
          },
        },
        {
          court: {
            club: {
              name: { contains: query.search, mode: 'insensitive' },
            },
          },
        },
      );
    }

    const nowPub = new Date();
    const startWindow: Prisma.DateTimeFilter = { gte: nowPub };
    if (typeof query.withinDays === 'number' && query.withinDays >= 1) {
      const endWindow = new Date(nowPub);
      endWindow.setDate(endWindow.getDate() + query.withinDays);
      endWindow.setHours(23, 59, 59, 999);
      startWindow.lte = endWindow;
    }

    const where: Prisma.CourtBookingWhereInput = {
      isMatch: true,
      status: { in: ['PENDING', 'CONFIRMED'] },
      visibility: 'public',
      start: startWindow,
      court: courtFilter,
      ...(forYou
        ? {
            userId: { not: userId },
            participants: { none: { profileId: userId } },
          }
        : {}),
      ...(typeof query.level === 'number' ? { level: query.level } : {}),
      ...(orConditions.length ? { OR: orConditions } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.courtBooking.findMany({
        where,
        include: {
          court: { include: { club: true } },
          participants: true,
        },
        orderBy: { start: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.courtBooking.count({ where }),
    ]);

    const mapped = data.map((booking) => ({
      id: booking.id,
      title: booking.title,
      club: {
        id: booking.court.club.id,
        name: booking.court.club.name,
        address: booking.court.club.address,
      },
      court: {
        id: booking.court.id,
        name: booking.court.name,
        type: booking.court.type,
      },
      time: {
        start: booking.start,
        end: booking.end,
      },
      level: booking.level,
      matchGender: this.parseMatchGender(booking.manualClubNotes),
      maxPlayers: booking.maxPlayers,
      status: booking.status,
      participantsCount: booking.participants.length,
      isOrganizer: booking.userId === userId,
      isParticipant: booking.participants.some((p) => p.profileId === userId),
    }));

    return {
      data: mapped,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async joinMatch(matchId: string, userId: string) {
    const match = await this.prisma.courtBooking.findUnique({
      where: { id: matchId },
      include: { participants: { include: { profile: true } } },
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const now = new Date();
    if (match.end < now) {
      throw new BadRequestException('Match already finished');
    }

    if (match.userId === userId) {
      throw new BadRequestException('You are already the match owner');
    }

    const existing = match.participants.find((p) => p.profileId === userId);
    if (existing) {
      throw new BadRequestException('You are already joined to this match');
    }

    await this.prisma.$transaction(async (tx) => {
      const fresh = await tx.courtBooking.findUnique({
        where: { id: matchId },
        include: { participants: true },
      });
      if (!fresh) {
        throw new NotFoundException('Match not found');
      }
      const maxPlayers = fresh.maxPlayers ?? 4;
      if (fresh.participants.length >= maxPlayers) {
        throw new BadRequestException('Match is already full');
      }
      if (fresh.participants.some((p) => p.profileId === userId)) {
        throw new BadRequestException('You are already joined to this match');
      }

      await tx.courtBookingParticipant.create({
        data: {
          bookingId: matchId,
          profileId: userId,
        },
      });

      const after = await tx.courtBooking.findUnique({
        where: { id: matchId },
        include: { participants: true },
      });
      if (
        after &&
        after.participants.length >= (after.maxPlayers ?? 4) &&
        after.occupiesSlot === false
      ) {
        await tx.courtBooking.update({
          where: { id: matchId },
          data: { occupiesSlot: true, status: 'CONFIRMED' },
        });
      }
    });

    void this.notifyMatchJoinMail(matchId, userId).catch((err) => {
      this.logger.warn(`notifyMatchJoinMail: ${String(err)}`);
    });

    return { message: 'Joined match successfully' };
  }

  async leaveMatch(matchId: string, userId: string) {
    const match = await this.prisma.courtBooking.findUnique({
      where: { id: matchId },
      include: {
        participants: { include: { profile: true } },
        court: { include: { club: true } },
      },
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.isMatch !== true) {
      throw new BadRequestException('Booking is not a match');
    }

    if (match.userId === userId) {
      throw new BadRequestException('Organizer cannot cancel participation');
    }

    const maxPlayersBefore = match.maxPlayers ?? 4;
    const wasFullConfirmed =
      match.visibility === 'public' &&
      match.status === 'CONFIRMED' &&
      match.occupiesSlot &&
      match.participants.length >= maxPlayersBefore;

    await this.prisma.$transaction(async (tx) => {
      await tx.courtBookingParticipant.deleteMany({
        where: { bookingId: matchId, profileId: userId },
      });

      const after = await tx.courtBooking.findUnique({
        where: { id: matchId },
        include: { participants: true },
      });

      if (!after) return;

      const maxPlayers = after.maxPlayers ?? 4;
      const becameTentativeAgain =
        after.visibility === 'public' &&
        after.occupiesSlot === true &&
        after.participants.length < maxPlayers;

      if (becameTentativeAgain) {
        await tx.courtBooking.update({
          where: { id: matchId },
          data: {
            occupiesSlot: false,
            status: 'PENDING',
          },
        });
      }
    });

    void this.notifyMatchLeaveMail(match, userId, wasFullConfirmed).catch(
      (err) => {
        this.logger.warn(`notifyMatchLeaveMail: ${String(err)}`);
      },
    );

    return { message: 'Participation cancelled' };
  }

  async createLooseMatch(profileId: string, dto: CreateLooseMatchDto) {
    const inviteCode = await this.generateUniqueInviteCode();
    const created = await this.prisma.looseMatch.create({
      data: {
        profileId,
        title: dto.title,
        startLabel: dto.startLabel,
        level: dto.level,
        courtType: dto.courtType,
        inviteCode,
        participants: {
          create: [{ profileId }],
        },
      },
    });

    return created;
  }

  async joinLooseMatch(matchId: string, userId: string) {
    const loose = await this.prisma.looseMatch.findUnique({
      where: { id: matchId },
      include: { participants: true },
    });

    if (!loose) {
      throw new NotFoundException('Loose match not found');
    }

    const maxPlayers = 4;
    const currentCount = loose.participants.length;
    if (currentCount >= maxPlayers) {
      throw new BadRequestException('Loose match is already full');
    }

    // Organizer/participants can't join twice
    const already = loose.participants.some((p) => p.profileId === userId);
    if (already) {
      throw new BadRequestException('You are already joined');
    }

    await this.prisma.looseMatchParticipant.create({
      data: {
        looseMatchId: matchId,
        profileId: userId,
      },
    });

    return { message: 'Joined loose match successfully' };
  }

  async leaveLooseMatch(matchId: string, userId: string) {
    const loose = await this.prisma.looseMatch.findUnique({
      where: { id: matchId },
      include: { participants: true },
    });

    if (!loose) {
      throw new NotFoundException('Loose match not found');
    }

    // El organizador no puede cancelar su participación en este momento.
    if (loose.profileId === userId) {
      throw new BadRequestException('Organizer cannot cancel participation');
    }

    // Si no existe participación, deleteMany no afectará (lo tratamos como ok).
    await this.prisma.looseMatchParticipant.deleteMany({
      where: { looseMatchId: matchId, profileId: userId },
    });

    return { message: 'Participation cancelled' };
  }

  async getBookingInviteCode(bookingId: string, userId: string) {
    const booking = await this.prisma.courtBooking.findFirst({
      where: { id: bookingId },
      include: { participants: true },
    });

    if (!booking) return null;

    const isParticipantOrOrganizer =
      booking.userId === userId ||
      booking.participants.some((p) => p.profileId === userId);

    const isPublicMatchShare =
      booking.isMatch === true && booking.visibility === 'public';

    const isAuthorized = isParticipantOrOrganizer || isPublicMatchShare;

    if (!isAuthorized) {
      throw new ForbiddenException('You cannot access this invite code');
    }

    if (booking.inviteCode) return booking.inviteCode;

    const inviteCode = await this.generateUniqueInviteCode();
    await this.prisma.courtBooking.update({
      where: { id: booking.id },
      data: { inviteCode },
    });

    return inviteCode;
  }

  async resolveInvite(inviteCode: string, userId: string) {
    const match = await this.prisma.courtBooking.findFirst({
      where: { inviteCode },
      include: {
        court: { include: { club: true } },
        participants: true,
      },
    });

    if (match) {
      const organizerId = match.userId;
      const isOrganizer = organizerId === userId;
      const isParticipant = match.participants.some(
        (p) => p.profileId === userId,
      );
      const nonOrganizerParticipants = match.participants.filter(
        (p) => p.profileId !== organizerId,
      ).length;

      return {
        type: 'match' as const,
        matchId: match.id,
        title: match.title,
        start: match.start,
        end: match.end,
        courtType: match.court.type,
        courtName: match.court.name,
        clubName: match.court.club.name,
        level: match.level,
        maxPlayers: match.maxPlayers ?? 4,
        participantsCount: 1 + nonOrganizerParticipants,
        isOrganizer,
        isParticipant,
      };
    }

    const loose = await this.prisma.looseMatch.findFirst({
      where: { inviteCode },
      include: { participants: true },
    });

    if (loose) {
      const organizerId = loose.profileId;
      const isOrganizer = organizerId === userId;
      const isParticipant = loose.participants.some(
        (p) => p.profileId === userId,
      );
      const nonOrganizerParticipants = loose.participants.filter(
        (p) => p.profileId !== organizerId,
      ).length;

      return {
        type: 'loose' as const,
        matchId: loose.id,
        title: loose.title,
        startLabel: loose.startLabel,
        courtType: loose.courtType,
        level: loose.level,
        maxPlayers: 4,
        participantsCount: 1 + nonOrganizerParticipants,
        isOrganizer,
        isParticipant,
      };
    }

    throw new NotFoundException('Invite not found');
  }

  async joinInvite(inviteCode: string, userId: string) {
    const match = await this.prisma.courtBooking.findFirst({
      where: { inviteCode },
      select: { id: true },
    });

    if (match) {
      return this.joinMatch(match.id, userId);
    }

    const loose = await this.prisma.looseMatch.findFirst({
      where: { inviteCode },
      select: { id: true },
    });

    if (!loose) throw new NotFoundException('Invite not found');

    return this.joinLooseMatch(loose.id, userId);
  }

  async findMyLooseMatches(profileId: string, query: QueryLooseMatchDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.LooseMatchWhereInput = {
      OR: [
        { profileId },
        {
          participants: {
            some: { profileId },
          },
        },
      ],
      ...(query.search
        ? {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.courtType ? { courtType: query.courtType as any } : {}),
      ...(typeof query.level === 'number' ? { level: query.level } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.looseMatch.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.looseMatch.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findLooseMatches(userId: string, query: QueryLooseMatchDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const sameCity = query.sameCity === true;

    /** Partidos sueltos públicos: no los tuyos como organizador ni donde ya participas. */
    const loosePublicBase: Prisma.LooseMatchWhereInput = {
      profileId: { not: userId },
      participants: { none: { profileId: userId } },
    };

    let looseOrganizerScope: Prisma.LooseMatchWhereInput = loosePublicBase;
    if (sameCity) {
      const viewer = await this.prisma.profile.findUnique({
        where: { id: userId },
        select: { location: true },
      });
      const viewerLoc = viewer?.location?.trim();
      if (!viewerLoc) {
        looseOrganizerScope = { id: { in: [] } };
      } else {
        const sameCityRows = await this.prisma.$queryRaw<{ id: string }[]>`
          SELECT id::text AS id FROM profiles
          WHERE location IS NOT NULL
            AND LOWER(TRIM(location)) = LOWER(TRIM(${viewerLoc}))
        `;
        const eligible = sameCityRows
          .map((r) => r.id)
          .filter((id) => id !== userId);
        looseOrganizerScope =
          eligible.length > 0
            ? {
                profileId: { in: eligible },
                participants: { none: { profileId: userId } },
              }
            : { id: { in: [] } };
      }
    }

    const where: Prisma.LooseMatchWhereInput = {
      ...looseOrganizerScope,
      ...(query.search
        ? {
            title: {
              contains: query.search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.courtType ? { courtType: query.courtType as any } : {}),
      ...(typeof query.level === 'number' ? { level: query.level } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.looseMatch.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { participants: true },
      }),
      this.prisma.looseMatch.count({ where }),
    ]);

    return {
      data: data.map((loose) => {
        const isOrganizer = loose.profileId === userId;
        const isParticipant = loose.participants.some(
          (p) => p.profileId === userId,
        );
        return {
          id: loose.id,
          title: loose.title,
          startLabel: loose.startLabel,
          level: loose.level,
          courtType: loose.courtType,
          createdAt: loose.createdAt,
          updatedAt: loose.updatedAt,
          participantsCount: loose.participants.length,
          isOrganizer,
          isParticipant,
          maxPlayers: 4,
        };
      }),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMatchDetail(matchId: string, userId: string) {
    const booking = await this.prisma.courtBooking.findFirst({
      where: { id: matchId },
      include: {
        court: { include: { club: true } },
        participants: { include: { profile: true } },
      },
    });

    if (!booking) throw new NotFoundException('Match not found');

    const isOrganizer = booking.userId === userId;
    const isParticipant = booking.participants.some(
      (p) => p.profileId === userId,
    );

    if (booking.visibility !== 'public' && !isOrganizer && !isParticipant) {
      throw new ForbiddenException('You cannot view this match');
    }

    const organizerProfile = await this.prisma.profile.findUnique({
      where: { id: booking.userId },
    });

    const participantRows = booking.participants.filter(
      (p) => p.profileId !== booking.userId,
    );

    const manualGuestList = this.parseManualBookingGuests(booking.manualGuests);

    const startDate = booking.start;
    const localDayOfWeek = startDate.getDay();
    const utcDayOfWeek = startDate.getUTCDay();
    const localMinutesFromMidnight =
      startDate.getHours() * 60 + startDate.getMinutes();
    const utcMinutesFromMidnight =
      startDate.getUTCHours() * 60 + startDate.getUTCMinutes();
    const scheduleForSlot =
      (await this.prisma.courtSchedule.findFirst({
        where: {
          courtId: booking.courtId,
          dayOfWeek: localDayOfWeek,
          startTimeMinutes: { lte: localMinutesFromMidnight },
          endTimeMinutes: { gt: localMinutesFromMidnight },
        },
        orderBy: { startTimeMinutes: 'asc' },
      })) ??
      (await this.prisma.courtSchedule.findFirst({
        where: {
          courtId: booking.courtId,
          dayOfWeek: utcDayOfWeek,
          startTimeMinutes: { lte: utcMinutesFromMidnight },
          endTimeMinutes: { gt: utcMinutesFromMidnight },
        },
        orderBy: { startTimeMinutes: 'asc' },
      }));
    const rawSlotPrice = scheduleForSlot?.pricePerHour;
    const slotPricePerHour =
      typeof rawSlotPrice === 'number' &&
      Number.isFinite(rawSlotPrice) &&
      rawSlotPrice > 0
        ? rawSlotPrice
        : null;

    return {
      id: booking.id,
      title: booking.title,
      start: booking.start,
      end: booking.end,
      level: booking.level,
      matchGender: this.parseMatchGender(booking.manualClubNotes),
      maxPlayers: booking.maxPlayers ?? 4,
      status: booking.status,
      isMatch: booking.isMatch,
      manualGuests: manualGuestList.length > 0 ? manualGuestList : undefined,
      visibility: booking.visibility,
      /** Precio/hora del tramo del horario de cancha (misma resolución que al crear el partido). */
      slotPricePerHour,
      courtType: booking.court.type,
      club: {
        id: booking.court.club.id,
        name: booking.court.club.name,
        address: booking.court.club.address,
        avatarUrl: booking.court.club.avatarUrl,
        pricing: booking.court.club.pricing,
      },
      court: {
        id: booking.court.id,
        name: booking.court.name,
        type: booking.court.type,
      },
      organizer: organizerProfile
        ? {
            id: organizerProfile.id,
            fullName: organizerProfile.fullName,
            avatarUrl: organizerProfile.avatarUrl,
            level: organizerProfile.level,
            preferredPosition: organizerProfile.preferredPosition,
            courtType: organizerProfile.courtType,
          }
        : {
            id: booking.userId,
            fullName: null,
            avatarUrl: null,
            level: null,
            preferredPosition: null,
            courtType: null,
          },
      participants: participantRows.map((p) => ({
        id: p.profile.id,
        fullName: p.profile.fullName,
        avatarUrl: p.profile.avatarUrl,
        level: p.profile.level,
        preferredPosition: p.profile.preferredPosition,
        courtType: p.profile.courtType,
      })),
      participantsCount: participantRows.length + 1, // organizer + participants excluding organizer
    };
  }

  async findLooseMatchDetail(matchId: string) {
    const loose = await this.prisma.looseMatch.findUnique({
      where: { id: matchId },
      include: {
        profile: true,
        participants: { include: { profile: true } },
      },
    });

    if (!loose) throw new NotFoundException('Loose match not found');

    const organizerId = loose.profile.id;
    const nonOrganizerParticipants = loose.participants
      .filter((p) => p.profileId !== organizerId)
      .map((p) => ({
        id: p.profile.id,
        fullName: p.profile.fullName,
        avatarUrl: p.profile.avatarUrl,
        level: p.profile.level,
        preferredPosition: p.profile.preferredPosition,
        courtType: p.profile.courtType,
      }));

    return {
      id: loose.id,
      title: loose.title,
      startLabel: loose.startLabel,
      level: loose.level,
      courtType: loose.courtType,
      maxPlayers: 4,
      organizer: {
        id: loose.profile.id,
        fullName: loose.profile.fullName,
        avatarUrl: loose.profile.avatarUrl,
        level: loose.profile.level,
        preferredPosition: loose.profile.preferredPosition,
        courtType: loose.profile.courtType,
      },
      createdAt: loose.createdAt,
      updatedAt: loose.updatedAt,
      participants: nonOrganizerParticipants,
      participantsCount: 1 + nonOrganizerParticipants.length, // organizer + non-organizer participants
    };
  }

  private mapBoardAuthorProfile(p: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    level: number | null;
    preferredPosition: string | null;
    courtType: string | null;
  }) {
    return {
      id: p.id,
      fullName: p.fullName,
      avatarUrl: p.avatarUrl,
      level: p.level,
      preferredPosition: p.preferredPosition,
      courtType: p.courtType,
    };
  }

  private async assertCourtBookingBoardAccess(
    bookingId: string,
    userId: string,
  ) {
    const booking = await this.prisma.courtBooking.findFirst({
      where: { id: bookingId },
      include: { participants: { select: { profileId: true } } },
    });
    if (!booking) throw new NotFoundException('Match not found');
    const isOrganizer = booking.userId === userId;
    const isParticipant = booking.participants.some(
      (p) => p.profileId === userId,
    );
    if (!isOrganizer && !isParticipant) {
      throw new ForbiddenException('Only participants can access the board');
    }
  }

  private async assertLooseMatchBoardAccess(
    looseMatchId: string,
    userId: string,
  ) {
    const loose = await this.prisma.looseMatch.findUnique({
      where: { id: looseMatchId },
      include: { participants: { select: { profileId: true } } },
    });
    if (!loose) throw new NotFoundException('Loose match not found');
    const isOrganizer = loose.profileId === userId;
    const isParticipant = loose.participants.some(
      (p) => p.profileId === userId,
    );
    if (!isOrganizer && !isParticipant) {
      throw new ForbiddenException('Only participants can access the board');
    }
  }

  async listCourtBookingBoardMessages(matchId: string, userId: string) {
    await this.assertCourtBookingBoardAccess(matchId, userId);
    const rows = await this.prisma.courtBookingBoardMessage.findMany({
      where: { bookingId: matchId },
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    });
    return rows.map((r) => ({
      id: r.id,
      body: r.body,
      createdAt: r.createdAt,
      author: this.mapBoardAuthorProfile(r.author),
    }));
  }

  async postCourtBookingBoardMessage(
    matchId: string,
    userId: string,
    body: string,
  ) {
    const trimmed = body.trim();
    if (!trimmed) {
      throw new BadRequestException('Message cannot be empty');
    }
    await this.assertCourtBookingBoardAccess(matchId, userId);
    const row = await this.prisma.courtBookingBoardMessage.create({
      data: {
        bookingId: matchId,
        authorProfileId: userId,
        body: trimmed.slice(0, 2000),
      },
      include: { author: true },
    });
    return {
      id: row.id,
      body: row.body,
      createdAt: row.createdAt,
      author: this.mapBoardAuthorProfile(row.author),
    };
  }

  async deleteCourtBookingBoardMessage(
    matchId: string,
    messageId: string,
    userId: string,
  ) {
    await this.assertCourtBookingBoardAccess(matchId, userId);
    const msg = await this.prisma.courtBookingBoardMessage.findFirst({
      where: { id: messageId, bookingId: matchId },
    });
    if (!msg) throw new NotFoundException('Message not found');
    if (msg.authorProfileId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }
    await this.prisma.courtBookingBoardMessage.delete({
      where: { id: messageId },
    });
    return { deleted: true as const };
  }

  async listLooseMatchBoardMessages(matchId: string, userId: string) {
    await this.assertLooseMatchBoardAccess(matchId, userId);
    const rows = await this.prisma.looseMatchBoardMessage.findMany({
      where: { looseMatchId: matchId },
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    });
    return rows.map((r) => ({
      id: r.id,
      body: r.body,
      createdAt: r.createdAt,
      author: this.mapBoardAuthorProfile(r.author),
    }));
  }

  async postLooseMatchBoardMessage(
    matchId: string,
    userId: string,
    body: string,
  ) {
    const trimmed = body.trim();
    if (!trimmed) {
      throw new BadRequestException('Message cannot be empty');
    }
    await this.assertLooseMatchBoardAccess(matchId, userId);
    const row = await this.prisma.looseMatchBoardMessage.create({
      data: {
        looseMatchId: matchId,
        authorProfileId: userId,
        body: trimmed.slice(0, 2000),
      },
      include: { author: true },
    });
    return {
      id: row.id,
      body: row.body,
      createdAt: row.createdAt,
      author: this.mapBoardAuthorProfile(row.author),
    };
  }

  async deleteLooseMatchBoardMessage(
    matchId: string,
    messageId: string,
    userId: string,
  ) {
    await this.assertLooseMatchBoardAccess(matchId, userId);
    const msg = await this.prisma.looseMatchBoardMessage.findFirst({
      where: { id: messageId, looseMatchId: matchId },
    });
    if (!msg) throw new NotFoundException('Message not found');
    if (msg.authorProfileId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }
    await this.prisma.looseMatchBoardMessage.delete({
      where: { id: messageId },
    });
    return { deleted: true as const };
  }

  private async notifyClosedCourtBookingMail(bookingId: string): Promise<void> {
    const booking = await this.prisma.courtBooking.findUnique({
      where: { id: bookingId },
      include: { court: { include: { club: true } } },
    });
    if (!booking || booking.isMatch) return;

    const emails = await this.resolveEmailsFromAuth([booking.userId]);
    const to = emails.get(booking.userId);
    if (!to) return;

    const profile = await this.prisma.profile.findUnique({
      where: { id: booking.userId },
      select: { fullName: true },
    });

    const { total } = await this.computeBookingMoney({
      courtId: booking.courtId,
      start: booking.start,
      end: booking.end,
      maxPlayers: 1,
    });

    const pack = closedBookingConfirmationEmail({
      recipientName: profile?.fullName?.trim() || 'Jugador',
      start: booking.start,
      end: booking.end,
      totalPrice: total,
      club: {
        name: booking.court.club.name,
        address: booking.court.club.address,
        email: booking.court.club.email,
      },
    });

    await this.mailService.sendTransactional({
      to,
      subject: pack.subject,
      text: pack.text,
      html: pack.html,
      eventType: PuntooMailEvent.CLOSED_BOOKING_CONFIRMED,
    });
  }

  private async notifyOpenMatchPublishedMail(bookingId: string): Promise<void> {
    const booking = await this.prisma.courtBooking.findUnique({
      where: { id: bookingId },
      include: {
        court: { include: { club: true } },
        participants: { include: { profile: true } },
      },
    });
    if (!booking || !booking.isMatch || booking.visibility !== 'public') return;

    const emails = await this.resolveEmailsFromAuth([booking.userId]);
    const to = emails.get(booking.userId);
    if (!to) return;

    const organizer = await this.prisma.profile.findUnique({
      where: { id: booking.userId },
      select: { fullName: true },
    });

    const { share } = await this.computeBookingMoney({
      courtId: booking.courtId,
      start: booking.start,
      end: booking.end,
      maxPlayers: booking.maxPlayers,
    });

    const statusLabel = bookingStatusLabel(
      booking.status,
      booking.occupiesSlot,
    );
    const modality = matchGenderLabel(
      this.matchGenderUiFromBooking(booking.manualClubNotes),
    );

    const pack = openMatchPublishedEmail({
      organizerName: organizer?.fullName?.trim() || 'Organizador',
      statusLabel,
      level: booking.level,
      modality,
      start: booking.start,
      sharePrice: share,
      club: {
        name: booking.court.club.name,
        address: booking.court.club.address,
        email: booking.court.club.email,
      },
    });

    await this.mailService.sendTransactional({
      to,
      subject: pack.subject,
      text: pack.text,
      html: pack.html,
      eventType: PuntooMailEvent.OPEN_MATCH_PUBLISHED,
    });
  }

  private async notifyMatchJoinMail(
    matchId: string,
    joinedUserId: string,
  ): Promise<void> {
    const booking = await this.prisma.courtBooking.findUnique({
      where: { id: matchId },
      include: {
        court: { include: { club: true } },
        participants: { include: { profile: true } },
      },
    });
    if (!booking || !booking.isMatch || booking.visibility !== 'public') return;

    const maxPlayers = booking.maxPlayers ?? 4;
    const fullNow =
      booking.participants.length >= maxPlayers &&
      booking.status === 'CONFIRMED';

    const { share } = await this.computeBookingMoney({
      courtId: booking.courtId,
      start: booking.start,
      end: booking.end,
      maxPlayers: booking.maxPlayers,
    });

    const modality = matchGenderLabel(
      this.matchGenderUiFromBooking(booking.manualClubNotes),
    );
    const organizerProfile = await this.prisma.profile.findUnique({
      where: { id: booking.userId },
      select: { fullName: true },
    });
    const organizerName = organizerProfile?.fullName?.trim() || 'Organizador';

    const participantIds = booking.participants.map((p) => p.profileId);
    const emailMap = await this.resolveEmailsFromAuth(participantIds);

    const slots = this.buildMatchParticipantSlots({
      organizerUserId: booking.userId,
      participants: booking.participants,
      maxPlayers,
    });

    const statusLabel = bookingStatusLabel(
      booking.status,
      booking.occupiesSlot,
    );

    if (fullNow) {
      const pack = matchConfirmedAllEmail({
        statusLabel: bookingStatusLabel('CONFIRMED', true),
        level: booking.level,
        modality,
        organizerName,
        start: booking.start,
        sharePrice: share,
        club: {
          name: booking.court.club.name,
          address: booking.court.club.address,
          email: booking.court.club.email,
        },
        playerSlots: slots,
      });

      for (const pid of participantIds) {
        const dest = emailMap.get(pid);
        if (!dest) continue;
        await this.mailService.sendTransactional({
          to: dest,
          subject: pack.subject,
          text: pack.text,
          html: pack.html,
          eventType: PuntooMailEvent.OPEN_MATCH_CONFIRMED_ALL,
        });
      }
      return;
    }

    const orgMail = emailMap.get(booking.userId);
    if (orgMail) {
      const orgPack = playerJoinedOrganizerEmail({
        statusLabel,
        level: booking.level,
        modality,
        organizerName,
        start: booking.start,
        sharePrice: share,
        club: {
          name: booking.court.club.name,
          address: booking.court.club.address,
          email: booking.court.club.email,
        },
        playerSlots: slots,
      });
      await this.mailService.sendTransactional({
        to: orgMail,
        subject: orgPack.subject,
        text: orgPack.text,
        html: orgPack.html,
        eventType: PuntooMailEvent.OPEN_MATCH_PLAYER_JOINED_ORGANIZER,
      });
    }

    const joinMail = emailMap.get(joinedUserId);
    if (joinMail) {
      const selfPack = playerJoinedSelfEmail({
        statusLabel,
        level: booking.level,
        modality,
        organizerName,
        start: booking.start,
        sharePrice: share,
        club: {
          name: booking.court.club.name,
          address: booking.court.club.address,
          email: booking.court.club.email,
        },
        playerSlots: slots,
      });
      await this.mailService.sendTransactional({
        to: joinMail,
        subject: selfPack.subject,
        text: selfPack.text,
        html: selfPack.html,
        eventType: PuntooMailEvent.OPEN_MATCH_PLAYER_JOINED_SELF,
      });
    }
  }

  private async notifyMatchLeaveMail(
    matchBefore: {
      id: string;
      courtId: string;
      userId: string;
      start: Date;
      end: Date;
      visibility: string;
      isMatch: boolean;
      level: number | null;
      maxPlayers: number | null;
      manualClubNotes: string | null;
      court: {
        club: { name: string; address: string; email: string | null };
      };
      participants: Array<{
        profileId: string;
        createdAt: Date;
        profile: { fullName: string | null };
      }>;
    },
    leftUserId: string,
    wasFullConfirmed: boolean,
  ): Promise<void> {
    if (!matchBefore.isMatch || matchBefore.visibility !== 'public') return;

    const modality = matchGenderLabel(
      this.matchGenderUiFromBooking(matchBefore.manualClubNotes),
    );
    const organizerProfile = await this.prisma.profile.findUnique({
      where: { id: matchBefore.userId },
      select: { fullName: true },
    });
    const organizerName = organizerProfile?.fullName?.trim() || 'Organizador';

    const { share } = await this.computeBookingMoney({
      courtId: matchBefore.courtId,
      start: matchBefore.start,
      end: matchBefore.end,
      maxPlayers: matchBefore.maxPlayers,
    });

    const clubMail = {
      name: matchBefore.court.club.name,
      address: matchBefore.court.club.address,
      email: matchBefore.court.club.email,
    };

    const strikeSlots = this.buildMatchParticipantSlots({
      organizerUserId: matchBefore.userId,
      participants: matchBefore.participants,
      maxPlayers: matchBefore.maxPlayers ?? 4,
      strikeProfileId: leftUserId,
    });

    const emailTargets = await this.resolveEmailsFromAuth([
      leftUserId,
      matchBefore.userId,
      ...matchBefore.participants.map((p) => p.profileId),
    ]);

    const selfMail = emailTargets.get(leftUserId);
    if (selfMail) {
      const selfPack = leaveSelfEmail({
        level: matchBefore.level,
        modality,
        organizerName,
        start: matchBefore.start,
        club: clubMail,
      });
      await this.mailService.sendTransactional({
        to: selfMail,
        subject: selfPack.subject,
        text: selfPack.text,
        html: selfPack.html,
        eventType: PuntooMailEvent.OPEN_MATCH_LEAVE_SELF,
      });
    }

    if (wasFullConfirmed) {
      const remainingIds = matchBefore.participants
        .filter((p) => p.profileId !== leftUserId)
        .map((p) => p.profileId);
      const dropPack = droppedFromFullEmail({
        statusLabel: 'PENDIENTE',
        level: matchBefore.level,
        modality,
        organizerName,
        start: matchBefore.start,
        sharePrice: share,
        club: clubMail,
        playerSlots: strikeSlots,
      });
      for (const pid of remainingIds) {
        const dest = emailTargets.get(pid);
        if (!dest) continue;
        await this.mailService.sendTransactional({
          to: dest,
          subject: dropPack.subject,
          text: dropPack.text,
          html: dropPack.html,
          eventType: PuntooMailEvent.OPEN_MATCH_LEAVE_FROM_FULL,
        });
      }
      return;
    }

    const orgMail = emailTargets.get(matchBefore.userId);
    if (orgMail) {
      const orgPack = leaveOrganizerEmail({
        statusLabel: 'PENDIENTE',
        level: matchBefore.level,
        modality,
        organizerName,
        start: matchBefore.start,
        sharePrice: share,
        club: clubMail,
        playerSlots: strikeSlots,
      });
      await this.mailService.sendTransactional({
        to: orgMail,
        subject: orgPack.subject,
        text: orgPack.text,
        html: orgPack.html,
        eventType: PuntooMailEvent.OPEN_MATCH_LEAVE_ORGANIZER,
      });
    }
  }
}
