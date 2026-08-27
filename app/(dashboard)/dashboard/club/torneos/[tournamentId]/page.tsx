import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Trophy, Users } from "lucide-react";

import {
  getClubTournamentAction,
  getTournamentStandingsAction,
} from "@/actions/tournaments";
import { TournamentWorkspace } from "@/components/tournaments/tournament-workspace";
import { apiFetch } from "@/lib/api";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { env } from "@/lib/env";
import type { TournamentCategoryStandings } from "@/types/tournament";
const tournamentStatusLabel: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  REGISTRATION_OPEN: "Inscripciones",
  REGISTRATION_CLOSED: "Inscripciones cerradas",
  IN_PROGRESS: "Jugando",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const [res, standingsResults] = await Promise.all([
    getClubTournamentAction(ctx.club.id, tournamentId),
    (async () => {
      const tournamentRes = await getClubTournamentAction(ctx.club!.id, tournamentId);
      if (!tournamentRes.ok) return [];
      return Promise.all(
        tournamentRes.data.categories.map(async (category) => ({
          categoryId: category.id,
          response: await getTournamentStandingsAction(
            ctx.club!.id,
            tournamentRes.data.id,
            category.id,
          ),
        })),
      );
    })(),
  ]);

  if (!res.ok) notFound();
  const tournament = res.data;

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const courtsRes = await apiFetch<{
    data: Array<{ id: string; name: string }>;
  }>(`/clubs/${ctx.club.id}/courts?limit=500`, {
    authToken: token,
    cache: "no-store",
  });
  const courtsBase = courtsRes.error ? [] : courtsRes.data.data;
  const courts = await Promise.all(
    courtsBase.map(async (court) => {
      const schedulesRes = await apiFetch<
        Array<{
          dayOfWeek: number;
          startTimeMinutes: number;
          endTimeMinutes: number;
          periodStart?: string | null;
          periodEnd?: string | null;
        }>
      >(`/clubs/${ctx.club!.id}/courts/${court.id}/schedules`, {
        authToken: token,
        cache: "no-store",
      });

      return {
        ...court,
        schedules: schedulesRes.error ? [] : schedulesRes.data,
      };
    }),
  );

  const standingsByCategory = new Map<string, TournamentCategoryStandings>();
  for (const entry of standingsResults) {
    if (entry.response.ok) {
      standingsByCategory.set(entry.categoryId, entry.response.data);
    }
  }
  const totalRegistrations = tournament.categories.reduce(
    (acc, category) => acc + category.registrations.length,
    0,
  );

  return (
    <div className="w-full space-y-6">
      <section className="rounded-2xl border border-border/80 bg-card px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Trophy className="size-4.5 text-primary" />
              {tournament.name}
            </h1>
            <p className="text-muted-foreground mt-1 inline-flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <Trophy className="size-3.5" />
                {tournament.categories.length} categorías
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" />
                {totalRegistrations} parejas inscriptas
              </span>
            </p>
          </div>
          <span className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium">
            {tournamentStatusLabel[tournament.status] ?? tournament.status}
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-2">
        <TournamentWorkspace
          clubId={ctx.club.id}
          ownClubName={ctx.club.name}
          tournament={tournament}
          courts={courts}
          standingsByCategory={Object.fromEntries(standingsByCategory.entries())}
        />
      </section>
    </div>
  );
}
