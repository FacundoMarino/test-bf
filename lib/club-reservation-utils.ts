import type { ClubReservation } from "@/types/club-reservation";

export type CalendarSlotRowKind =
  | "available"
  | "reserved"
  | "tentativeOpen"
  | "closed"
  | "personalized";

export type CalendarSlotRow = {
  start: string;
  end: string;
  kind: CalendarSlotRowKind;
  booking: ClubReservation | null;
  /** Nombre guardado en `note` del turno personalizado. */
  holdLabel?: string | null;
};

/** Nombre del cliente en turno fijo o reserva manual. */
export function reservationGuestLabel(r: ClubReservation): string {
  const manual = r.manualGuests?.[0]?.name?.trim();
  if (manual) return manual;
  return r.user.fullName?.trim() || "Sin nombre";
}

/** Teléfono del cliente (manualGuests o perfil mapeado por el API). */
export function reservationGuestPhone(r: ClubReservation): string | null {
  const manual = r.manualGuests?.[0]?.phone?.trim();
  if (manual) return manual;
  const fromUser = r.user.phone?.trim();
  return fromUser || null;
}

/**
 * Varias franjas del mismo turno (p. ej. turno fijo de 2 h = 2 slots de 1 h)
 * se muestran como una sola fila con el rango completo.
 */
export function mergeConsecutiveCalendarSlotRows(
  rows: CalendarSlotRow[],
): CalendarSlotRow[] {
  const out: CalendarSlotRow[] = [];
  let i = 0;
  while (i < rows.length) {
    const row = rows[i]!;
    if (row.kind !== "reserved" || !row.booking) {
      out.push(row);
      i += 1;
      continue;
    }

    const mergedStart = row.start;
    let mergedEnd = row.end;
    const booking = row.booking;
    let j = i + 1;
    while (j < rows.length) {
      const next = rows[j]!;
      if (
        next.kind === "reserved" &&
        next.booking?.id === booking.id &&
        new Date(mergedEnd).getTime() === new Date(next.start).getTime()
      ) {
        mergedEnd = next.end;
        j += 1;
      } else {
        break;
      }
    }

    out.push({
      start: mergedStart,
      end: mergedEnd,
      kind: "reserved",
      booking,
    });
    i = j;
  }
  return out;
}

/** Reserva que bloquea el turno en el calendario del club. */
export function bookingBlocksCalendarSlot(r: ClubReservation): boolean {
  if (r.status === "CANCELLED" || r.status === "REJECTED") return false;
  return r.occupiesSlot !== false;
}

/** Partido abierto público aún sin completar plazas: no bloquea el hueco. */
export function isTentativePublicOpenMatch(r: ClubReservation): boolean {
  return (
    r.isMatch === true &&
    (r.visibility ?? "public") === "public" &&
    r.occupiesSlot === false &&
    (r.status === "PENDING" || r.status === "CONFIRMED")
  );
}

export function matchParticipantsCount(r: ClubReservation): number {
  const n = r.participants?.length ?? 0;
  return n > 0 ? n : 1;
}
