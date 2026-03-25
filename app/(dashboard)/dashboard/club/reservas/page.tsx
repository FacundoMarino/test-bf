import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ReservationsBoard } from "@/components/reservas/ReservationsBoard";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";

type ReservationsResponse = {
  data: Array<{
    id: string;
    userId: string;
    user: { fullName: string | null; avatarUrl: string | null };
    court: { id: string; name: string; type: string };
    start: string;
    end: string;
    status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
    createdAt: string;
  }>;
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export default async function ReservasPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const res = await apiFetch<ReservationsResponse>(
    `/clubs/${ctx.club.id}/bookings?limit=500`,
    { authToken: token },
  );

  const reservations = res.error ? [] : res.data.data;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Reservas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestiona todas las reservas de tus canchas, con vista de lista y
          calendario semanal.
        </p>
      </div>
      <ReservationsBoard
        clubId={ctx.club.id}
        initialReservations={reservations}
      />
    </div>
  );
}
