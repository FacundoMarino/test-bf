import { describe, expect, it } from "vitest";

import {
  filterReservationsByListPeriod,
  mergeConsecutiveCalendarSlotRows,
  sortReservationsForList,
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

describe("list reservation period filter and sort", () => {
  const ref = new Date(2026, 4, 29);

  it("upcoming includes today onward and sorts ascending", () => {
    const rows = [
      booking("future-far", "2030-12-23T18:00:00", "2030-12-23T19:00:00"),
      booking("day-after", "2026-05-31T18:00:00", "2026-05-31T19:00:00"),
      booking("today", "2026-05-29T18:00:00", "2026-05-29T19:00:00"),
      booking("yesterday", "2026-05-28T18:00:00", "2026-05-28T19:00:00"),
    ];
    const scoped = filterReservationsByListPeriod(rows, false, ref);
    expect(new Set(scoped.map((r) => r.id))).toEqual(
      new Set(["today", "day-after", "future-far"]),
    );
    const sorted = sortReservationsForList(scoped, false);
    expect(sorted.map((r) => r.id)).toEqual([
      "today",
      "day-after",
      "future-far",
    ]);
  });

  it("past excludes today and sorts descending", () => {
    const rows = [
      booking("older", "2026-05-25T18:00:00", "2026-05-25T19:00:00"),
      booking("yesterday", "2026-05-28T18:00:00", "2026-05-28T19:00:00"),
      booking("today", "2026-05-29T18:00:00", "2026-05-29T19:00:00"),
    ];
    const scoped = filterReservationsByListPeriod(rows, true, ref);
    expect(new Set(scoped.map((r) => r.id))).toEqual(
      new Set(["yesterday", "older"]),
    );
    const sorted = sortReservationsForList(scoped, true);
    expect(sorted.map((r) => r.id)).toEqual(["yesterday", "older"]);
  });
});
