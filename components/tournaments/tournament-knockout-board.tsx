"use client";

import { useMemo, useState } from "react";
import { Info, Trophy } from "lucide-react";

import type { TournamentCategory, TournamentMatch } from "@/types/tournament";

type SlotSource =
  | { type: "zone-rank"; zoneName: string; rank: number }
  | { type: "winner"; ref: string };

type BracketMatch = {
  orderInRound: number;
  home: SlotSource;
  away: SlotSource;
  dbMatch?: TournamentMatch;
};

type BracketRound = {
  label: string;
  shortPrefix: string;
  matches: BracketMatch[];
};

type Props = {
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

function getRoundShortPrefix(label: string) {
  if (label === "SEMIFINAL") return "SF";
  if (label.includes("CUARTOS")) return "CF";
  if (label.includes("OCTAVOS")) return "OF";
  if (label === "FINAL") return "F";
  return "R";
}

function formatSlotLabel(source: SlotSource) {
  if (source.type === "zone-rank") {
    return `${source.rank}º ${source.zoneName}`;
  }
  return `Ganador ${source.ref}`;
}

function buildFirstRoundSlot(
  zones: TournamentCategory["zones"],
  matchIndex: number,
): { home: SlotSource; away: SlotSource } {
  const sortedZones = [...zones].sort((a, b) => a.order - b.order);
  if (!sortedZones.length) {
    return {
      home: { type: "zone-rank", zoneName: "Zona A", rank: 1 },
      away: { type: "zone-rank", zoneName: "Zona B", rank: 2 },
    };
  }

  const zoneA = sortedZones[matchIndex % sortedZones.length];
  const zoneB = sortedZones[(matchIndex + 1) % sortedZones.length];

  if (matchIndex % 2 === 0) {
    return {
      home: { type: "zone-rank", zoneName: zoneA.name, rank: 1 },
      away: { type: "zone-rank", zoneName: zoneB.name, rank: 2 },
    };
  }

  return {
    home: { type: "zone-rank", zoneName: zoneB.name, rank: 1 },
    away: { type: "zone-rank", zoneName: zoneA.name, rank: 2 },
  };
}

function buildKnockoutRounds(category: TournamentCategory): BracketRound[] {
  const firstRoundMatches = Math.max(1, category.knockoutFirstRoundMatches);
  const roundMatchCounts: number[] = [];
  let count = firstRoundMatches;
  while (count >= 1) {
    roundMatchCounts.push(count);
    count = Math.floor(count / 2);
  }

  const totalRounds = roundMatchCounts.length;
  const rounds: BracketRound[] = [];

  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
    const label = getRoundLabel(roundIndex, totalRounds);
    const shortPrefix = getRoundShortPrefix(label);
    const matchCount = roundMatchCounts[roundIndex];
    const matches: BracketMatch[] = [];

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      if (roundIndex === 0) {
        const slot = buildFirstRoundSlot(category.zones, matchIndex);
        matches.push({
          orderInRound: matchIndex + 1,
          home: slot.home,
          away: slot.away,
        });
      } else {
        const prevLabel = getRoundLabel(roundIndex - 1, totalRounds);
        const prevPrefix = getRoundShortPrefix(prevLabel);
        matches.push({
          orderInRound: matchIndex + 1,
          home: { type: "winner", ref: `${prevPrefix}${matchIndex * 2 + 1}` },
          away: { type: "winner", ref: `${prevPrefix}${matchIndex * 2 + 2}` },
        });
      }
    }

    rounds.push({ label, shortPrefix, matches });
  }

  return rounds;
}

function attachDbMatches(
  rounds: BracketRound[],
  knockoutMatches: TournamentMatch[],
): BracketRound[] {
  const byRound = new Map<number, TournamentMatch[]>();
  for (const match of knockoutMatches) {
    const bucket = byRound.get(match.roundNumber) ?? [];
    bucket.push(match);
    byRound.set(match.roundNumber, bucket);
  }

  for (const [, bucket] of byRound) {
    bucket.sort((a, b) => a.orderInRound - b.orderInRound);
  }

  return rounds.map((round, roundIndex) => ({
    ...round,
    matches: round.matches.map((match, matchIndex) => ({
      ...match,
      dbMatch: byRound.get(roundIndex + 1)?.[matchIndex],
    })),
  }));
}

