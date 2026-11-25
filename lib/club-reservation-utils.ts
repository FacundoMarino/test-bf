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

export type CourtDaySlot = {
  start: string;
  end: string;
  isAvailable: boolean;
  isPersonalized?: boolean;
  isTournament?: boolean;
  holdLabel?: string | null;
};

/** Turno personalizado / torneo (misma fuente que "Gestionar disponibilidad"). */
export type CalendarCustomHold = {
  startTimeMinutes: number;
  endTimeMinutes: number;
  holdLabel?: string | null;
  isTournament?: boolean;
};

function startOfLocalDayMs(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function minutesFromLocalDayStart(iso: string, dayStartMs: number): number {
  return (new Date(iso).getTime() - dayStartMs) / 60000;
}

function rangesOverlap(
  a0: number,
  a1: number,
  b0: number,
  b1: number,
): boolean {
  return a0 < b1 && a1 > b0;
}

/**
 * Incrusta los turnos personalizados del día: saca las franjas regulares que
 * pisan y agrega el bloque custom si el endpoint de slots no lo trajo.
 */
export function applyCustomHoldsToDaySlots(
  slots: CourtDaySlot[],
  holds: CalendarCustomHold[],
  day: Date,
): CourtDaySlot[] {
  if (holds.length === 0) return slots;
  const dayStartMs = startOfLocalDayMs(day);
  const slotRange = (s: CourtDaySlot) => ({
    a: minutesFromLocalDayStart(s.start, dayStartMs),
    b: minutesFromLocalDayStart(s.end, dayStartMs),
  });

  const filtered = slots.filter((s) => {
    if (s.isPersonalized || s.isTournament) return true;
    const { a, b } = slotRange(s);
    return !holds.some((h) =>
      rangesOverlap(a, b, h.startTimeMinutes, h.endTimeMinutes),
    );
  });

  const extras: CourtDaySlot[] = [];
  for (const hold of holds) {
    const already = filtered.some((s) => {
      if (!s.isPersonalized && !s.isTournament) return false;
      const { a, b } = slotRange(s);
      return rangesOverlap(a, b, hold.startTimeMinutes, hold.endTimeMinutes);
    });
    if (already) continue;
    extras.push({
      start: new Date(dayStartMs + hold.startTimeMinutes * 60000).toISOString(),
      end: new Date(dayStartMs + hold.endTimeMinutes * 60000).toISOString(),
      isAvailable: false,
      isPersonalized: hold.isTournament !== true,
      isTournament: hold.isTournament === true,
      holdLabel: hold.holdLabel ?? null,
    });
  }

  return [...filtered, ...extras].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}

/** Cruza las franjas de una cancha con sus reservas del día. */
export function buildCalendarSlotRows(
  slots: CourtDaySlot[],
  bookings: ClubReservation[],
): CalendarSlotRow[] {
  const raw: CalendarSlotRow[] = slots.map((slot) => {
    const s0 = new Date(slot.start).getTime();
    const s1 = new Date(slot.end).getTime();
    const overlapping = bookings.filter((r) => {
      if (r.status !== "PENDING" && r.status !== "CONFIRMED") return false;
      const b0 = new Date(r.start).getTime();
      const b1 = new Date(r.end).getTime();
      return s0 < b1 && s1 > b0;
    });
    const blockingBooking =
      overlapping.find((r) => bookingBlocksCalendarSlot(r)) ?? null;
    const tentativeBooking =
      overlapping.find((r) => isTentativePublicOpenMatch(r)) ?? null;
    const base = { start: slot.start, end: slot.end };

    if (slot.isTournament) {
      return {
        ...base,
        kind: "tournament",
        booking: null,
        holdLabel: slot.holdLabel ?? "Torneo",
      };
    }
    if (slot.isPersonalized) {
      return {
        ...base,
        kind: "personalized",
        booking: null,
        holdLabel: slot.holdLabel ?? null,
      };
    }
    if (blockingBooking) {
      return { ...base, kind: "reserved", booking: blockingBooking };
    }
    if (tentativeBooking && slot.isAvailable) {
      return { ...base, kind: "tentativeOpen", booking: tentativeBooking };
    }
    if (!slot.isAvailable) {
      return { ...base, kind: "closed", booking: null };
    }
    return { ...base, kind: "available", booking: null };
  });
  return mergeConsecutiveCalendarSlotRows(raw);
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
