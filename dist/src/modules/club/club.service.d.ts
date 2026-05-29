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
export declare class ClubService {
    private readonly prisma;
    private readonly supabaseService;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, supabaseService: SupabaseService, mailService: MailService);
    private resolveEmailsFromAuth;
    private findScheduleRowContainingMinute;
    private assertValidScheduleTimeRangeDto;
    private resolveSlotPricePerHour;
    private computeBookingMoney;
    private matchGenderUiFromBooking;
    private buildMatchParticipantSlots;
    private generateUniqueInviteCode;
    private assertPlayerCanAccessCourt;
    create(dto: CreateClubDto, userId: string): Promise<{
        email: string | null;
        id: string;
        avatarUrl: string | null;
        location: string | null;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        courtCount: number;
        address: string;
        web: string | null;
        pricing: import("@prisma/client/runtime/client").JsonValue;
        approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
        createdBy: string | null;
    }>;
    findAll(query: QueryClubDto): Promise<{
        data: {
            amenities: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | null;
            email: string | null;
            id: string;
            avatarUrl: string | null;
            location: string | null;
            courtType: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            courtCount: number;
            address: string;
            web: string | null;
            pricing: import("@prisma/client/runtime/client").JsonValue;
            approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
            createdBy: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        amenities: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | null;
        phone: string | null;
        description: string | null;
        email: string | null;
        id: string;
        avatarUrl: string | null;
        location: string | null;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        courtCount: number;
        address: string;
        web: string | null;
        pricing: import("@prisma/client/runtime/client").JsonValue;
        approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
        createdBy: string | null;
    }>;
    findMine(userId: string): Promise<{
        club: {
            email: string | null;
            id: string;
            avatarUrl: string | null;
            location: string | null;
            courtType: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            courtCount: number;
            address: string;
            web: string | null;
            pricing: import("@prisma/client/runtime/client").JsonValue;
            approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
            createdBy: string | null;
        } | null;
    }>;
    listClubsForAdmin(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<{
        data: {
            email: string | null;
            id: string;
            avatarUrl: string | null;
            location: string | null;
            courtType: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            courtCount: number;
            address: string;
            web: string | null;
            pricing: import("@prisma/client/runtime/client").JsonValue;
            approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
            createdBy: string | null;
        }[];
    }>;
    approveClub(clubId: string): Promise<{
        email: string | null;
        id: string;
        avatarUrl: string | null;
        location: string | null;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        courtCount: number;
        address: string;
        web: string | null;
        pricing: import("@prisma/client/runtime/client").JsonValue;
        approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
        createdBy: string | null;
    }>;
    rejectClub(clubId: string): Promise<{
        email: string | null;
        id: string;
        avatarUrl: string | null;
        location: string | null;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        courtCount: number;
        address: string;
        web: string | null;
        pricing: import("@prisma/client/runtime/client").JsonValue;
        approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
        createdBy: string | null;
    }>;
    update(id: string, dto: UpdateClubDto, userId: string): Promise<{
        email: string | null;
        id: string;
        avatarUrl: string | null;
        location: string | null;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        courtCount: number;
        address: string;
        web: string | null;
        pricing: import("@prisma/client/runtime/client").JsonValue;
        approvalStatus: import("../../generated/prisma/enums").ClubApprovalStatus;
        createdBy: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    createCourt(clubId: string, dto: CreateCourtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        surface: string;
        lighting: boolean;
        listed: boolean;
        clubId: string;
    }>;
    findCourts(clubId: string, query: QueryCourtDto, viewerId?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: string;
            surface: string;
            lighting: boolean;
            listed: boolean;
            clubId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateCourt(clubId: string, courtId: string, dto: UpdateCourtDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: string;
        surface: string;
        lighting: boolean;
        listed: boolean;
        clubId: string;
    }>;
    removeCourt(clubId: string, courtId: string): Promise<{
        message: string;
    }>;
    listCourtSchedules(clubId: string, courtId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slotDurationMinutes: number;
        pricePerHour: number;
        dayOfWeek: number;
        startTimeMinutes: number;
        endTimeMinutes: number;
        periodName: string | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        courtId: string;
    }[]>;
    private schedulePeriodsCalendarOverlap;
    private schedulesTimeRangesOverlap;
    private parseMatchGender;
    private assertSchedulesNoPairwiseOverlap;
    private normalizeDateToYmd;
    private scheduleIdentityWithoutPeriodEnd;
    private assertOnlyPeriodEndEditableWithFutureBookings;
    private bookingCoveredBySchedules;
    replaceCourtSchedules(clubId: string, courtId: string, schedules: CreateCourtScheduleDto[], confirmCancelAffectedBookings?: boolean): Promise<{
        replaced: number;
    }>;
    createCourtSchedule(clubId: string, courtId: string, dto: CreateCourtScheduleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slotDurationMinutes: number;
        pricePerHour: number;
        dayOfWeek: number;
        startTimeMinutes: number;
        endTimeMinutes: number;
        periodName: string | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        courtId: string;
    }>;
    listCourtSlots(clubId: string, courtId: string, query: QueryCourtSlotsDto, viewerId: string): Promise<{
        data: {
            start: string;
            end: string;
            isAvailable: boolean;
            pricePerHour: number;
            isCustom: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    listCourtAvailabilityExceptions(clubId: string, courtId: string, month: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTimeMinutes: number | null;
        endTimeMinutes: number | null;
        isClosedAllDay: boolean;
        courtId: string;
    }[]>;
    replaceCourtAvailabilityExceptions(clubId: string, courtId: string, month: string, exceptions: ReplaceCourtExceptionsDto['exceptions']): Promise<{
        replaced: number;
    }>;
    listCourtCustomSlots(clubId: string, courtId: string, month: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTimeMinutes: number;
        endTimeMinutes: number;
        price: number;
        note: string | null;
        courtId: string;
    }[]>;
    createCourtCustomSlot(clubId: string, courtId: string, userId: string, dto: CreateCourtCustomSlotDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTimeMinutes: number;
        endTimeMinutes: number;
        price: number;
        note: string | null;
        courtId: string;
    }>;
    deleteCourtCustomSlot(clubId: string, courtId: string, slotId: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    private bookingOccupiesSlotRow;
    private resolveNextReservationBookerDisplay;
    private cancelTentativePublicMatchesOverlapping;
    private parseLocalDateOnly;
    private combineLocalDateAndMinutes;
    private getCourtSchedulesForCalendarDay;
    private pickScheduleContainingInterval;
    private bookingIntervalBlockedByExceptions;
    private minutesOverlap;
    private buildRegularSlotIntervalsFromSchedules;
    private mergeCancelledSlotsIntoExceptions;
    private formatMinutesLabel;
    private assertCustomSlotDoesNotOverlapActiveSlots;
    private findCustomSlotAtStart;
    private intervalsOverlapDateRange;
    private localDateKeyFromDate;
    private filterSchedulesActiveOnCalendarDay;
    createCourtBooking(clubId: string, courtId: string, userId: string, dto: CreateCourtBookingDto): Promise<{
        id: string;
        level: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        inviteCode: string | null;
        status: import("../../generated/prisma/enums").CourtBookingStatus;
        start: Date;
        manualGuests: import("@prisma/client/runtime/client").JsonValue | null;
        courtId: string;
        maxPlayers: number | null;
        userId: string;
        end: Date;
        isMatch: boolean;
        visibility: string;
        manualClubNotes: string | null;
        occupiesSlot: boolean;
        isFixedSeries: boolean;
        fixedSeriesId: string | null;
        fixedSeriesOccurrenceIndex: number | null;
        fixedSeriesRule: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    createFixedSeriesBookings(clubId: string, courtId: string, userId: string, dto: CreateFixedSeriesBookingsDto): Promise<{
        preview: boolean;
        seriesId: `${string}-${string}-${string}-${string}-${string}`;
        created: number;
        skippedNoScheduleDates: string[];
        cancelledBookingIds: string[];
    } | {
        preview: boolean;
        occurrenceCount: number;
        skippedNoScheduleDates: string[];
        blockedByOccupied: {
            id: string;
            start: string;
            end: string;
        }[];
        removableOverlaps: {
            id: string;
            start: string;
            end: string;
        }[];
        canProceed: boolean;
    }>;
    private getDashboardWindows;
    private parsePricePerHourMap;
    private hourPriceForInstant;
    private sumAvailableMinutesForClub;
    private availableMinutesForCourt;
    private sumAvailableSlotsForClub;
    private availableSlotsForCourt;
    private overlapMs;
    private startOfUtcDay;
    private scheduleHourPriceForInstant;
    private confirmedBookingRevenueDetailsInWindow;
    private confirmedBookingRevenueInWindow;
    private getAnalyticsWindows;
    private readonly peakHourBucketDefs;
    private addBookedMinutesToPeakBuckets;
    private sumAvailableMinutesInPeakBuckets;
    private trendPercent;
    private parseManualBookingGuests;
    private parseManualGuestsForCreate;
    private assertClubOwner;
    approveCourtBooking(clubId: string, bookingId: string, userId: string): Promise<{
        id: string;
        level: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        inviteCode: string | null;
        status: import("../../generated/prisma/enums").CourtBookingStatus;
        start: Date;
        manualGuests: import("@prisma/client/runtime/client").JsonValue | null;
        courtId: string;
        maxPlayers: number | null;
        userId: string;
        end: Date;
        isMatch: boolean;
        visibility: string;
        manualClubNotes: string | null;
        occupiesSlot: boolean;
        isFixedSeries: boolean;
        fixedSeriesId: string | null;
        fixedSeriesOccurrenceIndex: number | null;
        fixedSeriesRule: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    rejectCourtBooking(clubId: string, bookingId: string, userId: string): Promise<{
        id: string;
        level: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        inviteCode: string | null;
        status: import("../../generated/prisma/enums").CourtBookingStatus;
        start: Date;
        manualGuests: import("@prisma/client/runtime/client").JsonValue | null;
        courtId: string;
        maxPlayers: number | null;
        userId: string;
        end: Date;
        isMatch: boolean;
        visibility: string;
        manualClubNotes: string | null;
        occupiesSlot: boolean;
        isFixedSeries: boolean;
        fixedSeriesId: string | null;
        fixedSeriesOccurrenceIndex: number | null;
        fixedSeriesRule: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    cancelCourtBooking(clubId: string, bookingId: string, userId: string): Promise<{
        id: string;
        level: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        inviteCode: string | null;
        status: import("../../generated/prisma/enums").CourtBookingStatus;
        start: Date;
        manualGuests: import("@prisma/client/runtime/client").JsonValue | null;
        courtId: string;
        maxPlayers: number | null;
        userId: string;
        end: Date;
        isMatch: boolean;
        visibility: string;
        manualClubNotes: string | null;
        occupiesSlot: boolean;
        isFixedSeries: boolean;
        fixedSeriesId: string | null;
        fixedSeriesOccurrenceIndex: number | null;
        fixedSeriesRule: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    listUserBookings(userId: string): Promise<{
        upcoming: unknown[];
        history: unknown[];
    }>;
    listClubBookings(clubId: string, userId: string, query: QueryClubBookingsDto): Promise<{
        data: {
            id: string;
            userId: string;
            isFixedSeries: boolean;
            fixedSeriesId: string | null;
            fixedSeriesOccurrenceIndex: number | null;
            fixedSeriesRule: import("@prisma/client/runtime/client").JsonValue;
            user: {
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                email: string | null;
                level: number | null;
            };
            court: {
                id: string;
                name: string;
                type: string;
            };
            start: Date;
            end: Date;
            status: import("../../generated/prisma/enums").CourtBookingStatus;
            createdAt: Date;
            occupiesSlot: boolean;
            isMatch: boolean;
            title: string | null;
            maxPlayers: number | null;
            level: number | null;
            visibility: string;
            participants: {
                profileId: string;
                fullName: string | null;
                avatarUrl: string | null;
                level: number | null;
                phone: string | null;
            }[];
            manualGuests: {
                name: string;
                phone: string | null;
            }[] | undefined;
            manualClubNotes: string | null;
            slotPricePerHour: number | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getClubDashboard(clubId: string, userId: string, query: QueryClubDashboardDto): Promise<{
        range: "month" | "today" | "week";
        period: {
            start: string;
            end: string;
        };
        comparisonLabel: string;
        metrics: {
            bookings: {
                value: number;
                changePercent: number | null;
            };
            revenue: {
                valueEUR: number;
                changePercent: number | null;
            };
            occupancy: {
                valuePercent: number;
                changePercent: number | null;
            };
        };
        nextReservationByCourt: {
            courtId: string;
            courtName: string;
            booking: {
                priceEUR: number;
                bookerName: string | null;
                bookerPhone: string | null;
                bookerEmail: string | null;
                id: string;
                start: string;
                end: string;
                status: import("../../generated/prisma/enums").CourtBookingStatus;
            } | null;
        }[];
        openMatches: {
            id: string;
            courtName: string;
            level: number | null;
            start: string;
            end: string;
            maxPlayers: number;
            filledSlots: number;
            freeSlots: number;
            dayLabel: string;
            slots: ({
                empty: true;
            } | {
                empty: false;
                profileId: string;
                fullName: string | null;
                avatarUrl: string | null;
                phone: string | null;
                isOrganizer: boolean;
            })[];
        }[];
    }>;
    getClubAnalytics(clubId: string, userId: string, query: QueryClubAnalyticsDto): Promise<{
        range: "month" | "week" | "year";
        period: {
            start: string;
            end: string;
        };
        comparisonLabel: string;
        summary: {
            revenueEUR: number;
            bookings: number;
            occupancyAvgPercent: number;
            revenueChangePercent: number | null;
            bookingsChangePercent: number | null;
            occupancyChangePercent: number | null;
        };
        revenueByWeekday: {
            weekdayUtc: number;
            labelShort: string;
            amountEUR: number;
        }[];
        occupancyByCourt: {
            courtId: string;
            name: string;
            occupancyPercent: number;
        }[];
        peakHours: {
            label: "07:00–09:00" | "09:00–12:00" | "12:00–16:00" | "16:00–20:00" | "20:00–23:00";
            occupancyPercent: number;
        }[];
        topPlayers: {
            rank: number;
            userId: string;
            fullName: string | null;
            bookings: number;
            spendEUR: number;
        }[];
    }>;
    createMatch(clubId: string, userId: string, dto: CreateMatchDto): Promise<{
        id: string;
        level: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        inviteCode: string | null;
        status: import("../../generated/prisma/enums").CourtBookingStatus;
        start: Date;
        manualGuests: import("@prisma/client/runtime/client").JsonValue | null;
        courtId: string;
        maxPlayers: number | null;
        userId: string;
        end: Date;
        isMatch: boolean;
        visibility: string;
        manualClubNotes: string | null;
        occupiesSlot: boolean;
        isFixedSeries: boolean;
        fixedSeriesId: string | null;
        fixedSeriesOccurrenceIndex: number | null;
        fixedSeriesRule: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findMatches(clubId: string, query: QueryMatchDto): Promise<{
        data: {
            id: string;
            title: string | null;
            club: {
                id: string;
                name: string;
                address: string;
            };
            court: {
                id: string;
                name: string;
                type: string;
            };
            time: {
                start: Date;
                end: Date;
            };
            level: number | null;
            matchGender: "male" | "female" | "mixed" | null;
            maxPlayers: number | null;
            status: import("../../generated/prisma/enums").CourtBookingStatus;
            participantsCount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyMatches(userId: string, query: QueryMatchDto): Promise<{
        data: {
            id: string;
            title: string | null;
            club: {
                id: string;
                name: string;
                address: string;
            };
            court: {
                id: string;
                name: string;
                type: string;
            };
            time: {
                start: Date;
                end: Date;
            };
            level: number | null;
            matchGender: "male" | "female" | "mixed" | null;
            maxPlayers: number | null;
            status: import("../../generated/prisma/enums").CourtBookingStatus;
            participantsCount: number;
            isOrganizer: boolean;
            isParticipant: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findPublicMatches(userId: string, query: QueryMatchDto): Promise<{
        data: {
            id: string;
            title: string | null;
            club: {
                id: string;
                name: string;
                address: string;
            };
            court: {
                id: string;
                name: string;
                type: string;
            };
            time: {
                start: Date;
                end: Date;
            };
            level: number | null;
            matchGender: "male" | "female" | "mixed" | null;
            maxPlayers: number | null;
            status: import("../../generated/prisma/enums").CourtBookingStatus;
            participantsCount: number;
            isOrganizer: boolean;
            isParticipant: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    joinMatch(matchId: string, userId: string): Promise<{
        message: string;
    }>;
    leaveMatch(matchId: string, userId: string): Promise<{
        message: string;
    }>;
    createLooseMatch(profileId: string, dto: CreateLooseMatchDto): Promise<{
        id: string;
        level: number;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
        title: string;
        startLabel: string;
        inviteCode: string | null;
    }>;
    joinLooseMatch(matchId: string, userId: string): Promise<{
        message: string;
    }>;
    leaveLooseMatch(matchId: string, userId: string): Promise<{
        message: string;
    }>;
    getBookingInviteCode(bookingId: string, userId: string): Promise<string | null>;
    resolveInvite(inviteCode: string, userId: string): Promise<{
        type: "match";
        matchId: string;
        title: string | null;
        start: Date;
        end: Date;
        courtType: string;
        courtName: string;
        clubName: string;
        level: number | null;
        maxPlayers: number;
        participantsCount: number;
        isOrganizer: boolean;
        isParticipant: boolean;
        startLabel?: undefined;
    } | {
        type: "loose";
        matchId: string;
        title: string;
        startLabel: string;
        courtType: string;
        level: number;
        maxPlayers: number;
        participantsCount: number;
        isOrganizer: boolean;
        isParticipant: boolean;
        start?: undefined;
        end?: undefined;
        courtName?: undefined;
        clubName?: undefined;
    }>;
    joinInvite(inviteCode: string, userId: string): Promise<{
        message: string;
    }>;
    findMyLooseMatches(profileId: string, query: QueryLooseMatchDto): Promise<{
        data: {
            id: string;
            level: number;
            courtType: string;
            createdAt: Date;
            updatedAt: Date;
            profileId: string;
            title: string;
            startLabel: string;
            inviteCode: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findLooseMatches(userId: string, query: QueryLooseMatchDto): Promise<{
        data: {
            id: string;
            title: string;
            startLabel: string;
            level: number;
            courtType: string;
            createdAt: Date;
            updatedAt: Date;
            participantsCount: number;
            isOrganizer: boolean;
            isParticipant: boolean;
            maxPlayers: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMatchDetail(matchId: string, userId: string): Promise<{
        id: string;
        title: string | null;
        start: Date;
        end: Date;
        level: number | null;
        matchGender: "male" | "female" | "mixed" | null;
        maxPlayers: number;
        status: import("../../generated/prisma/enums").CourtBookingStatus;
        isMatch: boolean;
        manualGuests: {
            name: string;
            phone: string | null;
        }[] | undefined;
        visibility: string;
        slotPricePerHour: number | null;
        courtType: string;
        club: {
            id: string;
            name: string;
            address: string;
            avatarUrl: string | null;
            pricing: import("@prisma/client/runtime/client").JsonValue;
        };
        court: {
            id: string;
            name: string;
            type: string;
        };
        organizer: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        };
        participants: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        }[];
        participantsCount: number;
    }>;
    findLooseMatchDetail(matchId: string): Promise<{
        id: string;
        title: string;
        startLabel: string;
        level: number;
        courtType: string;
        maxPlayers: number;
        organizer: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        };
        createdAt: Date;
        updatedAt: Date;
        participants: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        }[];
        participantsCount: number;
    }>;
    private mapBoardAuthorProfile;
    private assertCourtBookingBoardAccess;
    private assertLooseMatchBoardAccess;
    listCourtBookingBoardMessages(matchId: string, userId: string): Promise<{
        id: string;
        body: string;
        createdAt: Date;
        author: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        };
    }[]>;
    postCourtBookingBoardMessage(matchId: string, userId: string, body: string): Promise<{
        id: string;
        body: string;
        createdAt: Date;
        author: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        };
    }>;
    deleteCourtBookingBoardMessage(matchId: string, messageId: string, userId: string): Promise<{
        deleted: true;
    }>;
    listLooseMatchBoardMessages(matchId: string, userId: string): Promise<{
        id: string;
        body: string;
        createdAt: Date;
        author: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        };
    }[]>;
    postLooseMatchBoardMessage(matchId: string, userId: string, body: string): Promise<{
        id: string;
        body: string;
        createdAt: Date;
        author: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            level: number | null;
            preferredPosition: string | null;
            courtType: string | null;
        };
    }>;
    deleteLooseMatchBoardMessage(matchId: string, messageId: string, userId: string): Promise<{
        deleted: true;
    }>;
    private notifyClosedCourtBookingMail;
    private notifyOpenMatchPublishedMail;
    private notifyMatchJoinMail;
    private notifyMatchLeaveMail;
}
