import { describe, expect, it } from "vitest";

import {
  bookingOverlapsLocalDay,
  clubBookingsDayRange,
  clubBookingsListRange,
  clubBookingsMonthRange,
  mergeConsecutiveCalendarSlotRows,
  type CalendarSlotRow,
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
