import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarRange, Clock } from "lucide-react";

import { ReservationsBoard } from "@/components/reservas/ReservationsBoard";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";

type ReservationsResponse = {
  data: Array<{
    id: string;
    userId: string;
    user: {
      fullName: string | null;
      avatarUrl: string | null;
      phone?: string | null;
      level?: number | null;
      email?: string | null;
    };
    court: { id: string; name: string; type: string };
    start: string;
    end: string;
    status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
    createdAt: string;
    isMatch?: boolean;
    title?: string | null;
    maxPlayers?: number | null;
    level?: number | null;
    visibility?: string | null;
    participants?: Array<{
      profileId: string;
      fullName: string | null;
      avatarUrl: string | null;
    }>;
  }>;
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
    }),
    apiFetch<CourtsResponse>(`/clubs/${ctx.club.id}/courts?limit=100`, {
      authToken: token,
    }),
  ]);

  const reservations = res.error ? [] : res.data.data;
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
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/club/pistas"
            className="border-input bg-background hover:bg-muted inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm transition-colors"
          >
            <Clock className="size-4" />
            Horarios
          </Link>
          <Link
            href="/dashboard/club/pistas"
            className="border-input bg-background hover:bg-muted inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm transition-colors"
          >
            <CalendarRange className="size-4" />
            Excepciones
          </Link>
        </div>
      </div>
      <ReservationsBoard
        clubId={ctx.club.id}
        initialCourts={courts}
        initialReservations={reservations}
      />
    </div>
  );
}
