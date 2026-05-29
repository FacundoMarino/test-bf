declare class CancelledSlotRangeDto {
    startTimeMinutes: number;
    endTimeMinutes: number;
}
export declare class CreateCourtCustomSlotDto {
    date: string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string;
    cancelledSlots?: CancelledSlotRangeDto[];
}
export {};
