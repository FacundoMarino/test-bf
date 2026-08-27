"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";
import type {
  TournamentCategoryStandings,
  TournamentRecord,
} from "@/types/tournament";

async function getTokenOrRedirect() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  return token;
}

export async function listClubTournamentsAction(
  clubId: string,
): Promise<
  { ok: true; data: TournamentRecord[] } | { ok: false; error: string }
> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch<{ data: TournamentRecord[] }>(
    `/clubs/${clubId}/tournaments?page=1&pageSize=50`,
    { authToken: token, cache: "no-store" },
  );
  if (res.error) return { ok: false, error: res.error.message };
  return { ok: true, data: res.data.data ?? [] };
}

export async function getClubTournamentAction(
  clubId: string,
  tournamentId: string,
): Promise<
  { ok: true; data: TournamentRecord } | { ok: false; error: string }
> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch<{ data: TournamentRecord }>(
    `/clubs/${clubId}/tournaments/${tournamentId}`,
    { authToken: token, cache: "no-store" },
  );
  if (res.error) return { ok: false, error: res.error.message };
  return { ok: true, data: res.data.data };
}

export async function createTournamentAction(
  clubId: string,
  payload: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(`/clubs/${clubId}/tournaments`, {
    authToken: token,
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/dashboard/club/torneos");
  return { ok: true };
}

export async function updateTournamentAction(
  clubId: string,
  tournamentId: string,
  payload: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(`/clubs/${clubId}/tournaments/${tournamentId}`, {
    authToken: token,
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  revalidatePath("/dashboard/club/torneos");
  return { ok: true };
}

export async function publishTournamentAction(
  clubId: string,
  tournamentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/publish`,
    {
      authToken: token,
      method: "PATCH",
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  revalidatePath("/dashboard/club/torneos");
  return { ok: true };
}

export async function runTournamentDrawAction(
  clubId: string,
  tournamentId: string,
  categoryId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/categories/${categoryId}/draw`,
    {
      authToken: token,
      method: "POST",
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  return { ok: true };
}

export async function updateTournamentMatchScheduleAction(
  clubId: string,
  tournamentId: string,
  matchId: string,
  payload: {
    matchDate: string;
    startTimeMinutes: number;
    courtId?: string | null;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/matches/${matchId}/schedule`,
    {
      authToken: token,
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  return { ok: true };
}

export async function updateTournamentMatchResultAction(
  clubId: string,
  tournamentId: string,
  matchId: string,
  payload: {
    woSide?: number;
    sets?: Array<{
      home: number;
      away: number;
      tiebreakHome?: number;
      tiebreakAway?: number;
    }>;
    superTieBreakHome?: number;
    superTieBreakAway?: number;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/matches/${matchId}/result`,
    {
      authToken: token,
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  return { ok: true };
}

export async function getTournamentStandingsAction(
  clubId: string,
  tournamentId: string,
  categoryId: string,
): Promise<
  { ok: true; data: TournamentCategoryStandings } | { ok: false; error: string }
> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch<{ data: TournamentCategoryStandings }>(
    `/clubs/${clubId}/tournaments/${tournamentId}/categories/${categoryId}/standings`,
    { authToken: token, cache: "no-store" },
  );
  if (res.error) return { ok: false, error: res.error.message };
  return { ok: true, data: res.data.data };
}

export async function createClubTournamentRegistrationAction(
  clubId: string,
  tournamentId: string,
  categoryId: string,
  payload: {
    playerContact: string;
    playerName?: string;
    partnerName: string;
    partnerEmail?: string;
    preferredTimeNotes?: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/categories/${categoryId}/registrations/by-club`,
    {
      authToken: token,
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  return { ok: true };
}

export async function updateRegistrationPaymentAction(
  clubId: string,
  tournamentId: string,
  registrationId: string,
  payload: {
    side: "player" | "partner";
    isPaid: boolean;
    paymentMethod?: string | null;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/registrations/${registrationId}/payment`,
    {
      authToken: token,
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  return { ok: true };
}

export async function saveTournamentManualZonesAction(
  clubId: string,
  tournamentId: string,
  categoryId: string,
  payload: {
    zones: Array<{
      zoneId: string;
      entries: Array<{ registrationId?: string; isBye?: boolean }>;
    }>;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(
    `/clubs/${clubId}/tournaments/${tournamentId}/categories/${categoryId}/zones/manual`,
    {
      authToken: token,
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath(`/dashboard/club/torneos/${tournamentId}`);
  return { ok: true };
}
