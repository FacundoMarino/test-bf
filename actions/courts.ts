"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { clubBlocksToCourtSchedulePayload } from "@/lib/court-schedule-map";
import type { CourtScheduleRow } from "@/lib/court-schedule-map";
import { env } from "@/lib/env";
import type { ClubScheduleBlocks } from "@/types/club";

function normalizeMessage(body: unknown): string {
  if (body !== null && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m))
      return m.filter((s): s is string => typeof s === "string").join(", ");
  }
  return "Error al guardar";
}

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(env.SESSION_COOKIE_NAME)?.value ?? null;
}

function revalidateCourts() {
  revalidatePath("/dashboard/club/canchas");
  revalidatePath("/dashboard");
}

export async function getCourtSchedulesAction(
  clubId: string,
  courtId: string,
): Promise<
  { ok: true; rows: CourtScheduleRow[] } | { ok: false; error: string }
> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Sesión no válida" };
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}/courts/${courtId}/schedules`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };
    return { ok: true, rows: body as CourtScheduleRow[] };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export async function createCourtAction(
  clubId: string,
  data: {
    name: string;
    type: "indoor" | "outdoor";
    surface: string;
    lighting: boolean;
    schedule: ClubScheduleBlocks;
    schedulesPayload?: Array<{
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
      slotDurationMinutes: number;
    }>;
  },
): Promise<{ ok: true; courtId: string } | { ok: false; error: string }> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Sesión no válida" };
  const base = env.NEXT_PUBLIC_AUTH_SERVICE_URL;

  try {
    const res = await fetch(`${base}/clubs/${clubId}/courts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        surface: data.surface,
        lighting: data.lighting,
      }),
    });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };

    const court = body as { id: string };
    const schedules =
      data.schedulesPayload ?? clubBlocksToCourtSchedulePayload(data.schedule);

    const sr = await fetch(
      `${base}/clubs/${clubId}/courts/${court.id}/schedules`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schedules }),
      },
    );
    const sbody: unknown = await sr.json().catch(() => ({}));
    if (!sr.ok) {
      await fetch(`${base}/clubs/${clubId}/courts/${court.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
      return { ok: false, error: normalizeMessage(sbody) };
    }

    revalidateCourts();
    return { ok: true, courtId: court.id };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

/** Copia nombre, tipo, superficie, iluminación y todos los `CourtSchedule` de la cancha origen. */
export async function duplicateCourtAction(
  clubId: string,
  source: {
    id: string;
    name: string;
    type: string;
    surface: string;
    lighting: boolean;
  },
): Promise<{ ok: true; courtId: string } | { ok: false; error: string }> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Sesión no válida" };
  const base = env.NEXT_PUBLIC_AUTH_SERVICE_URL;

  const sched = await getCourtSchedulesAction(clubId, source.id);
  if (!sched.ok) return { ok: false, error: sched.error };

  const schedules = sched.rows.map((r) => ({
    dayOfWeek: r.dayOfWeek,
    startTimeMinutes: r.startTimeMinutes,
    endTimeMinutes: r.endTimeMinutes,
    slotDurationMinutes: r.slotDurationMinutes,
  }));

  const newName = `${source.name} (copia)`;

  try {
    const res = await fetch(`${base}/clubs/${clubId}/courts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newName,
        type: source.type === "outdoor" ? "outdoor" : "indoor",
        surface: source.surface,
        lighting: source.lighting,
      }),
    });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };

    const court = body as { id: string };

    const sr = await fetch(
      `${base}/clubs/${clubId}/courts/${court.id}/schedules`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schedules }),
      },
    );
    const sbody: unknown = await sr.json().catch(() => ({}));
    if (!sr.ok) {
      await fetch(`${base}/clubs/${clubId}/courts/${court.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
      return { ok: false, error: normalizeMessage(sbody) };
    }

    revalidateCourts();
    return { ok: true, courtId: court.id };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export async function updateCourtAction(
  clubId: string,
  courtId: string,
  data: {
    name: string;
    type: "indoor" | "outdoor";
    surface: string;
    lighting: boolean;
    schedule: ClubScheduleBlocks;
    schedulesPayload?: Array<{
      dayOfWeek: number;
      startTimeMinutes: number;
      endTimeMinutes: number;
      slotDurationMinutes: number;
    }>;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Sesión no válida" };
  const base = env.NEXT_PUBLIC_AUTH_SERVICE_URL;

  try {
    const res = await fetch(`${base}/clubs/${clubId}/courts/${courtId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        surface: data.surface,
        lighting: data.lighting,
      }),
    });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };

    const schedules =
      data.schedulesPayload ?? clubBlocksToCourtSchedulePayload(data.schedule);
    const sr = await fetch(
      `${base}/clubs/${clubId}/courts/${courtId}/schedules`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schedules }),
      },
    );
    const sbody: unknown = await sr.json().catch(() => ({}));
    if (!sr.ok) return { ok: false, error: normalizeMessage(sbody) };

    revalidateCourts();
    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}

export async function deleteCourtAction(
  clubId: string,
  courtId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Sesión no válida" };
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}/courts/${courtId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };
    revalidateCourts();
    return { ok: true };
  } catch {
    return { ok: false, error: "Error de red" };
  }
}
