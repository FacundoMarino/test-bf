"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { clubProfileSaveSchema, type ClubProfileSavePayload } from "@/types";

function normalizeMessage(body: unknown): string {
  if (body !== null && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m))
      return m.filter((s): s is string => typeof s === "string").join(", ");
  }
  return "Error al guardar";
}

export async function saveClubProfileAction(
  payload: ClubProfileSavePayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = clubProfileSaveSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Datos inválidos" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  const base = env.NEXT_PUBLIC_AUTH_SERVICE_URL;
  const { clubId, club, profile } = parsed.data;

  const clubJson: Record<string, unknown> = {
    name: club.name,
    courtCount: club.courtCount,
    courtType: club.courtType,
    address: club.address,
    pricing: club.pricing,
  };
  if (club.email) clubJson.email = club.email;
  if (club.web) clubJson.web = club.web;
  if (club.avatarUrl) clubJson.avatarUrl = club.avatarUrl;

  try {
    if (clubId) {
      const res = await fetch(`${base}/clubs/${clubId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clubJson),
      });
      const body: unknown = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: normalizeMessage(body) };
    } else {
      const res = await fetch(`${base}/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clubJson),
      });
      const body: unknown = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: normalizeMessage(body) };
    }

    const profileBody: Record<string, unknown> = {
      /** Horarios solo en `court_schedules` (canchas); limpiar legacy en perfil. */
      availability: [],
      amenities: profile.amenities,
      isClub: true,
    };
    if (profile.description !== undefined)
      profileBody.description = profile.description;
    if (profile.location !== undefined) profileBody.location = profile.location;
    if (profile.phone !== undefined) profileBody.phone = profile.phone;

    const pres = await fetch(`${base}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileBody),
    });
    const pbody: unknown = await pres.json().catch(() => ({}));
    if (!pres.ok) return { ok: false, error: normalizeMessage(pbody) };
  } catch {
    return { ok: false, error: "Error de red" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/club");
  return { ok: true };
}

export async function deleteClubAction(
  clubId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/clubs/${clubId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: normalizeMessage(body) };
  } catch {
    return { ok: false, error: "Error de red" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/club");
  return { ok: true };
}
