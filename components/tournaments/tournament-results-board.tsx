"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateTournamentMatchResultAction } from "@/actions/tournaments";
import type {
  TournamentCategory,
  TournamentMatch,
  TournamentMatchSetScore,
  TournamentMatchSetScores,
} from "@/types/tournament";

type Props = {
  clubId: string;
  tournamentId: string;
  categories: TournamentCategory[];
  allMatches: TournamentMatch[];
};

type SetDraft = {
  home: string;
  away: string;
  tiebreakHome: string;
  tiebreakAway: string;
};

type ResultPayload = {
  woSide?: number;
  sets?: Array<{
    home: number;
    away: number;
    tiebreakHome?: number;
    tiebreakAway?: number;
  }>;
  superTieBreakHome?: number;
  superTieBreakAway?: number;
};

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
  homeRegistrationId: string | null;
  awayRegistrationId: string | null;
  homeGames: number | null;
  awayGames: number | null;
  setScores: TournamentMatchSetScores | null;
  winnerRegistrationId: string | null;
  isNoShow: boolean;
  noShowSide: number | null;
  status: string;
  setsCount: number;
  useSuperTieBreak: boolean;
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

function emptySets(count: number): SetDraft[] {
  return Array.from({ length: count }, () => ({
    home: "",
    away: "",
    tiebreakHome: "",
    tiebreakAway: "",
  }));
}

function setsFromStored(
  setScores: TournamentMatchSetScores | null,
  setsCount: number,
): SetDraft[] {
  const base = emptySets(setsCount);
  if (!setScores?.sets?.length) return base;
  setScores.sets.forEach((set, index) => {
    if (index >= base.length) return;
    base[index] = {
      home: String(set.home),
      away: String(set.away),
      tiebreakHome:
        set.tiebreakHome !== undefined ? String(set.tiebreakHome) : "",
      tiebreakAway:
        set.tiebreakAway !== undefined ? String(set.tiebreakAway) : "",
    };
  });
  return base;
}

function needsTiebreak(home: string, away: string) {
  const h = Number(home);
  const a = Number(away);
  if (!Number.isFinite(h) || !Number.isFinite(a)) return false;
  return (h === 7 && a === 6) || (h === 6 && a === 7);
}

function parseOptionalInt(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function buildPayloadFromDraft(params: {
  sets: SetDraft[];
  superTieHome: string;
  superTieAway: string;
  woSide: number;
  useSuperTieBreak: boolean;
}): ResultPayload | { error: string } {
  if (params.woSide === 1 || params.woSide === 2) {
    return { woSide: params.woSide };
  }

  const sets: NonNullable<ResultPayload["sets"]> = [];
  for (const set of params.sets) {
    const home = parseOptionalInt(set.home);
    const away = parseOptionalInt(set.away);
    if (home === undefined && away === undefined) continue;
    if (home === undefined || away === undefined) {
      return { error: "Completá ambos games de cada set cargado" };
    }
    const row: TournamentMatchSetScore = { home, away };
    if (needsTiebreak(set.home, set.away)) {
      const tbHome = parseOptionalInt(set.tiebreakHome);
      const tbAway = parseOptionalInt(set.tiebreakAway);
      if (tbHome === undefined || tbAway === undefined) {
        return { error: "En 7-6 completá el tie-break debajo del set" };
      }
      row.tiebreakHome = tbHome;
      row.tiebreakAway = tbAway;
    }
    sets.push(row);
  }

  if (sets.length === 0) {
    return { error: "Cargá al menos un set antes de guardar" };
  }

  const payload: ResultPayload = { sets, woSide: 0 };
  if (params.useSuperTieBreak) {
    const stbHome = parseOptionalInt(params.superTieHome);
    const stbAway = parseOptionalInt(params.superTieAway);
    if (stbHome !== undefined || stbAway !== undefined) {
      if (stbHome === undefined || stbAway === undefined) {
        return { error: "Completá ambos puntos del super tie-break" };
      }
      payload.superTieBreakHome = stbHome;
      payload.superTieBreakAway = stbAway;
    }
  }
  return payload;
}

function getKnockoutRoundLabel(
  category: TournamentCategory,
  roundNumber: number,
) {
  const firstRound = Math.max(1, category.knockoutFirstRoundMatches ?? 2);
  const roundCounts: number[] = [];
  let count = firstRound;
  while (count >= 1) {
    roundCounts.push(count);
    count = Math.floor(count / 2);
  }
  const totalRounds = roundCounts.length;
  const index = Math.max(0, Math.min(totalRounds - 1, roundNumber - 1));
  const remaining = totalRounds - index;
  if (remaining === 1) return "Final";
  if (remaining === 2) return "Semifinal";
  if (remaining === 3) return "Cuartos de final";
  if (remaining === 4) return "Octavos de final";
  return `Ronda ${roundNumber}`;
}

function collectMatches(
  categories: TournamentCategory[],
  allMatches: TournamentMatch[],
): ResultMatch[] {
  const items: ResultMatch[] = [];
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const zoneMatchIds = new Set<string>();

  for (const category of categories) {
    for (const zone of category.zones) {
      for (const match of zone.matches) {
        zoneMatchIds.add(match.id);
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
          homeRegistrationId: match.homeRegistration?.id ?? null,
          awayRegistrationId: match.awayRegistration?.id ?? null,
          homeGames: match.homeGames,
          awayGames: match.awayGames,
          setScores: match.setScores ?? null,
          winnerRegistrationId: match.winnerRegistrationId ?? null,
          isNoShow: match.isNoShow,
          noShowSide: match.noShowSide ?? null,
          status: match.status,
          // Con Super Tie: solo Set 1 + Set 2 (+ columna Super Tie).
          setsCount: category.groupSuperTieBreak
            ? 2
            : (category.groupSets ?? 3),
          useSuperTieBreak: category.groupSuperTieBreak,
        });
      }
    }
  }

  for (const match of allMatches) {
    if (match.phase !== "KNOCKOUT" || zoneMatchIds.has(match.id)) continue;
    const category = categoryById.get(match.categoryId);
    if (!category) continue;
    items.push({
      id: match.id,
      zoneName: getKnockoutRoundLabel(category, match.roundNumber),
      phase: "KNOCKOUT",
      categoryId: category.id,
      categoryName: category.name,
      matchDate: match.matchDate,
      startTimeMinutes: match.startTimeMinutes,
      homeLabel: pairLabel(match.homeRegistration),
      awayLabel: pairLabel(match.awayRegistration),
      homeRegistrationId: match.homeRegistration?.id ?? null,
      awayRegistrationId: match.awayRegistration?.id ?? null,
      homeGames: match.homeGames,
      awayGames: match.awayGames,
      setScores: match.setScores ?? null,
      winnerRegistrationId: match.winnerRegistrationId ?? null,
      isNoShow: match.isNoShow,
      noShowSide: match.noShowSide ?? null,
      status: match.status,
      setsCount: category.knockoutSuperTieBreak
        ? 2
        : (category.knockoutSets ?? 3),
      useSuperTieBreak: category.knockoutSuperTieBreak,
    });
  }

  return items.sort((a, b) => {
    const dateA = a.matchDate ?? "9999-12-31";
    const dateB = b.matchDate ?? "9999-12-31";
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    return (a.startTimeMinutes ?? 0) - (b.startTimeMinutes ?? 0);
  });
}

