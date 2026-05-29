import { describe, expect, it } from "vitest";

import { buildCourtScheduleSlotIntervals } from "./court-schedule-map";

describe("buildCourtScheduleSlotIntervals", () => {
  it("generates evening slots when schedule ends at midnight", () => {
    const slots = buildCourtScheduleSlotIntervals([
      {
        startTimeMinutes: 18 * 60,
        endTimeMinutes: 0,
        slotDurationMinutes: 60,
      },
    ]);

    expect(slots).toEqual([
      { start: 18 * 60, end: 19 * 60 },
      { start: 19 * 60, end: 20 * 60 },
      { start: 20 * 60, end: 21 * 60 },
      { start: 21 * 60, end: 22 * 60 },
      { start: 22 * 60, end: 23 * 60 },
      { start: 23 * 60, end: 24 * 60 },
    ]);
  });

  it("generates slots for same-day ranges unchanged", () => {
    const slots = buildCourtScheduleSlotIntervals([
      {
        startTimeMinutes: 9 * 60,
        endTimeMinutes: 12 * 60,
        slotDurationMinutes: 60,
      },
    ]);

    expect(slots).toEqual([
      { start: 9 * 60, end: 10 * 60 },
      { start: 10 * 60, end: 11 * 60 },
      { start: 11 * 60, end: 12 * 60 },
    ]);
  });
});
