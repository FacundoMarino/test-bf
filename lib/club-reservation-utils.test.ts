import { describe, expect, it } from "vitest";

import {
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
