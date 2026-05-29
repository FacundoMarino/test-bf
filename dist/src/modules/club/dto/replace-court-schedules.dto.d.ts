import { CreateCourtScheduleDto } from './create-court-schedule.dto';
export declare class ReplaceCourtSchedulesDto {
    schedules: CreateCourtScheduleDto[];
    confirmCancelAffectedBookings?: boolean;
}
