import { Suspense } from "react";
import { cookies } from "next/headers";

import {
  ClubDashboardError,
  ClubDashboardHome,
  StatsSection,
  StatsSectionSkeleton,
} from "@/components/dashboard";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { fetchClubDashboard } from "@/lib/club-dashboard";
import { env } from "@/lib/env";

export default async function DashboardPage() {
  const ctx = await getDashboardContext();
  if (!ctx) return null;

  const { session } = ctx;
  const clubUser = isClubAccount(ctx);

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  const clubDashboard =
    clubUser && ctx.club && token
      ? await fetchClubDashboard(ctx.club.id, token, "today")
      : null;

  return (
    <div className="space-y-8">
      {!clubUser ? (
        <section className="border-border bg-card rounded-xl border p-6 shadow-sm ring-1 ring-foreground/5">
          <h2 className="text-lg font-medium tracking-tight">
            Hola,{" "}
            <span className="text-primary font-semibold">
              {session.user.name}
            </span>
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Este es tu panel. Los datos se cargan de forma progresiva sin
            bloquear el shell.
          </p>
        </section>
      ) : null}

      {clubUser && ctx.club ? (
        clubDashboard?.error || !clubDashboard?.data ? (
          <ClubDashboardError />
        ) : (
          <ClubDashboardHome data={clubDashboard.data} />
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
