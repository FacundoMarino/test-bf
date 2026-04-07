"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { env } from "@/lib/env";
import { apiFetch } from "@/lib/api";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminClubRow = {
  id: string;
  name: string;
  address: string;
  email: string | null;
  web: string | null;
  createdBy: string | null;
  createdAt: string;
  approvalStatus: ApprovalStatus;
};

async function getTokenOrRedirect() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");
  return token;
}

export async function listAdminPendingClubsAction(): Promise<
  { ok: true; data: AdminClubRow[] } | { ok: false; error: string }
> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch<{ data: AdminClubRow[] }>(
    "/clubs/admin?status=PENDING",
    {
      authToken: token,
    },
  );
  if (res.error) return { ok: false, error: res.error.message };
  return { ok: true, data: res.data.data ?? [] };
}

export async function approveClubAction(
  clubId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(`/clubs/admin/${clubId}/approve`, {
    authToken: token,
    method: "PATCH",
  });
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/dashboard/admin/clubs");
  return { ok: true };
}

export async function rejectClubAction(
  clubId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getTokenOrRedirect();
  const res = await apiFetch(`/clubs/admin/${clubId}/reject`, {
    authToken: token,
    method: "PATCH",
  });
  if (res.error) return { ok: false, error: res.error.message };
  revalidatePath("/dashboard/admin/clubs");
  return { ok: true };
}
