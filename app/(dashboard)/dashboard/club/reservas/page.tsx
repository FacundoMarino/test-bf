import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReservationsHeaderActions } from "@/components/reservas/ReservationsHeaderActions";

import { ReservationsBoard } from "@/components/reservas/ReservationsBoard";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";
import { normalizeClubReservation } from "@/lib/normalize-club-reservation";
import type { ClubReservation } from "@/types/club-reservation";

export const dynamic = "force-dynamic";

type ReservationsResponse = {
  data: unknown[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

type CourtsResponse = {
  data: Array<{
    id: string;
    name: string;
    type: string;
    surface: string;
  }>;
};

export default async function ReservasPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const [res, courtsRes] = await Promise.all([
    apiFetch<ReservationsResponse>(`/clubs/${ctx.club.id}/bookings?limit=500`, {
      authToken: token,
      cache: "no-store",
    }),
    apiFetch<CourtsResponse>(`/clubs/${ctx.club.id}/courts?limit=100`, {
      authToken: token,
      cache: "no-store",
    }),
  ]);

  const reservations: ClubReservation[] = res.error
    ? []
    : res.data.data
        .map(normalizeClubReservation)
        .filter((r): r is ClubReservation => r !== null);
  const courts = courtsRes.error ? [] : courtsRes.data.data;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Calendario
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Vista de turnos y reservas por cancha.
          </p>
        </div>
        <ReservationsHeaderActions clubId={ctx.club.id} courts={courts} />
      </div>
      <ReservationsBoard
        clubId={ctx.club.id}
        initialCourts={courts}
        initialReservations={reservations}
      />
    </div>
  );
}
