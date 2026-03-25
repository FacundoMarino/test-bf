import Link from "next/link";
import type { Route } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Building2 } from "lucide-react";

import {
  ClubDashboardError,
  ClubDashboardHome,
  StatsSection,
  StatsSectionSkeleton,
} from "@/components/dashboard";
import { buttonVariants } from "@/components/ui/button-variants";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import {
  fetchClubDashboard,
  normalizeDashboardRange,
} from "@/lib/club-dashboard";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string | string[] }>;
}) {
  const ctx = await getDashboardContext();
  if (!ctx) return null;

  const { session } = ctx;
  const clubUser = isClubAccount(ctx);
  const sp = (await searchParams) ?? {};
  const range = normalizeDashboardRange(sp.range);

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  const clubDashboard =
    clubUser && ctx.club && token
      ? await fetchClubDashboard(ctx.club.id, token, range)
      : null;

  return (
    <div className="space-y-8">
      <section className="border-border bg-card rounded-xl border p-6 shadow-sm ring-1 ring-foreground/5">
        <h2 className="text-lg font-medium tracking-tight">
          Hola,{" "}
          <span className="text-primary font-semibold">
            {session.user.name}
          </span>
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {clubUser && ctx.club
            ? "Resumen operativo de tu club y reservas."
            : "Este es tu panel. Los datos se cargan de forma progresiva sin bloquear el shell."}
        </p>
        {clubUser ? (
          <div className="border-border mt-4 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Building2 className="size-5" />
              </span>
              <div>
                <p className="text-foreground text-sm font-medium">Tu club</p>
                <p className="text-muted-foreground text-xs">
                  Datos de contacto, horarios, servicios e imagen del club.
                </p>
              </div>
            </div>
            <Link
              href={"/dashboard/club" as Route}
              className={cn(
                buttonVariants(),
                "shrink-0 justify-center rounded-lg sm:w-auto",
              )}
            >
              Editar mi club
            </Link>
          </div>
        ) : null}
      </section>

      {clubUser && ctx.club ? (
        clubDashboard?.error || !clubDashboard?.data ? (
          <ClubDashboardError />
        ) : (
          <ClubDashboardHome range={range} data={clubDashboard.data} />
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
