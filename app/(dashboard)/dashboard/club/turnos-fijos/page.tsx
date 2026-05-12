import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FixedSeriesBoard } from "@/components/fixed-series/FixedSeriesBoard";
import { apiFetch } from "@/lib/api";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { env } from "@/lib/env";
import {
  aggregateFixedSeriesBookings,
  type FixedSeriesView,
} from "@/lib/turnos-fijos/aggregate-fixed-series";

export const dynamic = "force-dynamic";

type BookingsResponse = {
  data: unknown[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

type CourtsResponse = {
  data: Array<{
    id: string;
    name: string;
  }>;
};

function emptyBookings(): unknown[] {
  return [];
}

function resolveRows(
  res: Awaited<ReturnType<typeof apiFetch<BookingsResponse>>>,
): unknown[] {
  return res.error ? emptyBookings() : res.data.data;
}

function resolveCourts(
  res: Awaited<ReturnType<typeof apiFetch<CourtsResponse>>>,
): Array<{ id: string; name: string }> {
  return res.error
    ? []
    : res.data.data.map((c) => ({
        id: c.id,
        name: c.name,
      }));
}

async function loadTurnosFijosData(clubId: string, token: string) {
  const [bookingsRes, courtsRes] = await Promise.all([
    apiFetch<BookingsResponse>(`/clubs/${clubId}/bookings?limit=1500`, {
      authToken: token,
      cache: "no-store",
    }),
    apiFetch<CourtsResponse>(`/clubs/${clubId}/courts?limit=100`, {
      authToken: token,
      cache: "no-store",
    }),
  ]);

  const rows = resolveRows(bookingsRes);
  const courts = resolveCourts(courtsRes);
  const initialSeries: FixedSeriesView[] = aggregateFixedSeriesBookings(rows);

  return { courts, initialSeries };
}

export default async function TurnosFijosPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const { courts, initialSeries } = await loadTurnosFijosData(
    ctx.club.id,
    token,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <FixedSeriesBoard
        clubId={ctx.club.id}
        courts={courts}
        initialSeries={initialSeries}
      />
    </div>
  );
}
