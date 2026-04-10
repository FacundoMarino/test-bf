import type { ClubReservation } from "@/types/club-reservation";

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
