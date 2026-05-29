export declare const MINUTES_PER_DAY: number;
export declare function effectiveEndTimeMinutes(startTimeMinutes: number, endTimeMinutes: number): number;
export declare function scheduleDurationMinutes(startTimeMinutes: number, endTimeMinutes: number): number;
export declare function isValidScheduleTimeRange(startTimeMinutes: number, endTimeMinutes: number): boolean;
export declare function scheduleTimeRangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean;
export declare function isMinuteWithinSchedule(minute: number, startTimeMinutes: number, endTimeMinutes: number): boolean;
export declare function isIntervalWithinSchedule(intervalStartMin: number, intervalEndMin: number, startTimeMinutes: number, endTimeMinutes: number): boolean;
export declare function dateFromScheduleAbsoluteMinutes(calendarDay: Date, absoluteMinutes: number): Date;
