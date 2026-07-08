"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";

function normalizeMessage(body: unknown): string {
  if (body !== null && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m))
      return m.filter((s): s is string => typeof s === "string").join(", ");
  }
  return "Error al guardar";
}

async function maybeLogoutOnInvalidToken(message: string) {
  if (!message.toLowerCase().includes("invalid or expired token")) return;
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_COOKIE_NAME);
  redirect("/login");
}

export type CreateFixedSeriesInput = {
  clubId: string;
  courtId: string;
  startDate: string;
  endDate?: string;
  dayOfWeek: number;
  startTimeMinutes: number;
  durationMinutes: number;
  guestName?: string;
  guestPhone?: string;
  notes?: string;
  preview?: boolean;
  confirmRemoveOverlapping?: boolean;
};

export async function createFixedSeriesAction(
  payload: CreateFixedSeriesInput,
): Promise<
  | { ok: true; data: unknown }
  | { ok: false; error: string; details?: unknown; status?: number }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesion no valida" };

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${payload.clubId}/courts/${payload.courtId}/bookings/fixed-series`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: payload.startDate,
          ...(payload.endDate?.trim() ? { endDate: payload.endDate } : {}),
          dayOfWeek: payload.dayOfWeek,
          startTimeMinutes: payload.startTimeMinutes,
          durationMinutes: payload.durationMinutes,
          ...(payload.guestName?.trim()
            ? { guestName: payload.guestName.trim() }
            : {}),
          ...(payload.guestPhone?.trim()
            ? { guestPhone: payload.guestPhone.trim() }
            : {}),
          ...(payload.notes?.trim() ? { notes: payload.notes.trim() } : {}),
          ...(payload.preview ? { preview: true } : {}),
          ...(payload.confirmRemoveOverlapping
            ? { confirmRemoveOverlapping: true }
            : {}),
        }),
      },
    );

    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = normalizeMessage(body);
      await maybeLogoutOnInvalidToken(message);
      return { ok: false, error: message, details: body, status: res.status };
    }

    revalidatePath("/dashboard/club/turnos-fijos");
    revalidatePath("/dashboard/club/reservas");
    return { ok: true, data: body };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export async function cancelFixedSeriesAction(payload: {
  clubId: string;
  seriesId?: string;
  bookingIds: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesion no valida" };
  const hasSeriesId =
    typeof payload.seriesId === "string" && payload.seriesId.trim().length > 0;
  if (!hasSeriesId && !payload.bookingIds.length) return { ok: true };

  try {
    if (hasSeriesId) {
      const res = await fetch(
        `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${payload.clubId}/bookings/fixed-series/${payload.seriesId!.trim()}/cancel`,
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
    } else {
      for (const bookingId of payload.bookingIds) {
        const res = await fetch(
          `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${payload.clubId}/bookings/${bookingId}/cancel`,
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
      }
    }

    revalidatePath("/dashboard/club/turnos-fijos");
    revalidatePath("/dashboard/club/reservas");
    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}
