import { redirect } from "next/navigation";
import { CalendarDays, Eye, Pencil, Users, Trophy } from "lucide-react";

import { listClubTournamentsAction } from "@/actions/tournaments";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";

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

export default async function ClubTournamentsPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const res = await listClubTournamentsAction(ctx.club.id);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Trophy className="size-5" />
            Torneos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona los torneos de tu club
          </p>
        </div>
        <a
          href="/dashboard/club/torneos/nuevo"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#788ce3] px-4 text-sm font-semibold text-white hover:bg-[#405fd3]"
        >
          + Nuevo torneo
        </a>
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
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Torneo</th>
                <th className="px-4 py-3 text-left font-semibold">Fechas</th>
                <th className="px-4 py-3 text-left font-semibold">Categorías</th>
                <th className="px-4 py-3 text-left font-semibold">Parejas</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {res.data.map((tournament) => (
                <tr key={tournament.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{tournament.name}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      {new Date(tournament.startsAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {new Date(tournament.endsAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{tournament.categories.length}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5 text-muted-foreground" />
                      {tournament.categories.reduce(
                        (acc, category) => acc + category.occupiedPairs,
                        0,
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5">
                      {statusLabel(tournament.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={`/dashboard/club/torneos/${tournament.id}`}
                        className="rounded-md border border-border p-1.5 hover:bg-muted"
                        title="Ver"
                      >
                        <Eye className="size-3.5" />
                      </a>
                      <a
                        href={`/dashboard/club/torneos/${tournament.id}`}
                        className="rounded-md border border-border p-1.5 hover:bg-muted"
                        title="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
