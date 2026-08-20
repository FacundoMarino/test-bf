"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateTournamentMatchResultAction } from "@/actions/tournaments";
import type {
  TournamentCategory,
  TournamentMatch,
  TournamentStandingRow,
} from "@/types/tournament";

type Props = {
  clubId: string;
  tournamentId: string;
  categories: TournamentCategory[];
  allMatches: TournamentMatch[];
  standingsByCategory: Record<string, TournamentStandingRow[]>;
};

function minutesToTime(value: number | null) {
  if (value === null) return "--:--";
  const h = Math.floor(value / 60).toString().padStart(2, "0");
  const m = (value % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function pairLabel(
  registration: TournamentMatch["homeRegistration"],
  fallback = "A definir",
) {
  if (!registration) return fallback;
  return `${registration.playerProfile.fullName ?? "Jugador"} / ${registration.partnerName}`;
}

type ResultMatch = {
  id: string;
  zoneName: string;
  phase: "GROUP" | "KNOCKOUT";
  categoryId: string;
  categoryName: string;
  matchDate: string | null;
  startTimeMinutes: number | null;
  homeLabel: string;
  awayLabel: string;
  homeGames: number | null;
  awayGames: number | null;
  isNoShow: boolean;
  status: string;
  setsCount: number;
};

function collectMatches(categories: TournamentCategory[]): ResultMatch[] {
  const items: ResultMatch[] = [];
  for (const category of categories) {
    const setsCount = category.groupSets ?? 3;
    for (const zone of category.zones) {
      for (const match of zone.matches) {
        items.push({
          id: match.id,
          zoneName: zone.name,
          phase: "GROUP",
          categoryId: category.id,
          categoryName: category.name,
          matchDate: match.matchDate,
          startTimeMinutes: match.startTimeMinutes,
          homeLabel: pairLabel(match.homeRegistration),
          awayLabel: pairLabel(match.awayRegistration),
          homeGames: match.homeGames,
          awayGames: match.awayGames,
          isNoShow: match.isNoShow,
          status: match.status,
          setsCount,
        });
      }
    }
  }
  return items.sort((a, b) => {
    const dateA = a.matchDate ?? "9999-12-31";
    const dateB = b.matchDate ?? "9999-12-31";
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    return (a.startTimeMinutes ?? 0) - (b.startTimeMinutes ?? 0);
  });
}

function MatchResultCard({
  match,
  onSave,
  isSaving,
}: {
  match: ResultMatch;
  onSave: (matchId: string, homeGames: number, awayGames: number, isNoShow: boolean, noShowSide: number) => void;
  isSaving: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm">
      <header className="flex items-center justify-between bg-[#F8F9FB] px-5 py-2">
        <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-3.5 text-primary" />
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            {match.zoneName}
          </span>
        </p>
        <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {match.matchDate
            ? `${match.matchDate.slice(0, 10)} · ${minutesToTime(match.startTimeMinutes)}`
            : "Sin fecha"}
        </p>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const homeGames = Number(formData.get("homeGames") ?? 0);
          const awayGames = Number(formData.get("awayGames") ?? 0);
          const woValue = Number(formData.get("wo") ?? 0);
          onSave(match.id, homeGames, awayGames, woValue > 0, woValue);
        }}
      >
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4">
          {/* Home row */}
          <div className="flex items-center gap-3 border-b border-border/50 px-5 py-3">
            <span className="size-2.5 shrink-0 rounded-full bg-primary" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {match.homeLabel}
            </span>
          </div>
          <div className="flex items-end gap-2 border-b border-border/50 py-3">
            {Array.from({ length: match.setsCount }).map((_, i) => (
              <div key={i} className="text-center">
                <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                  Set {i + 1}
                </p>
                <input
                  name={i === 0 ? "homeGames" : undefined}
                  type="number"
                  min={0}
                  defaultValue={i === 0 ? (match.homeGames ?? "") : ""}
                  className="border-input bg-muted/20 h-9 w-11 rounded-lg border text-center text-sm"
                />
              </div>
            ))}
          </div>
          <div className="row-span-2 flex items-center border-b-0 px-2">
            <select
              name="wo"
              defaultValue={match.isNoShow ? "1" : "0"}
              className="border-input bg-background h-9 w-56 rounded-lg border px-2 text-xs"
            >
              <option value="0">Sin WO</option>
              <option value="1">WO: no se presentó la pareja 1</option>
              <option value="2">WO: no se presentó la pareja 2</option>
            </select>
          </div>
          <div className="row-span-2 flex items-center pr-5">
            <button
              type="submit"
              disabled={isSaving}
              className="h-9 rounded-lg border border-border bg-background px-5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
            >
              Guardar
            </button>
          </div>

          {/* Away row */}
          <div className="flex items-center gap-3 px-5 py-3">
            <span className="size-2.5 shrink-0 rounded-full bg-muted-foreground/40" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {match.awayLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 py-3">
            {Array.from({ length: match.setsCount }).map((_, i) => (
              <div key={i} className="text-center">
                <input
                  name={i === 0 ? "awayGames" : undefined}
                  type="number"
                  min={0}
                  defaultValue={i === 0 ? (match.awayGames ?? "") : ""}
                  className="border-input bg-muted/20 h-9 w-11 rounded-lg border text-center text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </article>
  );
}

export function TournamentResultsBoard({
  clubId,
  tournamentId,
  categories,
  standingsByCategory,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savingMatchId, setSavingMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const resultMatches = useMemo(
    () => collectMatches(categories),
    [categories],
  );

  const phaseOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = [];
    const seen = new Set<string>();
    for (const category of categories) {
      for (const zone of [...category.zones].sort((a, b) => a.order - b.order)) {
        if (!seen.has(zone.name)) {
          seen.add(zone.name);
          options.push({ value: `zone:${zone.name}`, label: zone.name });
        }
      }
    }
    const firstRound = Math.max(1, categories[0]?.knockoutFirstRoundMatches ?? 2);
    const roundCounts: number[] = [];
    let count = firstRound;
    while (count >= 1) {
      roundCounts.push(count);
      count = Math.floor(count / 2);
    }
    const totalRounds = roundCounts.length;
    for (let i = 0; i < totalRounds; i += 1) {
      const remaining = totalRounds - i;
      let label = `Ronda ${i + 1}`;
      if (remaining === 1) label = "Final";
      else if (remaining === 2) label = "Semifinal";
      else if (remaining === 3) label = "Cuartos de final";
      else if (remaining === 4) label = "Octavos de final";
      if (!seen.has(label)) {
        seen.add(label);
        options.push({ value: `knockout:${label}`, label });
      }
    }
    return options;
  }, [categories]);

  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    for (const match of resultMatches) {
      if (match.matchDate) dates.add(match.matchDate.slice(0, 10));
    }
    return [...dates].sort();
  }, [resultMatches]);

  const filtered = useMemo(() => {
    return resultMatches.filter((match) => {
      if (filterCategory !== "all" && match.categoryId !== filterCategory)
        return false;
      if (filterPhase !== "all") {
        if (filterPhase.startsWith("zone:")) {
          const zoneName = filterPhase.slice(5);
          if (match.zoneName !== zoneName) return false;
        } else if (filterPhase.startsWith("knockout:")) {
          if (match.phase !== "KNOCKOUT") return false;
        } else if (match.phase !== filterPhase) {
          return false;
        }
      }
      if (filterDate !== "all" && match.matchDate?.slice(0, 10) !== filterDate)
        return false;
      return true;
    });
  }, [resultMatches, filterCategory, filterPhase, filterDate]);

  const saveMatch = (matchId: string, homeGames: number, awayGames: number, isNoShow: boolean, _noShowSide: number) => {
    setError(null);
    setSavingMatchId(matchId);
    startTransition(async () => {
      const result = await updateTournamentMatchResultAction(
        clubId,
        tournamentId,
        matchId,
        { homeGames, awayGames, isNoShow },
      );
      setSavingMatchId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <section className="space-y-3 p-4">
      <div className="rounded-xl border border-border/80 bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
          >
            <option value="all">Todas las fases</option>
            {phaseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="all">Todos los días</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((match) => (
            <MatchResultCard
              key={match.id}
              match={match}
              onSave={saveMatch}
              isSaving={isPending && savingMatchId === match.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No hay partidos para mostrar. Sorteá las zonas para generar el fixture.
        </div>
      )}
    </section>
  );
}
