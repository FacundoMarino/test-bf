import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import type { UserSession } from "@/types";
import type { ClubRecord, MyClubResponse, ProfileRecord } from "@/types/club";

import { apiFetch } from "./api";
import { env } from "./env";
import { getSession } from "./auth";

export type DashboardContext = {
  session: UserSession;
  profile: ProfileRecord | null;
  club: ClubRecord | null;
  clubRole: "ADMINISTRADOR" | "RESERVAS" | null;
};

async function readDashboardContext(): Promise<DashboardContext | null> {
  const session = await getSession();
  if (!session) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const [profileRes, clubRes] = await Promise.all([
    apiFetch<ProfileRecord>("/profile", { authToken: token }),
    apiFetch<MyClubResponse>("/clubs/me", { authToken: token }),
  ]);

  const profile = profileRes.error ? null : profileRes.data;
  const clubData = clubRes.error || !clubRes.data ? null : clubRes.data;
  const club = clubData?.club ?? null;
  const clubRole =
    clubData?.role === "ADMINISTRADOR" || clubData?.role === "RESERVAS"
      ? clubData.role
      : club
        ? "ADMINISTRADOR"
        : null;
  const nextSession: UserSession =
    clubRole == null
      ? session
      : { ...session, user: { ...session.user, clubRole } };

  return { session: nextSession, profile, club, clubRole };
}

export const getDashboardContext = cache(readDashboardContext);

export function isClubAccount(ctx: DashboardContext): boolean {
  return ctx.profile?.isClub === true || ctx.session.user.isClub === true;
}

export function isSuperAdminAccount(ctx: DashboardContext): boolean {
  return ctx.session.user.role === "super_admin";
}
