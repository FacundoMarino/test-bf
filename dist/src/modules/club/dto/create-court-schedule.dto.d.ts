export declare class CreateCourtScheduleDto {
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string;
    periodStart?: string;
    periodEnd?: string;
}
