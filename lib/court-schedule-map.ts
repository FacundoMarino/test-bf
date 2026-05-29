import {
  DEFAULT_COURT_SLOT_DURATION_MINUTES,
  SLOT_DURATION_OPTIONS,
  type ClubScheduleBlock,
  type ClubScheduleBlocks,
  type DailyScheduleBlocks,
} from "@/types/club";

export const COURT_MAX_SLOT_MINUTES = 8 * 60;

export const COURT_SLOT_DURATION_OPTIONS = SLOT_DURATION_OPTIONS.filter(
  (o) => o.minutes <= COURT_MAX_SLOT_MINUTES,
);

export type CourtScheduleRow = {
  id: string;
  courtId: string;
  dayOfWeek: number;
  startTimeMinutes: number;
  endTimeMinutes: number;
  slotDurationMinutes: number;
  pricePerHour?: number;
  periodName?: string | null;
  periodStart?: string | null;
  periodEnd?: string | null;
};

export const MINUTES_PER_DAY = 24 * 60;

export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Fin efectivo del turno (00:00 o 01:00 = cierre después de medianoche). */
export function effectiveEndTimeMinutes(
  startTimeMinutes: number,
  endTimeMinutes: number,
): number {
  if (endTimeMinutes > startTimeMinutes) {
    return endTimeMinutes;
  }
  return endTimeMinutes + MINUTES_PER_DAY;
}

