"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, Trophy } from "lucide-react";

import { updateKnockoutMatchSlotAction } from "@/actions/tournaments";
import type {
  TournamentCategory,
  TournamentMatch,
  TournamentRegistration,
} from "@/types/tournament";

type BracketRound = {
  label: string;
  roundNumber: number;
  matches: TournamentMatch[];
};

type Props = {
  clubId: string;
  tournamentId: string;
  categories: TournamentCategory[];
  knockoutMatches: TournamentMatch[];
};

function getRoundLabel(roundIndex: number, totalRounds: number) {
  const remaining = totalRounds - roundIndex;
  if (remaining === 1) return "FINAL";
  if (remaining === 2) return "SEMIFINAL";
  if (remaining === 3) return "CUARTOS DE FINAL";
  if (remaining === 4) return "OCTAVOS DE FINAL";
  return `RONDA ${roundIndex + 1}`;
}

function formatPairLabel(
  registration: TournamentRegistration | null | undefined,
) {
  if (!registration) return "—";
  const player = registration.playerProfile.fullName ?? "Jugador";
  return `${player} / ${registration.partnerName}`;
}

function zoneRankOptions(category: TournamentCategory) {
  const zones = [...category.zones].sort((a, b) => a.order - b.order);
  const ranks = Math.max(1, category.groupQualifiers ?? 2);
  const options: Array<{
    value: string;
    label: string;
    zoneId: string;
    rank: number;
  }> = [];
  for (const zone of zones) {
    for (let rank = 1; rank <= ranks; rank += 1) {
      options.push({
        value: `zone:${zone.id}:${rank}`,
        label: `${rank}° ${zone.name}`,
        zoneId: zone.id,
        rank,
      });
    }
  }
  return options;
}

function pairOptions(category: TournamentCategory) {
  return category.registrations.map((registration) => ({
    id: registration.id,
    label: formatPairLabel(registration),
  }));
}

function buildKnockoutRounds(
  category: TournamentCategory,
  knockoutMatches: TournamentMatch[],
): BracketRound[] {
  const firstRoundMatches = Math.max(1, category.knockoutFirstRoundMatches);
  const roundMatchCounts: number[] = [];
  let count = firstRoundMatches;
  while (count >= 1) {
    roundMatchCounts.push(count);
    count = Math.floor(count / 2);
  }

  const byRound = new Map<number, TournamentMatch[]>();
  for (const match of knockoutMatches) {
    const bucket = byRound.get(match.roundNumber) ?? [];
    bucket.push(match);
    byRound.set(match.roundNumber, bucket);
  }
  for (const [, bucket] of byRound) {
    bucket.sort((a, b) => a.orderInRound - b.orderInRound);
  }

  return roundMatchCounts.map((matchCount, roundIndex) => ({
    label: getRoundLabel(roundIndex, roundMatchCounts.length),
    roundNumber: roundIndex + 1,
    matches: Array.from({ length: matchCount }, (_, matchIndex) => {
      return (
        byRound.get(roundIndex + 1)?.[matchIndex] ?? {
          id: `placeholder-${roundIndex + 1}-${matchIndex + 1}`,
          categoryId: category.id,
          phase: "KNOCKOUT" as const,
          roundNumber: roundIndex + 1,
          orderInRound: matchIndex + 1,
          status: "PENDING" as const,
          homeGames: null,
          awayGames: null,
          setScores: null,
          winnerRegistrationId: null,
          isNoShow: false,
          noShowSide: null,
          matchDate: null,
          startTimeMinutes: null,
          court: null,
          courtBlock: null,
          homeRegistration: null,
          awayRegistration: null,
        }
      );
    }),
  }));
}

function getSlotSelectValue(
  match: TournamentMatch,
  side: "home" | "away",
  isFirstRound: boolean,
) {
  const manual = side === "home" ? match.homeSlotManual : match.awaySlotManual;
  const bye = side === "home" ? match.homeSlotBye : match.awaySlotBye;
  const key = side === "home" ? match.homeSlotKey : match.awaySlotKey;
  const registrationId =
    side === "home" ? match.homeRegistrationId : match.awayRegistrationId;

  if (bye) return "bye";
  if (manual && registrationId) return `registration:${registrationId}`;
  if (key?.startsWith("zone:")) return key;
  if (!isFirstRound || key === "prev") return "previous";
  return "";
}

