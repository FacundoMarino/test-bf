"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { env } from "@/lib/env";
import { apiFetch } from "@/lib/api";

export type AdminClubUserRow = {
  id: string;
  email: string;
  name: string;
  isClub: boolean;
  createdAt: string | null;
  membership: {
    clubId: string;
    clubName: string;
    role: "ADMINISTRADOR" | "RESERVAS";
  } | null;
};

export type AdminAssignableClub = {
  id: string;
  name: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
};

async function getTokenOrRedirect() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  return token;
}

export async function listAdminClubUsersAction(): Promise<
  | {
      ok: true;
      users: AdminClubUserRow[];
      clubs: AdminAssignableClub[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }
  | { ok: false; error: string }
> {
  return listAdminClubUsersByQueryAction();
}

export async function listAdminClubUsersByQueryAction(params?: {
  q?: string;
  clubId?: string;
  role?: "ADMINISTRADOR" | "RESERVAS";
  page?: number;
  limit?: number;
}): Promise<
  | {
      ok: true;
      users: AdminClubUserRow[];
      clubs: AdminAssignableClub[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }
  | { ok: false; error: string }
> {
  const token = await getTokenOrRedirect();
  const sp = new URLSearchParams();
  if (params?.q) sp.set("q", params.q);
  if (params?.clubId) sp.set("clubId", params.clubId);
  if (params?.role) sp.set("role", params.role);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();

  const res = await apiFetch<{
    users: AdminClubUserRow[];
    clubs: AdminAssignableClub[];
    meta?: { total: number; page: number; limit: number; totalPages: number };
  }>(`/clubs/admin/users${qs ? `?${qs}` : ""}`, { authToken: token });
  if (res.error) return { ok: false, error: res.error.message };
  return {
    ok: true,
    users: res.data.users ?? [],
    clubs: res.data.clubs ?? [],
    meta: res.data.meta ?? {
      total: res.data.users?.length ?? 0,
      page: 1,
      limit: res.data.users?.length ?? 20,
      totalPages: 1,
    },
  };
}

export async function assignAdminClubUserRoleAction(input: {
  userId: string;
  clubId: string;
  role: "ADMINISTRADOR" | "RESERVAS";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(`/clubs/admin/users/${input.userId}/membership`, {
    authToken: token,
    method: "PATCH",
    body: JSON.stringify({
      clubId: input.clubId,
      role: input.role,
    }),
  });

  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/dashboard/admin/usuarios");
  return { ok: true };
}
