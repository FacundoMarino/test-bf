import { Suspense } from "react";
import { cookies } from "next/headers";

import {
  ClubDashboardError,
  ClubDashboardHome,
  StatsSection,
  StatsSectionSkeleton,
} from "@/components/dashboard";
import { canViewRevenue, resolveClubRole } from "@/lib/club-permissions";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { fetchClubDashboard } from "@/lib/club-dashboard";
import { env } from "@/lib/env";

export default async function DashboardPage() {
  const ctx = await getDashboardContext();
  if (!ctx) return null;

  const { session } = ctx;
  const clubUser = isClubAccount(ctx);
  const clubRole = clubUser
    ? resolveClubRole(session.user, ctx.clubRole)
    : null;

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  const clubDashboard =
    clubUser && ctx.club && token
      ? await fetchClubDashboard(ctx.club.id, token, "today")
      : null;

  return (
    <div className="space-y-8">
      {clubUser && ctx.club ? (
        clubDashboard?.error || !clubDashboard?.data ? (
          <ClubDashboardError />
        ) : (
          <ClubDashboardHome
            data={clubDashboard.data}
            showRevenue={clubRole ? canViewRevenue(clubRole) : true}
          />
        )
      ) : (
        <section>
          <h3 className="text-muted-foreground mb-4 font-mono text-xs font-medium uppercase tracking-wider">
            Resumen
          </h3>
          <Suspense fallback={<StatsSectionSkeleton />}>
            <StatsSection />
          </Suspense>
        </section>
      )}
    </div>
  );
}
