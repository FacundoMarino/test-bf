declare class CourtExceptionDto {
    date: string;
    isClosedAllDay: boolean;
    startTimeMinutes?: number;
    endTimeMinutes?: number;
}
export declare class ReplaceCourtExceptionsDto {
    month: string;
    exceptions: CourtExceptionDto[];
}
export {};
