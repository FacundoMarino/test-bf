import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CourtsManager } from "@/components/courts";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { apiFetch } from "@/lib/api";
import { env } from "@/lib/env";
import { defaultClubScheduleBlocks } from "@/types/club";
import type { CourtRecord } from "@/types/club";

export default async function canchasPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  let courts: CourtRecord[] = [];
  let courtTotalCount = 0;
  if (token) {
    const res = await apiFetch<{
      data: CourtRecord[];
      meta: { total: number };
    }>(`/clubs/${ctx.club.id}/courts?limit=500`, { authToken: token });
    if (!res.error) {
      courts = res.data.data;
      courtTotalCount = res.data.meta.total;
    }
  }

  const defaultScheduleBlocks = defaultClubScheduleBlocks();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Canchas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestiona las canchas de tu club.
        </p>
      </div>
      <CourtsManager
        clubId={ctx.club.id}
        initialCourts={courts}
        courtTotalCount={courtTotalCount}
        maxCourts={ctx.club.courtCount}
        defaultScheduleBlocks={defaultScheduleBlocks}
      />
    </div>
  );
}
