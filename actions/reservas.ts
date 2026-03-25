"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

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
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };
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
