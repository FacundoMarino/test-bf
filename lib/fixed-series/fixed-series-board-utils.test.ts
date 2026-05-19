import { describe, expect, it } from "vitest";

import type { CourtScheduleRow } from "@/lib/court-schedule-map";

import {
  buildFixedSeriesStartTimeOptions,
  scheduleActiveInRange,
} from "./fixed-series-board-utils";

function scheduleRow(
  partial: Partial<CourtScheduleRow> & Pick<CourtScheduleRow, "dayOfWeek">,
): CourtScheduleRow {
  return {
    id: "s1",
    courtId: "c1",
    startTimeMinutes: 9 * 60,
    endTimeMinutes: 18 * 60,
    slotDurationMinutes: 60,
    ...partial,
  };
}

describe("buildFixedSeriesStartTimeOptions", () => {
  it("includes afternoon starts when schedule ends at midnight", () => {
    const rows = [
      scheduleRow({
        dayOfWeek: 1,
        startTimeMinutes: 9 * 60,
        endTimeMinutes: 18 * 60,
      }),
      scheduleRow({
        id: "s2",
        dayOfWeek: 1,
        startTimeMinutes: 18 * 60,
        endTimeMinutes: 0,
      }),
    ];

    const options = buildFixedSeriesStartTimeOptions(rows, 1, 90);

    expect(options).toContain(9 * 60);
    expect(options).toContain(18 * 60);
    expect(options).toContain(22 * 60 + 30);
    expect(options).not.toContain(23 * 60);
  });

  it("returns only evening options for a day with overnight schedule", () => {
    const rows = [
      scheduleRow({
        dayOfWeek: 1,
        startTimeMinutes: 18 * 60,
        endTimeMinutes: 0,
      }),
    ];

    const options = buildFixedSeriesStartTimeOptions(rows, 1, 90);

    expect(options.length).toBeGreaterThan(0);
    expect(options.every((m) => m >= 18 * 60)).toBe(true);
  });
});

describe("scheduleActiveInRange", () => {
  it("treats open-ended periods as always active", () => {
    const row = scheduleRow({
      dayOfWeek: 2,
      periodStart: "2026-01-01",
      periodEnd: null,
    });
    const from = new Date(2026, 4, 19);
    const to = new Date(2026, 4, 26);

    expect(scheduleActiveInRange(row, from, to)).toBe(true);
  });
});
