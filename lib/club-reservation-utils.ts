import type { ClubReservation } from "@/types/club-reservation";

export type CalendarSlotRowKind =
  | "available"
  | "reserved"
  | "tentativeOpen"
  | "closed"
  | "personalized"
  | "tournament";

export type CalendarSlotRow = {
  start: string;
  end: string;
  kind: CalendarSlotRowKind;
  booking: ClubReservation | null;
  /** Nombre guardado en `note` del turno personalizado / torneo. */
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

/** Tope del listado de reservas del calendario (antes 500 más viejas, recortaba fijos futuros). */
export const CLUB_BOOKINGS_FETCH_LIMIT = 1500;

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Rango para el mes del mini-calendario, con un día de margen (huso / turnos que cruzan medianoche UTC).
 */
export function clubBookingsMonthRange(viewMonth: Date): {
  from: string;
  to: string;
} {
  const from = startOfLocalDay(
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1),
  );
  from.setDate(from.getDate() - 1);
  const to = startOfLocalDay(
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 2),
  );
  return { from: from.toISOString(), to: to.toISOString() };
}

/** Rango más amplio para la vista lista (pasados recientes + futuros). */
export function clubBookingsListRange(now = new Date()): {
  from: string;
  to: string;
} {
  const from = startOfLocalDay(now);
  from.setDate(from.getDate() - 60);
  const to = startOfLocalDay(now);
  to.setDate(to.getDate() + 400);
  return { from: from.toISOString(), to: to.toISOString() };
}

/**
 * Día visible del calendario, con un día de margen.
 * El listado del mes se corta en 1500 filas (varias canchas); un fijo de esa
 * fecha puede quedar afuera y el slot se pinta Cerrado.
 */
export function clubBookingsDayRange(day: Date): { from: string; to: string } {
  const from = startOfLocalDay(day);
  from.setDate(from.getDate() - 1);
  const to = startOfLocalDay(day);
  to.setDate(to.getDate() + 2);
  return { from: from.toISOString(), to: to.toISOString() };
}

/** La reserva pisa el día local aunque arranque el día anterior (medianoche). */
export function bookingOverlapsLocalDay(
  startIso: string,
  endIso: string,
  day: Date,
): boolean {
  const dayStart = startOfLocalDay(day).getTime();
  const dayEnd = startOfLocalDay(day);
  dayEnd.setDate(dayEnd.getDate() + 1);
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  return start < dayEnd.getTime() && end > dayStart;
}
