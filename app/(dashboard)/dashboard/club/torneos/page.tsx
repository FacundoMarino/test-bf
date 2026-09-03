import { redirect } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, Eye, Pencil, Users, Trophy } from "lucide-react";

import { listClubTournamentsAction } from "@/actions/tournaments";
import { TournamentDateRange } from "@/components/tournaments/tournament-date-range";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import type { TournamentRecord } from "@/types/tournament";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Borrador",
    PUBLISHED: "Publicado",
    REGISTRATION_OPEN: "Inscripciones",
    REGISTRATION_CLOSED: "Inscripciones cerradas",
    IN_PROGRESS: "Jugando",
    FINISHED: "Finalizado",
    CANCELLED: "Cancelado",
  };
  return labels[status] ?? status;
}

function occupiedPairs(tournament: TournamentRecord) {
  return tournament.categories.reduce(
    (acc, category) => acc + category.occupiedPairs,
    0,
  );
}

function TournamentActions({
  tournamentId,
  compact = false,
}: {
  tournamentId: string;
  compact?: boolean;
}) {
  const href = `/dashboard/club/torneos/${tournamentId}` as Route;
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2">
        <Link
          href={href}
          className="rounded-md border border-border p-1.5 hover:bg-muted"
          title="Ver"
        >
          <Eye className="size-3.5" />
        </Link>
        <Link
          href={href}
          className="rounded-md border border-border p-1.5 hover:bg-muted"
          title="Editar"
        >
          <Pencil className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#788ce3] px-4 text-sm font-semibold text-white hover:bg-[#405fd3]"
    >
      <Pencil className="size-3.5" />
      Editar
    </Link>
  );
}

export default async function ClubTournamentsPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const res = await listClubTournamentsAction(ctx.club.id);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Trophy className="size-5" />
            Torneos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona los torneos de tu club
          </p>
        </div>
        <Link
          href="/dashboard/club/torneos/nuevo"
          className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-lg bg-[#788ce3] px-4 text-sm font-semibold text-white hover:bg-[#405fd3] sm:h-9 sm:w-auto"
        >
          + Nuevo torneo
        </Link>
      </div>

      {!res.ok ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {res.error}
        </div>
      ) : res.data.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Aún no hay torneos creados.
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {res.data.map((tournament) => (
              <article
                key={tournament.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-base font-semibold leading-snug">
                    {tournament.name}
                  </p>
                  <span className="shrink-0 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-xs">
                    {statusLabel(tournament.status)}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 flex items-start gap-1.5 text-xs">
                  <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    <TournamentDateRange
                      startsAt={tournament.startsAt}
                      endsAt={tournament.endsAt}
                    />
                  </span>
                </p>
                <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Trophy className="size-3.5" />
                    {tournament.categories.length} categorías
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" />
                    {occupiedPairs(tournament)} parejas
                  </span>
                </div>
                <div className="mt-3">
                  <TournamentActions tournamentId={tournament.id} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Torneo
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Fechas
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Categorías
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Parejas
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {res.data.map((tournament) => (
                    <tr key={tournament.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <p className="font-medium">{tournament.name}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="size-3.5 text-muted-foreground" />
                          <TournamentDateRange
                            startsAt={tournament.startsAt}
                            endsAt={tournament.endsAt}
                          />
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {tournament.categories.length}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3.5 text-muted-foreground" />
                          {occupiedPairs(tournament)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5">
                          {statusLabel(tournament.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <TournamentActions
                          tournamentId={tournament.id}
                          compact
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
