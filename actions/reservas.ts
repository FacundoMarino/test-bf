"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";
import { normalizeClubReservation } from "@/lib/normalize-club-reservation";
import type { ClubReservation } from "@/types/club-reservation";

type ReservationsListResponse = {
  data: unknown[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

function normalizeMessage(body: unknown): string {
  if (body !== null && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m)) {
      return m.filter((s): s is string => typeof s === "string").join(", ");
    }
  }
  return "Error al guardar";
}

async function maybeLogoutOnInvalidToken(message: string) {
  if (!message.toLowerCase().includes("invalid or expired token")) return;
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_COOKIE_NAME);
  redirect("/login");
}

async function patchBookingStatus(
  clubId: string,
  bookingId: string,
  action: "approve" | "reject",
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}/bookings/${bookingId}/${action}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = normalizeMessage(body);
      await maybeLogoutOnInvalidToken(message);
      return { ok: false, error: message };
    }
    revalidatePath("/dashboard/club/reservas");
    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export async function approveClubBookingAction(
  clubId: string,
  bookingId: string,
) {
  return patchBookingStatus(clubId, bookingId, "approve");
}

export async function rejectClubBookingAction(
  clubId: string,
  bookingId: string,
) {
  return patchBookingStatus(clubId, bookingId, "reject");
}

export async function cancelClubBookingAction(
  clubId: string,
  bookingId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = normalizeMessage(body);
      await maybeLogoutOnInvalidToken(message);
      return { ok: false, error: message };
    }
    revalidatePath("/dashboard/club/reservas");
    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export type CourtSlotDay = {
  start: string;
  end: string;
  isAvailable: boolean;
  pricePerHour?: number;
};

export async function createManualCourtBookingAction(
  clubId: string,
  courtId: string,
  start: string,
  manualGuests: Array<{ name: string; phone?: string }>,
  manualNotes?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}/courts/${courtId}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start,
          manualGuests,
          ...(manualNotes?.trim() ? { manualNotes: manualNotes.trim() } : {}),
        }),
      },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = normalizeMessage(body);
      await maybeLogoutOnInvalidToken(message);
      return { ok: false, error: message };
    }
    revalidatePath("/dashboard/club/reservas");
    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

/** Lista actualizada de reservas (manualGuests incluido). Útil tras crear/cancelar sin depender solo de router.refresh. */
export async function refreshClubReservationsAction(
  clubId: string,
): Promise<
  { ok: true; reservations: ClubReservation[] } | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  const res = await apiFetch<ReservationsListResponse>(
    `/clubs/${clubId}/bookings?limit=500`,
    { authToken: token, cache: "no-store" },
  );
  if (res.error) {
    await maybeLogoutOnInvalidToken(res.error.message);
    return { ok: false, error: res.error.message };
  }
  const reservations = res.data.data
    .map(normalizeClubReservation)
    .filter((r): r is ClubReservation => r !== null);
  return { ok: true, reservations };
}

/** Slots del día para la vista calendario del club (misma API que la app jugadores). */
export async function listCourtDaySlotsAction(
  clubId: string,
  courtId: string,
  dateYmd: string,
): Promise<{ ok: true; slots: CourtSlotDay[] } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  try {
    const qs = new URLSearchParams({ date: dateYmd });
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}/courts/${courtId}/slots?${qs}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = normalizeMessage(body);
      await maybeLogoutOnInvalidToken(message);
      return { ok: false, error: message };
    }
    const raw = body as { data?: unknown[] };
    const rows = Array.isArray(raw.data) ? raw.data : [];
    const slots: CourtSlotDay[] = rows.map((row) => {
      const o = row as Record<string, unknown>;
      const snake = o as { is_available?: boolean; price_per_hour?: number };
      const isAvailable = (o.isAvailable ?? snake.is_available) !== false;
      const priceRaw = o.pricePerHour ?? snake.price_per_hour;
      const pricePerHour =
        typeof priceRaw === "number" && Number.isFinite(priceRaw)
          ? priceRaw
          : undefined;
      return {
        start: String(o.start ?? ""),
        end: String(o.end ?? ""),
        isAvailable,
        pricePerHour,
      };
    });
    return { ok: true, slots };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}