function WinnerDot({ isWinner }: { isWinner: boolean }) {
  return (
    <span
      className={`size-2.5 shrink-0 rounded-full border ${
        isWinner
          ? "border-primary bg-primary"
          : "border-muted-foreground/25 bg-transparent"
      }`}
      aria-hidden
    />
  );
}

function MatchResultCard({
  match,
  onSave,
  isSaving,
}: {
  match: ResultMatch;
  onSave: (matchId: string, payload: ResultPayload) => void;
  isSaving: boolean;
}) {
  const finished = match.status === "FINISHED";
  const [sets, setSets] = useState<SetDraft[]>(() =>
    setsFromStored(match.setScores, match.setsCount),
  );
  const [superTieHome, setSuperTieHome] = useState(
    () =>
      match.setScores?.superTieBreak
        ? String(match.setScores.superTieBreak.home)
        : "",
  );
  const [superTieAway, setSuperTieAway] = useState(
    () =>
      match.setScores?.superTieBreak
        ? String(match.setScores.superTieBreak.away)
        : "",
  );
  const [woSide, setWoSide] = useState(
    () => match.noShowSide ?? (match.isNoShow ? 1 : 0),
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const homeIsWinner =
    finished &&
    match.winnerRegistrationId != null &&
    match.winnerRegistrationId === match.homeRegistrationId;
  const awayIsWinner =
    finished &&
    match.winnerRegistrationId != null &&
    match.winnerRegistrationId === match.awayRegistrationId;

  const showTiebreakRow = sets.some((set) => needsTiebreak(set.home, set.away));
  const showSuperTie = match.useSuperTieBreak;

  const updateSet = (
    index: number,
    side: "home" | "away" | "tiebreakHome" | "tiebreakAway",
    value: string,
  ) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, [side]: value } : set)),
    );
  };

  const applyWo = (side: number) => {
    setWoSide(side);
    setLocalError(null);
    if (side === 1) {
      setSets(
        emptySets(match.setsCount).map((set, i) =>
          i < 2 ? { ...set, home: "0", away: "6" } : set,
        ),
      );
      setSuperTieHome("");
      setSuperTieAway("");
      return;
    }
    if (side === 2) {
      setSets(
        emptySets(match.setsCount).map((set, i) =>
          i < 2 ? { ...set, home: "6", away: "0" } : set,
        ),
      );
      setSuperTieHome("");
      setSuperTieAway("");
      return;
    }
  };

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

      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-start gap-x-4">
        <div className="flex items-center gap-3 border-b border-border/50 px-5 py-3">
          <WinnerDot isWinner={homeIsWinner} />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {match.homeLabel}
          </span>
        </div>

        <div className="flex items-end gap-2 border-b border-border/50 py-3">
          {sets.map((set, i) => (
            <div key={`home-set-${i}`} className="text-center">
              <p className="mb-1 text-[10px] font-medium text-muted-foreground">
                Set {i + 1}
              </p>
              <input
                type="number"
                min={0}
                value={set.home}
                disabled={woSide > 0 || isSaving}
                onChange={(e) => updateSet(i, "home", e.target.value)}
                className="border-input bg-muted/20 h-9 w-11 rounded-lg border text-center text-sm disabled:opacity-60"
              />
            </div>
          ))}
          {showSuperTie ? (
            <div className="text-center">
              <p className="mb-1 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                Super Tie
              </p>
              <input
                type="number"
                min={0}
                value={superTieHome}
                disabled={woSide > 0 || isSaving}
                onChange={(e) => setSuperTieHome(e.target.value)}
                className="border-input bg-muted/20 h-9 w-11 rounded-lg border text-center text-sm disabled:opacity-60"
              />
            </div>
          ) : null}
        </div>

        <div className="row-span-2 flex items-center self-center px-2">
          <select
            value={String(woSide)}
            disabled={isSaving}
            onChange={(e) => applyWo(Number(e.target.value))}
            className="border-input bg-background h-9 w-56 rounded-lg border px-2 text-xs"
          >
            <option value="0">Sin WO</option>
            <option value="1">WO: no se presentó la pareja 1</option>
            <option value="2">WO: no se presentó la pareja 2</option>
          </select>
        </div>

        <div className="row-span-2 flex items-center self-center pr-5">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              const payload = buildPayloadFromDraft({
                sets,
                superTieHome,
                superTieAway,
                woSide,
                useSuperTieBreak: match.useSuperTieBreak,
              });
              if ("error" in payload) {
                setLocalError(payload.error);
                return;
              }
              setLocalError(null);
              onSave(match.id, payload);
            }}
            className="h-9 rounded-lg border border-border bg-background px-5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
          >
            Guardar
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3">
          <WinnerDot isWinner={awayIsWinner} />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {match.awayLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 py-3">
          {sets.map((set, i) => (
            <div key={`away-set-${i}`} className="text-center">
              <input
                type="number"
                min={0}
                value={set.away}
                disabled={woSide > 0 || isSaving}
                onChange={(e) => updateSet(i, "away", e.target.value)}
                className="border-input bg-muted/20 h-9 w-11 rounded-lg border text-center text-sm disabled:opacity-60"
              />
            </div>
          ))}
          {showSuperTie ? (
            <div className="text-center">
              <input
                type="number"
                min={0}
                value={superTieAway}
                disabled={woSide > 0 || isSaving}
                onChange={(e) => setSuperTieAway(e.target.value)}
                className="border-input bg-muted/20 h-9 w-11 rounded-lg border text-center text-sm disabled:opacity-60"
              />
            </div>
          ) : null}
        </div>
      </div>

      {showTiebreakRow ? (
        <div className="border-t border-border/50 bg-[#FAFBFC] px-5 py-3">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">
            Tie-break (sets 7-6)
          </p>
          <div className="flex flex-wrap gap-4">
            {sets.map((set, i) =>
              needsTiebreak(set.home, set.away) ? (
                <div key={`tb-${i}`} className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Set {i + 1}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={set.tiebreakHome}
                    disabled={woSide > 0 || isSaving}
                    onChange={(e) =>
                      updateSet(i, "tiebreakHome", e.target.value)
                    }
                    className="border-input bg-background h-8 w-11 rounded-lg border text-center text-sm disabled:opacity-60"
                    aria-label={`Tie-break pareja 1 set ${i + 1}`}
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <input
                    type="number"
                    min={0}
                    value={set.tiebreakAway}
                    disabled={woSide > 0 || isSaving}
                    onChange={(e) =>
                      updateSet(i, "tiebreakAway", e.target.value)
                    }
                    className="border-input bg-background h-8 w-11 rounded-lg border text-center text-sm disabled:opacity-60"
                    aria-label={`Tie-break pareja 2 set ${i + 1}`}
                  />
                </div>
              ) : null,
            )}
          </div>
        </div>
      ) : null}

      {localError ? (
        <div className="border-t border-rose-100 bg-rose-50 px-5 py-2 text-xs text-rose-700">
          {localError}
        </div>
      ) : null}
    </article>
  );
}

export function TournamentResultsBoard({
  clubId,
  tournamentId,
  categories,
  allMatches,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savingMatchId, setSavingMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const resultMatches = useMemo(
    () => collectMatches(categories, allMatches),
    [categories, allMatches],
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

  const saveMatch = (matchId: string, payload: ResultPayload) => {
    setError(null);
    setSavingMatchId(matchId);
    startTransition(async () => {
      const result = await updateTournamentMatchResultAction(
        clubId,
        tournamentId,
        matchId,
        payload,
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
              key={`${match.id}-${match.status}-${match.winnerRegistrationId ?? "none"}-${JSON.stringify(match.setScores)}`}
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
