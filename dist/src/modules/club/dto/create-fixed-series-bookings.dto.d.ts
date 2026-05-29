export declare class CreateFixedSeriesBookingsDto {
    startDate: string;
    endDate?: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    durationMinutes: number;
    preview?: boolean;
    confirmRemoveOverlapping?: boolean;
    guestName?: string;
    guestPhone?: string;
    notes?: string;
}
