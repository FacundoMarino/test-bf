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
  if (token) {
    const res = await apiFetch<{ data: CourtRecord[] }>(
      `/clubs/${ctx.club.id}/courts?limit=100`,
      { authToken: token },
    );
    if (!res.error) courts = res.data.data;
  }

  const defaultScheduleBlocks = defaultClubScheduleBlocks();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          canchas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestiona las canchas de tu club. Los horarios se guardan en{" "}
          <code className="text-foreground/80 text-xs">court_schedules</code> y
          definen los slots que expone el API (
          <code className="text-foreground/80 text-xs">/slots</code>
          ).
        </p>
      </div>
      <CourtsManager
        clubId={ctx.club.id}
        initialCourts={courts}
        defaultScheduleBlocks={defaultScheduleBlocks}
      />
    </div>
  );
}
