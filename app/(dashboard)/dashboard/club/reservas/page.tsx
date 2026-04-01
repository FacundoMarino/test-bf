import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReservationsHeaderActions } from "@/components/reservas/ReservationsHeaderActions";

import { ReservationsBoard } from "@/components/reservas/ReservationsBoard";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";
import type { ClubReservation } from "@/types/club-reservation";

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

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function asNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeReservation(raw: unknown): ClubReservation | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const userRaw =
    row.user && typeof row.user === "object"
      ? (row.user as Record<string, unknown>)
      : {};
  const courtRaw =
    row.court && typeof row.court === "object"
      ? (row.court as Record<string, unknown>)
      : {};

  const participantsRaw = Array.isArray(row.participants)
    ? row.participants
    : [];
  const participants = participantsRaw
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      const pr = p as Record<string, unknown>;
      const profileId = asString(pr.profileId ?? pr.profile_id);
      if (!profileId) return null;
      return {
        profileId,
        fullName: asNullableString(pr.fullName ?? pr.full_name),
        avatarUrl: asNullableString(pr.avatarUrl ?? pr.avatar_url),
        level: asNullableNumber(pr.level),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const id = asString(row.id);
  const userId = asString(row.userId ?? row.user_id);
  const start = asString(row.start);
  const end = asString(row.end);
  const createdAt = asString(row.createdAt ?? row.created_at);
  const status = asString(row.status) as ClubReservation["status"];
  if (!id || !userId || !start || !end || !createdAt) return null;

  return {
    id,
    userId,
    user: {
      fullName: asNullableString(userRaw.fullName ?? userRaw.full_name),
      avatarUrl: asNullableString(userRaw.avatarUrl ?? userRaw.avatar_url),
      phone: asNullableString(
        userRaw.phone ?? userRaw.phoneNumber ?? userRaw.phone_number,
      ),
      email: asNullableString(
        userRaw.email ??
          userRaw.mail ??
          userRaw.emailAddress ??
          userRaw.email_address,
      ),
      level: asNullableNumber(userRaw.level),
    },
    userEmail: asNullableString(
      row.userEmail ?? row.user_email ?? row.bookerEmail ?? row.booker_email,
    ),
    court: {
      id: asString(courtRaw.id),
      name: asString(courtRaw.name),
      type: asString(courtRaw.type),
    },
    start,
    end,
    status,
    createdAt,
    isMatch: Boolean(row.isMatch ?? row.is_match),
    title: asNullableString(row.title),
    maxPlayers: asNullableNumber(row.maxPlayers ?? row.max_players),
    level: asNullableNumber(row.level),
    visibility: asNullableString(row.visibility),
    participants,
  };
}

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

  const reservations = res.error
    ? []
    : res.data.data
        .map(normalizeReservation)
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