export function isValidScheduleTimeRange(
  startTimeMinutes: number,
  endTimeMinutes: number,
): boolean {
  if (
    startTimeMinutes < 0 ||
    endTimeMinutes < 0 ||
    startTimeMinutes >= MINUTES_PER_DAY ||
    endTimeMinutes >= MINUTES_PER_DAY
  ) {
    return false;
  }
  if (startTimeMinutes === endTimeMinutes) return false;
  const duration =
    effectiveEndTimeMinutes(startTimeMinutes, endTimeMinutes) -
    startTimeMinutes;
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

export function minutesToHHmm(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type ScheduleSlotInterval = { start: number; end: number };

export function buildCourtScheduleSlotIntervals(
  rows: Array<{
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
  }>,
): ScheduleSlotInterval[] {
  const generatedByKey = new Map<string, ScheduleSlotInterval>();
  const sortedRows = [...rows].sort(
    (a, b) => a.startTimeMinutes - b.startTimeMinutes,
  );
  for (const row of sortedRows) {
    let cur = row.startTimeMinutes;
    const effectiveEnd = effectiveEndTimeMinutes(
      row.startTimeMinutes,
      row.endTimeMinutes,
    );
    while (cur + row.slotDurationMinutes <= effectiveEnd) {
      const end = cur + row.slotDurationMinutes;
      const key = `${cur}-${end}`;
      if (!generatedByKey.has(key)) {
        generatedByKey.set(key, { start: cur, end });
      }
      cur = end;
    }
  }
  return Array.from(generatedByKey.values()).sort((a, b) => a.start - b.start);
}

export function clubBlocksToCourtSchedulePayload(
  blocks: ClubScheduleBlocks,
): Array<{
  dayOfWeek: number;
  startTimeMinutes: number;
  endTimeMinutes: number;
  slotDurationMinutes: number;
}> {
  const cap = (m: number) => Math.min(m, COURT_MAX_SLOT_MINUTES);
  const w = blocks.weekday;
  const sat = blocks.saturday;
  const sun = blocks.sunday;
  const out: Array<{
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
  }> = [];
  if (w.enabled) {
    for (const dow of [1, 2, 3, 4, 5]) {
      out.push({
        dayOfWeek: dow,
        startTimeMinutes: hhmmToMinutes(w.startTime),
        endTimeMinutes: hhmmToMinutes(w.endTime),
        slotDurationMinutes: cap(w.slotDurationMinutes),
      });
    }
  }
  if (sat.enabled) {
    out.push({
      dayOfWeek: 6,
      startTimeMinutes: hhmmToMinutes(sat.startTime),
      endTimeMinutes: hhmmToMinutes(sat.endTime),
      slotDurationMinutes: cap(sat.slotDurationMinutes),
    });
  }
  if (sun.enabled) {
    out.push({
      dayOfWeek: 0,
      startTimeMinutes: hhmmToMinutes(sun.startTime),
      endTimeMinutes: hhmmToMinutes(sun.endTime),
      slotDurationMinutes: cap(sun.slotDurationMinutes),
    });
  }
  return out;
}

export function dailyBlocksToCourtSchedulePayload(
  blocks: DailyScheduleBlocks,
): Array<{
  dayOfWeek: number;
  startTimeMinutes: number;
  endTimeMinutes: number;
  slotDurationMinutes: number;
}> {
  const cap = (m: number) => Math.min(m, COURT_MAX_SLOT_MINUTES);
  const map: Array<{ dayOfWeek: number; block: ClubScheduleBlock }> = [
    { dayOfWeek: 1, block: blocks.monday },
    { dayOfWeek: 2, block: blocks.tuesday },
    { dayOfWeek: 3, block: blocks.wednesday },
    { dayOfWeek: 4, block: blocks.thursday },
    { dayOfWeek: 5, block: blocks.friday },
    { dayOfWeek: 6, block: blocks.saturday },
    { dayOfWeek: 0, block: blocks.sunday },
  ];
  return map
    .filter(({ block }) => block.enabled)
    .map(({ dayOfWeek, block }) => ({
      dayOfWeek,
      startTimeMinutes: hhmmToMinutes(block.startTime),
      endTimeMinutes: hhmmToMinutes(block.endTime),
      slotDurationMinutes: cap(block.slotDurationMinutes),
    }));
}

const INACTIVE_BLOCK: ClubScheduleBlock = {
  enabled: false,
  startTime: "07:00",
  endTime: "23:00",
  slotDurationMinutes: DEFAULT_COURT_SLOT_DURATION_MINUTES,
};

function rowToActiveBlock(r: CourtScheduleRow): ClubScheduleBlock {
  return {
    enabled: true,
    startTime: minutesToHHmm(r.startTimeMinutes),
    endTime: minutesToHHmm(r.endTimeMinutes),
    slotDurationMinutes: Math.min(
      r.slotDurationMinutes,
      COURT_MAX_SLOT_MINUTES,
    ),
  };
}

export function courtScheduleRowsToClubBlocks(
  rows: CourtScheduleRow[],
): ClubScheduleBlocks {
  const byDay = new Map(rows.map((r) => [r.dayOfWeek, r]));

  const weekdayDows = [1, 2, 3, 4, 5] as const;
  const hasWeekday = weekdayDows.some((d) => byDay.has(d));
  let weekday: ClubScheduleBlock;
  if (!hasWeekday) {
    weekday = { ...INACTIVE_BLOCK };
  } else {
    const template =
      byDay.get(1) ??
      byDay.get(2) ??
      byDay.get(3) ??
      byDay.get(4) ??
      byDay.get(5)!;
    weekday = rowToActiveBlock(template);
  }

  const satRow = byDay.get(6);
  const sunRow = byDay.get(0);

  return {
    weekday,
    saturday: satRow ? rowToActiveBlock(satRow) : { ...INACTIVE_BLOCK },
    sunday: sunRow ? rowToActiveBlock(sunRow) : { ...INACTIVE_BLOCK },
  };
}

export function courtScheduleRowsToDailyBlocks(
  rows: CourtScheduleRow[],
): DailyScheduleBlocks {
  const byDay = new Map(rows.map((r) => [r.dayOfWeek, r]));
  return {
    monday: byDay.get(1)
      ? rowToActiveBlock(byDay.get(1)!)
      : { ...INACTIVE_BLOCK },
    tuesday: byDay.get(2)
      ? rowToActiveBlock(byDay.get(2)!)
      : { ...INACTIVE_BLOCK },
    wednesday: byDay.get(3)
      ? rowToActiveBlock(byDay.get(3)!)
      : { ...INACTIVE_BLOCK },
    thursday: byDay.get(4)
      ? rowToActiveBlock(byDay.get(4)!)
      : { ...INACTIVE_BLOCK },
    friday: byDay.get(5)
      ? rowToActiveBlock(byDay.get(5)!)
      : { ...INACTIVE_BLOCK },
    saturday: byDay.get(6)
      ? rowToActiveBlock(byDay.get(6)!)
      : { ...INACTIVE_BLOCK },
    sunday: byDay.get(0)
      ? rowToActiveBlock(byDay.get(0)!)
      : { ...INACTIVE_BLOCK },
  };
}
