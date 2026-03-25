import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClubProfileForm } from "@/components/club";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";
import type { CourtRecord } from "@/types/club";

export default async function ClubConfigPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");

  let hasCourts = false;
  if (ctx.club) {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
    if (token) {
      const courtsRes = await apiFetch<{ data: CourtRecord[] }>(
        `/clubs/${ctx.club.id}/courts?limit=1`,
        { authToken: token },
      );
      hasCourts = !courtsRes.error && courtsRes.data.data.length > 0;
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Configuración del club
        </h1>
      </div>
      <ClubProfileForm
        initialClub={ctx.club}
        initialProfile={ctx.profile}
        hasCourts={hasCourts}
      />
    </div>
  );
}
