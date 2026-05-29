import type { ClubReservation } from "@/types/club-reservation";

export type CalendarSlotRowKind =
  | "available"
  | "reserved"
  | "tentativeOpen"
  | "closed";

export type CalendarSlotRow = {
  start: string;
  end: string;
  kind: CalendarSlotRowKind;
  booking: ClubReservation | null;
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

export function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function reservationStartMs(r: ClubReservation): number {
  return new Date(r.start).getTime();
}

/** Próximas: desde hoy inclusive. Pasadas: antes de hoy. */
export function filterReservationsByListPeriod(
  reservations: ClubReservation[],
  showPast: boolean,
  referenceDate: Date = new Date(),
): ClubReservation[] {
  const todayStart = startOfLocalDay(referenceDate).getTime();
  return reservations.filter((r) => {
    const t = reservationStartMs(r);
    return showPast ? t < todayStart : t >= todayStart;
  });
}

/** Próximas: fecha ascendente. Pasadas: fecha descendente. */
export function sortReservationsForList(
  reservations: ClubReservation[],
  showPast: boolean,
): ClubReservation[] {
  return [...reservations].sort((a, b) => {
    const ta = reservationStartMs(a);
    const tb = reservationStartMs(b);
    return showPast ? tb - ta : ta - tb;
  });
}
