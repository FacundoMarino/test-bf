"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { env } from "@/lib/env";
import { apiFetch } from "@/lib/api";
import { FALLBACK_CITIES } from "@/lib/profile-cities";

export type CityRow = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ActiveCity = {
  id: string;
  name: string;
};

async function getTokenOrRedirect() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  return token;
}

/** Catálogo público (selects). Fallback local si la API falla. */
export async function listActiveCitiesAction(): Promise<string[]> {
  const res = await apiFetch<{ data: ActiveCity[] }>("/cities");
  if (res.error || !res.data?.data?.length) {
    return [...FALLBACK_CITIES];
  }
  return res.data.data.map((c) => c.name);
}

export async function listAdminCitiesAction(): Promise<
  { ok: true; data: CityRow[] } | { ok: false; error: string }
> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch<{ data: CityRow[] }>("/cities/admin", {
    authToken: token,
  });
  if (res.error) return { ok: false, error: res.error.message };
  return { ok: true, data: res.data.data ?? [] };
}

export async function createCityAction(
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch("/cities", {
    authToken: token,
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/dashboard/admin/cities");
  return { ok: true };
}

export async function deleteCityAction(
  cityId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(`/cities/${cityId}`, {
    authToken: token,
    method: "DELETE",
  });
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/dashboard/admin/cities");
  return { ok: true };
}