function slotSourceLabel(
  match: TournamentMatch,
  side: "home" | "away",
  isFirstRound: boolean,
  zoneOptions: ReturnType<typeof zoneRankOptions>,
) {
  const value = getSlotSelectValue(match, side, isFirstRound);
  if (value === "bye") return "BYE";
  if (value === "previous") return "Ganador de la ronda anterior";
  if (value.startsWith("zone:")) {
    return zoneOptions.find((option) => option.value === value)?.label ?? value;
  }
  if (value.startsWith("registration:")) return "Pareja manual";
  return isFirstRound ? "Clasificado de zona" : "Ganador de la ronda anterior";
}

function MatchSlot({
  match,
  side,
  isFirstRound,
  zoneOptions,
  pairs,
  clubId,
  tournamentId,
  disabled,
}: {
  match: TournamentMatch;
  side: "home" | "away";
  isFirstRound: boolean;
  zoneOptions: ReturnType<typeof zoneRankOptions>;
  pairs: ReturnType<typeof pairOptions>;
  clubId: string;
  tournamentId: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const registration =
    side === "home" ? match.homeRegistration : match.awayRegistration;
  const isBye = side === "home" ? match.homeSlotBye : match.awaySlotBye;
  const selectValue = getSlotSelectValue(match, side, isFirstRound);
  const advances =
    Boolean(match.winnerRegistrationId) &&
    match.winnerRegistrationId ===
      (side === "home" ? match.homeRegistrationId : match.awayRegistrationId);

  const handleChange = (rawValue: string) => {
    if (!match.id || match.id.startsWith("placeholder-") || disabled) return;
    setError(null);

    const payload =
      rawValue === "bye"
        ? { side, source: "bye" as const }
        : rawValue === "previous"
          ? { side, source: "previous" as const }
          : rawValue.startsWith("zone:")
            ? (() => {
                const [, zoneId, rankRaw] = rawValue.split(":");
                return {
                  side,
                  source: "zone-rank" as const,
                  zoneId,
                  rank: Number(rankRaw),
                };
              })()
            : rawValue.startsWith("registration:")
              ? {
                  side,
                  source: "registration" as const,
                  registrationId: rawValue.replace("registration:", ""),
                }
              : null;

    if (!payload) return;

    startTransition(async () => {
      const result = await updateKnockoutMatchSlotAction(
        clubId,
        tournamentId,
        match.id,
        payload,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <p
          className={`text-[12px] font-semibold leading-snug ${
            advances
              ? "text-primary underline decoration-primary/70"
              : "text-foreground"
          }`}
        >
          {isBye ? "—" : formatPairLabel(registration)}
        </p>
        {advances ? (
          <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase">
            pasa
          </span>
        ) : null}
      </div>
      <select
        className="border-muted-foreground/35 text-foreground h-9 w-full rounded-md border border-dashed bg-white px-2.5 text-[12px] outline-none disabled:opacity-60"
        value={selectValue}
        disabled={disabled || isPending || match.id.startsWith("placeholder-")}
        onChange={(event) => handleChange(event.target.value)}
      >
        {isFirstRound ? (
          <>
            <option value="" disabled>
              Elegí origen del slot
            </option>
            {zoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="bye">BYE</option>
            {pairs.map((option) => (
              <option key={option.id} value={`registration:${option.id}`}>
                {option.label}
              </option>
            ))}
          </>
        ) : (
          <>
            <option value="previous">Ganador de la ronda anterior</option>
            <option value="bye">BYE</option>
            {pairs.map((option) => (
              <option key={option.id} value={`registration:${option.id}`}>
                {option.label}
              </option>
            ))}
          </>
        )}
      </select>
      <p className="text-muted-foreground text-[11px]">
        {slotSourceLabel(match, side, isFirstRound, zoneOptions)}
      </p>
      {error ? <p className="text-destructive text-[11px]">{error}</p> : null}
    </div>
  );
}

function MatchCard({
  match,
  isFirstRound,
  zoneOptions,
  pairs,
  clubId,
  tournamentId,
}: {
  match: TournamentMatch;
  isFirstRound: boolean;
  zoneOptions: ReturnType<typeof zoneRankOptions>;
  pairs: ReturnType<typeof pairOptions>;
  clubId: string;
  tournamentId: string;
}) {
  const disabled = match.status === "FINISHED";

  return (
    <article className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="border-b border-border/60 bg-[#F8F9FB] px-3.5 py-1.5">
        <p className="text-[10px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          Cruce #{match.orderInRound}
        </p>
      </header>
      <div className="space-y-2.5 px-3.5 py-3">
        <MatchSlot
          match={match}
          side="home"
          isFirstRound={isFirstRound}
          zoneOptions={zoneOptions}
          pairs={pairs}
          clubId={clubId}
          tournamentId={tournamentId}
          disabled={disabled}
        />
        <p className="text-center text-[11px] font-medium text-muted-foreground">
          vs
        </p>
        <MatchSlot
          match={match}
          side="away"
          isFirstRound={isFirstRound}
          zoneOptions={zoneOptions}
          pairs={pairs}
          clubId={clubId}
          tournamentId={tournamentId}
          disabled={disabled}
        />
      </div>
    </article>
  );
}

export function TournamentKnockoutBoard({
  clubId,
  tournamentId,
  categories,
  knockoutMatches,
}: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const categoryKnockoutMatches = useMemo(
    () =>
      knockoutMatches.filter(
        (match) => match.categoryId === selectedCategoryId,
      ),
    [knockoutMatches, selectedCategoryId],
  );

  const rounds = useMemo(() => {
    if (!selectedCategory) return [];
    return buildKnockoutRounds(selectedCategory, categoryKnockoutMatches);
  }, [selectedCategory, categoryKnockoutMatches]);

  const options = useMemo(
    () => (selectedCategory ? pairOptions(selectedCategory) : []),
    [selectedCategory],
  );

  const zoneOptions = useMemo(
    () => (selectedCategory ? zoneRankOptions(selectedCategory) : []),
    [selectedCategory],
  );

  if (!categories.length) return null;

  return (
    <section className="min-w-0 space-y-4 p-3 sm:p-4">
      <div className="rounded-xl border border-border/80 border-l-4 border-l-primary bg-card px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border-input bg-background h-10 w-full min-w-0 rounded-lg border px-3 text-sm sm:w-auto"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <Trophy className="size-3.5 text-muted-foreground" />
            {selectedCategory?.registrations.length ?? 0} parejas en esta
            categoría
          </span>
        </div>
      </div>

      {selectedCategory?.zones.length ? (
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max items-stretch gap-5">
            {rounds.map((round, roundIndex) => (
              <section
                key={round.label}
                className="flex w-[17.5rem] shrink-0 flex-col"
              >
                <header className="mb-3 flex items-baseline justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-primary uppercase">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {round.label}
                  </p>
                  <span className="text-muted-foreground text-[11px]">
                    {round.matches.length} partidos
                  </span>
                </header>
                <div
                  className={`flex flex-1 flex-col gap-3 ${
                    roundIndex > 0 ? "justify-center" : ""
                  }`}
                >
                  {round.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      isFirstRound={roundIndex === 0}
                      zoneOptions={zoneOptions}
                      pairs={options}
                      clubId={clubId}
                      tournamentId={tournamentId}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          Todavía no hay zonas sorteadas. Andá a Sorteo y generá el cuadro de
          grupos primero.
        </div>
      )}

      <p className="text-muted-foreground inline-flex max-w-4xl items-start gap-2 text-xs leading-relaxed">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
        En la primera ronda elegí el clasificado de cada zona (1°, 2°, 3°...) o
        una pareja manualmente. En las rondas siguientes viene por defecto el
        ganador de la ronda anterior según los resultados cargados, y también
        podés elegir una pareja manualmente.
      </p>
    </section>
  );
}
