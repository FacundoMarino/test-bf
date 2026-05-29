"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINUTES_PER_DAY = void 0;
exports.effectiveEndTimeMinutes = effectiveEndTimeMinutes;
exports.scheduleDurationMinutes = scheduleDurationMinutes;
exports.isValidScheduleTimeRange = isValidScheduleTimeRange;
exports.scheduleTimeRangesOverlap = scheduleTimeRangesOverlap;
exports.isMinuteWithinSchedule = isMinuteWithinSchedule;
exports.isIntervalWithinSchedule = isIntervalWithinSchedule;
exports.dateFromScheduleAbsoluteMinutes = dateFromScheduleAbsoluteMinutes;
exports.MINUTES_PER_DAY = 24 * 60;
function effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes) {
    if (endTimeMinutes > startTimeMinutes) {
        return endTimeMinutes;
    }
    return endTimeMinutes + exports.MINUTES_PER_DAY;
}
function scheduleDurationMinutes(startTimeMinutes, endTimeMinutes) {
    return (effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes) - startTimeMinutes);
}
function isValidScheduleTimeRange(startTimeMinutes, endTimeMinutes) {
    if (!Number.isFinite(startTimeMinutes) ||
        !Number.isFinite(endTimeMinutes) ||
        startTimeMinutes < 0 ||
        endTimeMinutes < 0 ||
        startTimeMinutes >= exports.MINUTES_PER_DAY ||
        endTimeMinutes >= exports.MINUTES_PER_DAY) {
        return false;
    }
    if (startTimeMinutes === endTimeMinutes)
        return false;
    const duration = scheduleDurationMinutes(startTimeMinutes, endTimeMinutes);
    return duration > 0 && duration <= exports.MINUTES_PER_DAY;
}
function scheduleTimeRangesOverlap(aStart, aEnd, bStart, bEnd) {
    const aEffEnd = effectiveEndTimeMinutes(aStart, aEnd);
    const bEffEnd = effectiveEndTimeMinutes(bStart, bEnd);
    return aStart < bEffEnd && bStart < aEffEnd;
}
function isMinuteWithinSchedule(minute, startTimeMinutes, endTimeMinutes) {
    return (minute >= startTimeMinutes &&
        minute < effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes));
}
function isIntervalWithinSchedule(intervalStartMin, intervalEndMin, startTimeMinutes, endTimeMinutes) {
    const effEnd = effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes);
    return intervalStartMin >= startTimeMinutes && intervalEndMin <= effEnd;
}
function dateFromScheduleAbsoluteMinutes(calendarDay, absoluteMinutes) {
    const dayOffset = Math.floor(absoluteMinutes / exports.MINUTES_PER_DAY);
    const clock = absoluteMinutes % exports.MINUTES_PER_DAY;
    const d = new Date(calendarDay.getFullYear(), calendarDay.getMonth(), calendarDay.getDate(), Math.floor(clock / 60), clock % 60, 0, 0);
    if (dayOffset > 0) {
        d.setDate(d.getDate() + dayOffset);
    }
    return d;
}
//# sourceMappingURL=court-schedule-time.util.js.map