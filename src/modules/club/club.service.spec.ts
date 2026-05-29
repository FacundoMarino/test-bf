import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { COURT_PLAN_LIMIT_REACHED_MESSAGE } from './court-plan-limit.constants';
import { QueryClubDto } from './dto/query-club.dto';
import { QueryCourtDto } from './dto/query-court.dto';
import type { PrismaService } from '../../prisma/prisma.service';
import type { SupabaseService } from '../../supabase/supabase.service';
import type { MailService } from '../mail/mail.service';

jest.mock('../../prisma/prisma.service', () => {
  class PrismaServiceMock {}
  return { PrismaService: PrismaServiceMock };
});

describe('ClubService', () => {
  let service: ClubService;
  let prisma: jest.Mocked<PrismaService>;
  let supabaseService: jest.Mocked<SupabaseService>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(() => {
    prisma = {
      club: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      court: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      courtSchedule: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        deleteMany: jest.fn(),
      },
      courtScheduleException: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      courtCustomSlot: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      courtBooking: {
        create: jest.fn(),
        createMany: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
      courtBookingParticipant: {
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      profile: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      looseMatch: {
        findFirst: jest.fn(),
      },
      emailSendLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    } as any;
    supabaseService = {
      getClient: jest.fn(() => ({
        auth: {
          admin: {
            getUserById: jest.fn(),
          },
        },
      })),
    } as any;

    mailService = {
      sendTransactional: jest.fn().mockResolvedValue(undefined),
    } as any;

    service = new ClubService(prisma, supabaseService, mailService);
  });

  it('should create club with userId', async () => {
    const dto: any = {
      name: 'Club',
      courtCount: 2,
      courtType: 'indoor',
      address: 'Addr',
      email: 'club@example.com',
      web: 'https://club.example.com',
      avatarUrl: 'https://club.example.com/avatar.png',
      pricing: [],
    };
    const created = { id: '1', ...dto };
    prisma.club.create.mockResolvedValue(created);

    const result = await service.create(dto, 'user-id');

    expect(prisma.club.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: dto.name,
        courtCount: dto.courtCount,
        courtType: dto.courtType,
        address: dto.address,
        email: dto.email,
        web: dto.web,
        avatarUrl: dto.avatarUrl,
        pricing: dto.pricing,
        createdBy: 'user-id',
      }),
    });
    expect(result).toBe(created);
  });

  it('should paginate and filter clubs', async () => {
    const query: QueryClubDto = {
      page: 2,
      limit: 10,
      name: 'x',
      address: 'y',
      courtType: 'indoor',
    } as QueryClubDto;

    const data = [{ id: '1' }];
    const total = 15;

    prisma.club.findMany.mockResolvedValue(data as any);
    prisma.club.count.mockResolvedValue(total as any);

    const result = await service.findAll(query);

    expect(prisma.club.findMany).toHaveBeenCalled();
    expect(prisma.club.count).toHaveBeenCalled();
    expect(result).toEqual({
      data: [{ id: '1', amenities: null }],
      meta: {
        total,
        page: 2,
        limit: 10,
        totalPages: Math.ceil(total / 10),
      },
    });
  });

  it('should get one club or throw', async () => {
    prisma.club.findUnique.mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    const club = { id: '1' };
    prisma.club.findUnique.mockResolvedValue(club as any);

    await expect(service.findOne('1')).resolves.toEqual({
      id: '1',
      amenities: null,
      phone: null,
      description: null,
    });
  });

  it('should update club or throw NotFoundException', async () => {
    prisma.club.findUnique.mockResolvedValue({
      id: '1',
      createdBy: 'owner',
    } as any);
    prisma.club.update.mockResolvedValue({ id: '1' } as any);

    await expect(
      service.update('1', { name: 'n' } as any, 'owner'),
    ).resolves.toEqual({
      id: '1',
    });

    prisma.club.findUnique.mockResolvedValue({
      id: '1',
      createdBy: 'owner',
    } as any);
    prisma.club.update.mockRejectedValue(new Error('not found'));

    await expect(
      service.update('1', { name: 'n' } as any, 'owner'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should remove club or throw NotFoundException', async () => {
    prisma.club.findUnique.mockResolvedValue({
      id: '1',
      createdBy: 'owner',
    } as any);
    prisma.club.delete.mockResolvedValue({} as any);

    await expect(service.remove('1', 'owner')).resolves.toEqual({
      message: 'Club deleted successfully',
    });

    prisma.club.findUnique.mockResolvedValue({
      id: '1',
      createdBy: 'owner',
    } as any);
    prisma.club.delete.mockRejectedValue(new Error('err'));

    await expect(service.remove('1', 'owner')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should create court only if club exists', async () => {
    prisma.club.findUnique.mockResolvedValue(null);

    await expect(
      service.createCourt('1', { name: 'c' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);

    prisma.club.findUnique.mockResolvedValue({ id: '1', courtCount: 5 } as any);
    prisma.court.count.mockResolvedValue(2 as any);
    const created = { id: 'court-id' };
    prisma.court.create.mockResolvedValue(created as any);

    await expect(service.createCourt('1', { name: 'c' } as any)).resolves.toBe(
      created,
    );
    expect(prisma.court.count).toHaveBeenCalledWith({
      where: { clubId: '1' },
    });
  });

  it('should reject create court when at plan court limit', async () => {
    prisma.club.findUnique.mockResolvedValue({ id: '1', courtCount: 2 } as any);
    prisma.court.count.mockResolvedValue(2 as any);

    let err: unknown;
    try {
      await service.createCourt('1', { name: 'c' } as any);
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as BadRequestException).getResponse()).toEqual(
      expect.objectContaining({
        message: COURT_PLAN_LIMIT_REACHED_MESSAGE,
      }),
    );
    expect(prisma.court.create).not.toHaveBeenCalled();
  });

  it('should find courts with pagination and filters', async () => {
    const query: QueryCourtDto = {
      page: 1,
      limit: 5,
      name: 'court',
      type: 'indoor',
      surface: 'grass',
      lighting: true,
    } as QueryCourtDto;

    const data = [{ id: 'c1' }];
    const total = 5;
    prisma.club.findUnique.mockResolvedValue({ createdBy: null } as any);
    prisma.court.findMany.mockResolvedValue(data as any);
    prisma.court.count.mockResolvedValue(total as any);

    const result = await service.findCourts('club-id', query);

    expect(prisma.court.findMany).toHaveBeenCalled();
    expect(prisma.court.count).toHaveBeenCalled();
    expect(result.meta.total).toBe(total);
  });

  it('should update court when exists', async () => {
    prisma.court.findFirst.mockResolvedValue({ id: 'c1' } as any);
    prisma.court.update.mockResolvedValue({ id: 'c1' } as any);

    await expect(
      service.updateCourt('club', 'court', {} as any),
    ).resolves.toEqual({ id: 'c1' });
  });

  it('should throw NotFoundException when updating non existing court', async () => {
    prisma.court.findFirst.mockResolvedValue(null);

    await expect(
      service.updateCourt('club', 'court', {} as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw BadRequestException when update fails', async () => {
    prisma.court.findFirst.mockResolvedValue({ id: 'c1' } as any);
    prisma.court.update.mockRejectedValue(new Error('err'));

    await expect(
      service.updateCourt('club', 'court', {} as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should remove court when exists or throw', async () => {
    prisma.court.findFirst.mockResolvedValue(null);

    await expect(service.removeCourt('club', 'court')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    prisma.court.findFirst.mockResolvedValue({ id: 'c1' } as any);
    prisma.courtBooking.count.mockResolvedValue(0 as any);

    prisma.$transaction.mockImplementation(
      async (fn: (tx: Record<string, unknown>) => Promise<unknown>) => {
        const tx = {
          courtBooking: {
            findMany: jest.fn().mockResolvedValue([]),
            deleteMany: jest.fn().mockResolvedValue({}),
          },
          courtBookingParticipant: {
            deleteMany: jest.fn().mockResolvedValue({}),
          },
          courtSchedule: {
            deleteMany: jest.fn().mockResolvedValue({}),
          },
          court: {
            delete: jest.fn().mockResolvedValue({}),
          },
        };
        return fn(tx as never);
      },
    );

    await expect(service.removeCourt('club', 'court')).resolves.toEqual({
      message: 'Court deleted successfully',
    });

    prisma.courtBooking.count.mockResolvedValue(0 as any);
    prisma.$transaction.mockImplementation(
      async (fn: (tx: Record<string, unknown>) => Promise<unknown>) => {
        const tx = {
          courtBooking: {
            findMany: jest.fn().mockResolvedValue([]),
            deleteMany: jest.fn().mockResolvedValue({}),
          },
          courtBookingParticipant: {
            deleteMany: jest.fn().mockResolvedValue({}),
          },
          courtSchedule: {
            deleteMany: jest.fn().mockResolvedValue({}),
          },
          court: {
            delete: jest.fn().mockRejectedValue(new Error('err')),
          },
        };
        return fn(tx as never);
      },
    );

    await expect(service.removeCourt('club', 'court')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should not remove court with active future bookings', async () => {
    prisma.court.findFirst.mockResolvedValue({ id: 'c1' } as any);
    prisma.courtBooking.count.mockResolvedValue(1 as any);

    let err: unknown;
    try {
      await service.removeCourt('club', 'court');
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as BadRequestException).getResponse()).toEqual(
      expect.objectContaining({
        message: 'La pista tiene reservas activas',
      }),
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('should create court schedule when court exists', async () => {
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
    } as any);
    (prisma.courtSchedule.create as jest.Mock).mockResolvedValue({
      id: 'schedule-id',
    } as any);

    const result = await service.createCourtSchedule('club-id', 'court-id', {
      dayOfWeek: 1,
      startTimeMinutes: 9 * 60,
      endTimeMinutes: 18 * 60,
      slotDurationMinutes: 60,
      pricePerHour: 10,
    } as any);

    expect(prisma.courtSchedule.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'schedule-id' });
  });

  it('should throw NotFoundException when creating schedule for non existing court', async () => {
    (prisma.court.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      service.createCourtSchedule('club-id', 'court-id', {
        dayOfWeek: 1,
        startTimeMinutes: 9 * 60,
        endTimeMinutes: 18 * 60,
        slotDurationMinutes: 60,
        pricePerHour: 10,
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should not replace court schedules when there are active future bookings', async () => {
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
    } as any);
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        dayOfWeek: 1,
        startTimeMinutes: 9 * 60,
        endTimeMinutes: 18 * 60,
        slotDurationMinutes: 60,
        pricePerHour: 1000,
        periodName: null,
        periodStart: null,
        periodEnd: null,
      },
      {
        dayOfWeek: 2,
        startTimeMinutes: 12 * 60 + 30,
        endTimeMinutes: 23 * 60,
        slotDurationMinutes: 60,
        pricePerHour: 1000,
        periodName: null,
        periodStart: null,
        periodEnd: null,
      },
    ] as any);
    (prisma.courtBooking.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'booking-1',
        courtId: 'court-id',
        start: new Date('2100-03-10T20:00:00.000Z'),
        end: new Date('2100-03-10T21:30:00.000Z'),
        status: 'CONFIRMED',
      },
    ] as any);

    await expect(
      service.replaceCourtSchedules('club-id', 'court-id', [
        {
          dayOfWeek: 2,
          startTimeMinutes: 12 * 60 + 30,
          endTimeMinutes: 23 * 60,
          slotDurationMinutes: 60,
          pricePerHour: 1000,
        },
      ] as any),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('should list court slots using schedules and bookings', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'owner-id',
      approvalStatus: 'APPROVED',
    } as any);
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      listed: true,
    } as any);
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        courtId: 'court-id',
        dayOfWeek: 1,
        startTimeMinutes: 9 * 60,
        endTimeMinutes: 11 * 60,
        slotDurationMinutes: 60,
        pricePerHour: 2500,
      },
    ]);
    (prisma.courtScheduleException.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.courtCustomSlot.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.courtBooking.findMany as jest.Mock)
      .mockResolvedValueOnce([
        {
          id: 'booking-1',
          courtId: 'court-id',
          start: new Date('2026-03-10T10:00:00.000Z'),
          end: new Date('2026-03-10T11:00:00.000Z'),
          status: 'CONFIRMED',
          occupiesSlot: true,
        },
      ])
      .mockResolvedValueOnce([]);

    const result = await service.listCourtSlots(
      'club-id',
      'court-id',
      {
        date: '2026-03-10',
      } as any,
      'viewer-id',
    );

    expect(prisma.courtSchedule.findMany).toHaveBeenCalled();
    expect(prisma.courtBooking.findMany).toHaveBeenCalled();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should create court booking when slot is free and aligned', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'owner-id',
      approvalStatus: 'APPROVED',
    } as any);
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      listed: true,
    } as any);
    const bookingStart = new Date('2026-03-11T09:00:00.000Z');
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'sch-1',
        courtId: 'court-id',
        dayOfWeek: bookingStart.getDay(),
        startTimeMinutes: 9 * 60,
        endTimeMinutes: 18 * 60,
        slotDurationMinutes: 60,
        periodStart: null,
        periodEnd: null,
      },
    ]);
    (prisma.courtScheduleException.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.courtBooking.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.looseMatch.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.courtBooking.updateMany as jest.Mock).mockResolvedValue({
      count: 0,
    });
    (prisma.courtBooking.create as jest.Mock).mockResolvedValue({
      id: 'booking-id',
    } as any);

    prisma.$transaction.mockImplementation((cb: any) =>
      cb({
        courtBooking: {
          findFirst: prisma.courtBooking.findFirst,
          create: prisma.courtBooking.create,
          updateMany: prisma.courtBooking.updateMany,
        },
      }),
    );

    const result = await service.createCourtBooking(
      'club-id',
      'court-id',
      'user-id',
      { start: '2026-03-11T09:00:00.000Z' } as any,
    );

    expect(prisma.courtBooking.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'booking-id' });
  });

  it('should reject custom slot overlapping non-cancelled regular slot', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'owner-id',
    } as any);
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
    } as any);
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        startTimeMinutes: 18 * 60,
        endTimeMinutes: 20 * 60,
        slotDurationMinutes: 90,
        pricePerHour: 0,
      },
    ]);
    (prisma.courtScheduleException.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.courtCustomSlot.findMany as jest.Mock).mockResolvedValue([]);

    await expect(
      service.createCourtCustomSlot('club-id', 'court-id', 'owner-id', {
        date: '2026-05-25',
        startTimeMinutes: 19 * 60,
        endTimeMinutes: 20 * 60 + 30,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should allow custom slot when regular slots are cancelled', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'owner-id',
    } as any);
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
    } as any);
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        startTimeMinutes: 18 * 60,
        endTimeMinutes: 19 * 60 + 30,
        slotDurationMinutes: 90,
        pricePerHour: 0,
      },
      {
        startTimeMinutes: 19 * 60 + 30,
        endTimeMinutes: 20 * 60,
        slotDurationMinutes: 30,
        pricePerHour: 0,
      },
    ]);
    (prisma.courtScheduleException.findMany as jest.Mock).mockResolvedValue([
      {
        isClosedAllDay: false,
        startTimeMinutes: 18 * 60,
        endTimeMinutes: 19 * 60 + 30,
      },
      {
        isClosedAllDay: false,
        startTimeMinutes: 19 * 60 + 30,
        endTimeMinutes: 20 * 60,
      },
    ]);
    (prisma.courtCustomSlot.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.courtScheduleException.findFirst as jest.Mock).mockResolvedValue(
      null,
    );
    (prisma.courtScheduleException.create as jest.Mock).mockResolvedValue({});
    (prisma.courtCustomSlot.create as jest.Mock).mockResolvedValue({
      id: 'custom-1',
    } as any);
    prisma.$transaction.mockImplementation((cb: any) =>
      cb({
        courtScheduleException: {
          findFirst: prisma.courtScheduleException.findFirst,
          create: prisma.courtScheduleException.create,
        },
        courtCustomSlot: {
          create: prisma.courtCustomSlot.create,
        },
      }),
    );

    const result = await service.createCourtCustomSlot(
      'club-id',
      'court-id',
      'owner-id',
      {
        date: '2026-05-25',
        startTimeMinutes: 19 * 60,
        endTimeMinutes: 20 * 60 + 30,
        price: 5000,
        cancelledSlots: [
          { startTimeMinutes: 18 * 60, endTimeMinutes: 19 * 60 + 30 },
          { startTimeMinutes: 19 * 60 + 30, endTimeMinutes: 20 * 60 },
        ],
      },
    );

    expect(prisma.courtCustomSlot.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'custom-1' });
  });

  it('should not allow non owners to approve booking', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'other-user',
    } as any);

    await expect(
      service.approveCourtBooking('club-id', 'booking-id', 'user-id'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should approve booking for club owner', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'owner-id',
    } as any);
    (prisma.courtBooking.findUnique as jest.Mock).mockResolvedValue({
      id: 'booking-id',
      courtId: 'court-id',
    } as any);
    (prisma.court.findUnique as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
    } as any);
    (prisma.courtBooking.update as jest.Mock).mockResolvedValue({
      id: 'booking-id',
      status: 'CONFIRMED',
    } as any);

    const result = await service.approveCourtBooking(
      'club-id',
      'booking-id',
      'owner-id',
    );

    expect(prisma.courtBooking.update).toHaveBeenCalledWith({
      where: { id: 'booking-id' },
      data: { status: 'CONFIRMED' },
    });
    expect(result).toEqual({
      id: 'booking-id',
      status: 'CONFIRMED',
    });
  });

  it('should cancel booking for booking owner', async () => {
    (prisma.courtBooking.findUnique as jest.Mock).mockResolvedValue({
      id: 'booking-id',
      userId: 'user-id',
      courtId: 'court-id',
      court: { clubId: 'club-id' },
      start: new Date('2099-06-01T10:00:00.000Z'),
      end: new Date('2099-06-01T11:00:00.000Z'),
    } as any);
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'other-id',
    } as any);
    (prisma.courtBooking.update as jest.Mock).mockResolvedValue({
      id: 'booking-id',
      status: 'CANCELLED',
    } as any);

    const result = await service.cancelCourtBooking(
      'club-id',
      'booking-id',
      'user-id',
    );

    expect(prisma.courtBooking.update).toHaveBeenCalledWith({
      where: { id: 'booking-id' },
      data: { status: 'CANCELLED' },
    });
    expect(result).toEqual({
      id: 'booking-id',
      status: 'CANCELLED',
    });
  });

  it('should list user bookings grouped into upcoming and history', async () => {
    (prisma.courtBooking.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'b1',
        userId: 'user-id',
        start: new Date('2100-03-11T10:00:00.000Z'),
        end: new Date('2100-03-11T11:00:00.000Z'),
        status: 'CONFIRMED',
        court: {
          id: 'court-id',
          name: 'Court 1',
          type: 'indoor',
          club: {
            id: 'club-id',
            name: 'Club',
            address: 'Addr',
          },
        },
        participants: [
          {
            profileId: 'p1',
            profile: {
              fullName: 'Player 1',
              avatarUrl: 'http://avatar',
            },
          },
        ],
      },
      {
        id: 'b2',
        userId: 'user-id',
        start: new Date('2000-03-09T10:00:00.000Z'),
        end: new Date('2000-03-09T11:00:00.000Z'),
        status: 'CONFIRMED',
        court: {
          id: 'court-id',
          name: 'Court 1',
          type: 'indoor',
          club: {
            id: 'club-id',
            name: 'Club',
            address: 'Addr',
          },
        },
        participants: [],
      },
    ]);

    const result = await service.listUserBookings('user-id');

    expect(prisma.courtBooking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { userId: 'user-id' },
            { participants: { some: { profileId: 'user-id' } } },
          ],
        },
      }),
    );
    expect(result.upcoming).toHaveLength(1);
    expect(result.history).toHaveLength(1);
  });

  it('should create match and add owner as participant', async () => {
    const matchStart = new Date('2100-03-11T09:00:00.000Z');
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
      type: 'indoor',
      listed: true,
    } as any);
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        courtId: 'court-id',
        dayOfWeek: matchStart.getDay(),
        startTimeMinutes: matchStart.getHours() * 60 + matchStart.getMinutes(),
        endTimeMinutes: 18 * 60,
        slotDurationMinutes: 60,
      },
    ]);
    (prisma.courtBooking.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.courtBooking.create as jest.Mock).mockResolvedValue({
      id: 'match-id',
      isMatch: true,
    } as any);

    const dto: any = {
      title: 'Partido prueba',
      courtId: 'court-id',
      start: '2100-03-11T09:00:00.000Z',
      maxPlayers: 4,
      level: 3,
      courtType: 'indoor',
    };

    const result = await service.createMatch('club-id', 'user-id', dto);

    expect(prisma.courtBooking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'PENDING',
          occupiesSlot: false,
          visibility: 'public',
        }),
      }),
    );
    expect(prisma.courtBookingParticipant.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'match-id',
        profileId: 'user-id',
      },
    });
    expect(result).toEqual({ id: 'match-id', isMatch: true });
  });

  it('should not create match when slot already booked', async () => {
    const matchStart = new Date('2100-03-11T09:00:00.000Z');
    (prisma.court.findFirst as jest.Mock).mockResolvedValue({
      id: 'court-id',
      clubId: 'club-id',
      type: 'indoor',
      listed: true,
    } as any);
    (prisma.courtSchedule.findMany as jest.Mock).mockResolvedValue([
      {
        courtId: 'court-id',
        dayOfWeek: matchStart.getDay(),
        startTimeMinutes: matchStart.getHours() * 60 + matchStart.getMinutes(),
        endTimeMinutes: 18 * 60,
        slotDurationMinutes: 60,
      },
    ]);
    (prisma.courtBooking.findFirst as jest.Mock).mockResolvedValue({
      id: 'other-booking',
    } as any);

    await expect(
      service.createMatch('club-id', 'user-id', {
        title: 'Partido',
        courtId: 'court-id',
        start: '2100-03-11T09:00:00.000Z',
        maxPlayers: 4,
        level: 3,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should find matches with pagination and mapping', async () => {
    const booking: any = {
      id: 'match-id',
      title: 'Partido',
      start: new Date('2100-03-11T09:00:00.000Z'),
      end: new Date('2100-03-11T10:00:00.000Z'),
      level: 3,
      maxPlayers: 4,
      status: 'CONFIRMED',
      court: {
        id: 'court-id',
        name: 'Court 1',
        type: 'indoor',
        club: {
          id: 'club-id',
          name: 'Club',
          address: 'Addr',
        },
      },
      participants: [{ id: 'p1' }],
    };

    prisma.courtBooking.findMany.mockResolvedValue([booking] as any);
    prisma.courtBooking.count.mockResolvedValue(1 as any);

    const result = await service.findMatches('club-id', {
      page: 1,
      limit: 10,
      courtType: 'indoor',
    } as any);

    expect(prisma.courtBooking.findMany).toHaveBeenCalled();
    expect(prisma.courtBooking.count).toHaveBeenCalled();
    expect(result.data[0]).toEqual(
      expect.objectContaining({
        id: 'match-id',
        title: 'Partido',
        level: 3,
        maxPlayers: 4,
        participantsCount: 1,
      }),
    );
  });

  it('should find my matches where user is owner or participant', async () => {
    const booking: any = {
      id: 'match-id',
      title: 'Partido',
      start: new Date('2100-03-11T09:00:00.000Z'),
      end: new Date('2100-03-11T10:00:00.000Z'),
      level: 3,
      maxPlayers: 4,
      status: 'CONFIRMED',
      court: {
        id: 'court-id',
        name: 'Court 1',
        type: 'indoor',
        club: {
          id: 'club-id',
          name: 'Club',
          address: 'Addr',
        },
      },
      participants: [{ id: 'p1', profileId: 'user-id' }],
    };

    prisma.courtBooking.findMany.mockResolvedValue([booking] as any);
    prisma.courtBooking.count.mockResolvedValue(1 as any);

    const result = await service.findMyMatches('user-id', {
      page: 1,
      limit: 10,
    } as any);

    expect(prisma.courtBooking.findMany).toHaveBeenCalled();
    expect(prisma.courtBooking.count).toHaveBeenCalled();
    expect(result.data[0].id).toBe('match-id');
  });

  it('should fallback to auth email in listClubBookings', async () => {
    (prisma.club.findUnique as jest.Mock).mockResolvedValue({
      id: 'club-id',
      createdBy: 'owner-id',
    } as any);
    (prisma.courtBooking.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'booking-id',
        userId: 'u1',
        court: { id: 'c1', name: 'Cancha 1', type: 'indoor' },
        start: new Date('2100-03-11T09:00:00.000Z'),
        end: new Date('2100-03-11T10:00:00.000Z'),
        status: 'CONFIRMED',
        createdAt: new Date('2100-03-10T09:00:00.000Z'),
        isMatch: false,
        title: null,
        maxPlayers: null,
        level: null,
        visibility: null,
        participants: [],
      },
    ] as any);
    (prisma.courtBooking.count as jest.Mock).mockResolvedValue(1 as any);
    (prisma.profile.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'u1',
        fullName: 'Nombre',
        avatarUrl: null,
        phone: null,
        email: null,
        level: null,
      },
    ] as any);

    const getUserById = jest.fn().mockResolvedValue({
      data: { user: { email: 'owner@example.com' } },
      error: null,
    });
    (supabaseService.getClient as jest.Mock).mockReturnValue({
      auth: { admin: { getUserById } },
    });

    const result = await service.listClubBookings(
      'club-id',
      'owner-id',
      {} as any,
    );

    expect(getUserById).toHaveBeenCalledWith('u1');
    expect(result.data[0].user.email).toBe('owner@example.com');
  });

  it('should join match when there is space and user not already joined', async () => {
    (prisma.courtBooking.findUnique as jest.Mock).mockResolvedValue({
      id: 'match-id',
      isMatch: true,
      userId: 'owner-id',
      start: new Date('2100-03-11T09:00:00.000Z'),
      end: new Date('2100-03-11T10:00:00.000Z'),
      maxPlayers: 4,
      participants: [{ profileId: 'someone-else' }],
    } as any);

    prisma.$transaction.mockImplementation((cb: any) =>
      cb({
        courtBooking: {
          findUnique: prisma.courtBooking.findUnique,
          update: prisma.courtBooking.update,
        },
        courtBookingParticipant: {
          create: prisma.courtBookingParticipant.create,
        },
      }),
    );

    const result = await service.joinMatch('match-id', 'user-id');

    expect(prisma.courtBookingParticipant.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'match-id',
        profileId: 'user-id',
      },
    });
    expect(result).toEqual({ message: 'Joined match successfully' });
  });

  it('should not allow joining a full match', async () => {
    (prisma.courtBooking.findUnique as jest.Mock).mockResolvedValue({
      id: 'match-id',
      isMatch: true,
      userId: 'owner-id',
      start: new Date('2100-03-11T09:00:00.000Z'),
      end: new Date('2100-03-11T10:00:00.000Z'),
      maxPlayers: 2,
      participants: [{ profileId: 'p1' }, { profileId: 'p2' }],
    } as any);

    prisma.$transaction.mockImplementation((cb: any) =>
      cb({
        courtBooking: {
          findUnique: prisma.courtBooking.findUnique,
          update: prisma.courtBooking.update,
        },
        courtBookingParticipant: {
          create: prisma.courtBookingParticipant.create,
        },
      }),
    );

    await expect(
      service.joinMatch('match-id', 'user-id'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
