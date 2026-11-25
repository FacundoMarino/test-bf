import { describe, expect, it } from "vitest";

import {
  applyCustomHoldsToDaySlots,
  bookingOverlapsLocalDay,
  buildCalendarSlotRows,
  clubBookingsDayRange,
  clubBookingsListRange,
  clubBookingsMonthRange,
  mergeConsecutiveCalendarSlotRows,
  type CalendarSlotRow,
  type CourtDaySlot,
} from "./club-reservation-utils";
import type { ClubReservation } from "@/types/club-reservation";

function booking(id: string, start: string, end: string): ClubReservation {
  return {
    id,
    userId: "u1",
    user: { fullName: "Club Valencia", avatarUrl: null },
    court: { id: "c1", name: "Cancha", type: "outdoor" },
    start,
    end,
    status: "CONFIRMED",
    createdAt: "2026-05-27T10:00:00.000Z",
    isFixedSeries: true,
    occupiesSlot: true,
  };
}

describe("mergeConsecutiveCalendarSlotRows", () => {
  it("merges consecutive slots for the same booking", () => {
    const b = booking(
      "b1",
      "2026-05-27T18:00:00.000Z",
      "2026-05-27T20:00:00.000Z",
    );
    const rows: CalendarSlotRow[] = [
      {
        start: "2026-05-27T18:00:00.000Z",
        end: "2026-05-27T19:00:00.000Z",
        kind: "reserved",
        booking: b,
      },
      {
        start: "2026-05-27T19:00:00.000Z",
        end: "2026-05-27T20:00:00.000Z",
        kind: "reserved",
        booking: b,
      },
      {
        start: "2026-05-27T20:00:00.000Z",
        end: "2026-05-27T21:00:00.000Z",
        kind: "available",
        booking: null,
      },
    ];
    const merged = mergeConsecutiveCalendarSlotRows(rows);
    expect(merged).toHaveLength(2);
    expect(merged[0]?.kind).toBe("reserved");
    expect(merged[0]?.start).toBe(rows[0]!.start);
    expect(merged[0]?.end).toBe(rows[1]!.end);
    expect(merged[1]?.kind).toBe("available");
  });
});

describe("clubBookingsMonthRange", () => {
  it("pads one local day before the month and into the next", () => {
    const range = clubBookingsMonthRange(new Date(2026, 9, 15));
    const from = new Date(range.from);
    const to = new Date(range.to);
    expect(from.getFullYear()).toBe(2026);
    expect(from.getMonth()).toBe(8);
    expect(from.getDate()).toBe(30);
    expect(to.getFullYear()).toBe(2026);
    expect(to.getMonth()).toBe(10);
    expect(to.getDate()).toBe(2);
  });
});

describe("clubBookingsDayRange", () => {
  it("pads one local day before and two after the selected day", () => {
    const range = clubBookingsDayRange(new Date(2026, 10, 23, 15, 0, 0));
    const from = new Date(range.from);
    const to = new Date(range.to);
    expect(from.getFullYear()).toBe(2026);
    expect(from.getMonth()).toBe(10);
    expect(from.getDate()).toBe(22);
    expect(to.getFullYear()).toBe(2026);
    expect(to.getMonth()).toBe(10);
    expect(to.getDate()).toBe(25);
  });
});

describe("bookingOverlapsLocalDay", () => {
  it("includes a booking that starts the previous evening and ends after midnight", () => {
    const start = new Date(2026, 10, 22, 23, 0, 0).toISOString();
    const end = new Date(2026, 10, 23, 0, 30, 0).toISOString();
    expect(bookingOverlapsLocalDay(start, end, new Date(2026, 10, 23))).toBe(
      true,
    );
  });

  it("excludes a booking on the next calendar day", () => {
    const start = new Date(2026, 10, 24, 19, 0, 0).toISOString();
    const end = new Date(2026, 10, 24, 20, 30, 0).toISOString();
    expect(bookingOverlapsLocalDay(start, end, new Date(2026, 10, 23))).toBe(
      false,
    );
  });
});

describe("applyCustomHoldsToDaySlots", () => {
  it("drops overlapping regular slots and inserts the personalized hold", () => {
    const day = new Date(2026, 11, 8);
    const iso = (h: number, m = 0) =>
      new Date(2026, 11, 8, h, m, 0, 0).toISOString();
    const slots: CourtDaySlot[] = [
      { start: iso(16, 30), end: iso(18), isAvailable: true },
      { start: iso(18), end: iso(19, 30), isAvailable: true },
      { start: iso(19, 30), end: iso(21), isAvailable: true },
    ];
    const merged = applyCustomHoldsToDaySlots(
      slots,
      [
        {
          startTimeMinutes: 18 * 60,
          endTimeMinutes: 23 * 60,
          holdLabel: "Despedida pilates",
        },
      ],
      day,
    );
    expect(
      merged.some(
        (s) => s.isPersonalized && s.holdLabel === "Despedida pilates",
      ),
    ).toBe(true);
    expect(
      merged.some(
        (s) => s.isAvailable && s.start === iso(18) && s.end === iso(19, 30),
      ),
    ).toBe(false);
    expect(
      merged.some((s) => s.start === iso(16, 30) && s.end === iso(18)),
    ).toBe(true);
  });

  it("does not duplicate a hold already present in the slots payload", () => {
    const day = new Date(2026, 11, 8);
    const iso = (h: number, m = 0) =>
      new Date(2026, 11, 8, h, m, 0, 0).toISOString();
    const slots: CourtDaySlot[] = [
      {
        start: iso(18),
        end: iso(23),
        isAvailable: false,
        isPersonalized: true,
        holdLabel: "Despedida pilates",
      },
    ];
    const merged = applyCustomHoldsToDaySlots(
      slots,
      [{ startTimeMinutes: 18 * 60, endTimeMinutes: 23 * 60 }],
      day,
    );
    expect(merged.filter((s) => s.isPersonalized)).toHaveLength(1);
  });
});

describe("buildCalendarSlotRows", () => {
  it("paints personalized holds even if isAvailable is true", () => {
    const rows = buildCalendarSlotRows(
      [
        {
          start: "2026-12-08T18:00:00.000Z",
          end: "2026-12-08T23:00:00.000Z",
          isAvailable: true,
          isPersonalized: true,
          holdLabel: "Despedida pilates",
        },
      ],
      [],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.kind).toBe("personalized");
    expect(rows[0]?.holdLabel).toBe("Despedida pilates");
  });
});

describe("clubBookingsListRange", () => {
  it("covers past weeks and a long future window", () => {
    const now = new Date(2026, 9, 7);
    const range = clubBookingsListRange(now);
    const expectedFrom = new Date(2026, 9, 7);
    expectedFrom.setHours(0, 0, 0, 0);
    expectedFrom.setDate(expectedFrom.getDate() - 60);
    const expectedTo = new Date(2026, 9, 7);
    expectedTo.setHours(0, 0, 0, 0);
    expectedTo.setDate(expectedTo.getDate() + 400);
    expect(new Date(range.from).getTime()).toBe(expectedFrom.getTime());
    expect(new Date(range.to).getTime()).toBe(expectedTo.getTime());
  });
});