function pairOptions(category: TournamentCategory) {
  return category.registrations.map((registration) => ({
    id: registration.id,
    label: `${registration.playerProfile.fullName ?? "Jugador"} / ${registration.partnerName}`,
  }));
}

function zoneRankOptions(category: TournamentCategory) {
  const zones = [...category.zones].sort((a, b) => a.order - b.order);
  const ranks = Math.max(1, category.groupQualifiers ?? 2);
  const options: Array<{ value: string; label: string }> = [];
  for (const zone of zones) {
    for (let rank = 1; rank <= ranks; rank += 1) {
      const label = `${rank}º ${zone.name}`;
      options.push({ value: `zone:${zone.id}:${rank}`, label });
    }
  }
  return options;
}

function MatchSlot({
  source,
  isFirstRound,
  zoneOptions,
  pairOptions: pairs,
}: {
  source: SlotSource;
  isFirstRound: boolean;
  zoneOptions: Array<{ value: string; label: string }>;
  pairOptions: Array<{ id: string; label: string }>;
}) {
  const label = formatSlotLabel(source);
  const defaultValue = isFirstRound
    ? (zoneOptions.find((option) => option.label === label)?.value ?? label)
    : "__prev_winner__";

  return (
    <div className="space-y-1">
      <p className="text-[12px] font-semibold leading-none text-foreground">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <select
          className="border-muted-foreground/35 text-foreground h-9 min-w-0 flex-1 rounded-md border border-dashed bg-white px-2.5 text-[12px] outline-none"
          defaultValue={defaultValue}
        >
          {isFirstRound ? (
            <>
              {zoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {pairs.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </>
          ) : (
            <>
              <option value="__prev_winner__">
                Ganador de la ronda anterior
              </option>
              {pairs.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <span className="text-muted-foreground/70 shrink-0 text-[11px] italic">
          {label}
        </span>
      </div>
    </div>
  );
}

function MatchCard({
  match,
  isFirstRound,
  zoneOptions,
  pairOptions: pairs,
}: {
  match: BracketMatch;
  isFirstRound: boolean;
  zoneOptions: Array<{ value: string; label: string }>;
  pairOptions: Array<{ id: string; label: string }>;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="border-b border-border/60 bg-[#F8F9FB] px-3.5 py-1.5">
        <p className="text-[10px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          Cruce #{match.orderInRound}
        </p>
      </header>
      <div className="space-y-2.5 px-3.5 py-3">
        <MatchSlot
          source={match.home}
          isFirstRound={isFirstRound}
          zoneOptions={zoneOptions}
          pairOptions={pairs}
        />
        <p className="text-center text-[11px] font-medium text-muted-foreground">
          vs
        </p>
        <MatchSlot
          source={match.away}
          isFirstRound={isFirstRound}
          zoneOptions={zoneOptions}
          pairOptions={pairs}
        />
      </div>
    </article>
  );
}

export function TournamentKnockoutBoard({
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
    const built = buildKnockoutRounds(selectedCategory);
    return attachDbMatches(built, categoryKnockoutMatches);
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
    <section className="space-y-4 p-4">
      <div className="rounded-xl border border-border/80 border-l-4 border-l-primary bg-card px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border-input bg-background h-10 min-w-52 rounded-lg border px-3 text-sm"
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
                      key={`${round.label}-${match.orderInRound}`}
                      match={match}
                      isFirstRound={roundIndex === 0}
                      zoneOptions={zoneOptions}
                      pairOptions={options}
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
        En la primera ronda elegí el clasificado de cada zona (1º, 2º, 3º...) o
        una pareja manualmente. En las rondas siguientes viene por defecto el
        ganador de la ronda anterior según los resultados cargados, y también
        podés elegir una pareja manualmente.
      </p>
    </section>
  );
}
