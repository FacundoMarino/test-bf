/** Minutos desde medianoche; 00:00 como fin = cierre a medianoche del mismo día. */
export const MINUTES_PER_DAY = 24 * 60;

/** Fin efectivo del turno (puede superar 1440 si cierra después de medianoche). */
export function effectiveEndTimeMinutes(
  startTimeMinutes: number,
  endTimeMinutes: number,
): number {
  if (endTimeMinutes > startTimeMinutes) {
    return endTimeMinutes;
  }
  return endTimeMinutes + MINUTES_PER_DAY;
}

export function scheduleDurationMinutes(
  startTimeMinutes: number,
  endTimeMinutes: number,
): number {
  return (
    effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes) - startTimeMinutes
  );
}

export function isValidScheduleTimeRange(
  startTimeMinutes: number,
  endTimeMinutes: number,
): boolean {
  if (
    !Number.isFinite(startTimeMinutes) ||
    !Number.isFinite(endTimeMinutes) ||
    startTimeMinutes < 0 ||
    endTimeMinutes < 0 ||
    startTimeMinutes >= MINUTES_PER_DAY ||
    endTimeMinutes >= MINUTES_PER_DAY
  ) {
    return false;
  }
  if (startTimeMinutes === endTimeMinutes) return false;
  const duration = scheduleDurationMinutes(startTimeMinutes, endTimeMinutes);
  return duration > 0 && duration <= MINUTES_PER_DAY;
}

export function scheduleTimeRangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  const aEffEnd = effectiveEndTimeMinutes(aStart, aEnd);
  const bEffEnd = effectiveEndTimeMinutes(bStart, bEnd);
  return aStart < bEffEnd && bStart < aEffEnd;
}

export function isMinuteWithinSchedule(
  minute: number,
  startTimeMinutes: number,
  endTimeMinutes: number,
): boolean {
  return (
    minute >= startTimeMinutes &&
    minute < effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes)
  );
}

export function isIntervalWithinSchedule(
  intervalStartMin: number,
  intervalEndMin: number,
  startTimeMinutes: number,
  endTimeMinutes: number,
): boolean {
  const effEnd = effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes);
  return intervalStartMin >= startTimeMinutes && intervalEndMin <= effEnd;
}

/** `absoluteMinutes` puede ser > 1440 (turnos después de medianoche). */
export function dateFromScheduleAbsoluteMinutes(
  calendarDay: Date,
  absoluteMinutes: number,
): Date {
  const dayOffset = Math.floor(absoluteMinutes / MINUTES_PER_DAY);
  const clock = absoluteMinutes % MINUTES_PER_DAY;
  const d = new Date(
    calendarDay.getFullYear(),
    calendarDay.getMonth(),
    calendarDay.getDate(),
    Math.floor(clock / 60),
    clock % 60,
    0,
    0,
  );
  if (dayOffset > 0) {
    d.setDate(d.getDate() + dayOffset);
  }
  return d;
}
