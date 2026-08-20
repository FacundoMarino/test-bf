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
    return `${source.rank}° ${source.zoneName}`;
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

function MatchSlot({
  source,
  isFirstRound,
  pairOptions: options,
}: {
  source: SlotSource;
  isFirstRound: boolean;
  pairOptions: Array<{ id: string; label: string }>;
}) {
  const label = formatSlotLabel(source);

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      {isFirstRound ? (
        <div className="grid grid-cols-2 gap-2">
          <select
            className="border-input bg-background h-9 w-full rounded-lg border px-2 text-xs"
            defaultValue={label}
          >
            <option value={label}>{label}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <select className="border-input bg-background h-9 w-full rounded-lg border px-2 text-xs">
            <option>Automático</option>
            <option>Manual</option>
          </select>
        </div>
      ) : (
        <select className="border-input bg-background h-9 w-full rounded-lg border px-2 text-xs">
          <option>Automático</option>
          <option>Manual</option>
        </select>
      )}
    </div>
  );
}

function MatchCard({
  match,
  isFirstRound,
  pairOptions: options,
}: {
  match: BracketMatch;
  isFirstRound: boolean;
  pairOptions: Array<{ id: string; label: string }>;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <header className="border-b border-border/70 bg-muted/20 px-3 py-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Cruce #{match.orderInRound}
        </p>
      </header>
      <div className="space-y-2 px-3 py-3">
        <MatchSlot
          source={match.home}
          isFirstRound={isFirstRound}
          pairOptions={options}
        />
        <p className="text-center text-[11px] font-medium text-muted-foreground">vs</p>
        <MatchSlot
          source={match.away}
          isFirstRound={isFirstRound}
          pairOptions={options}
        />
        <select className="border-input bg-background mt-1 h-9 w-full rounded-lg border px-2 text-xs">
          <option>Ganador automático (por resultado)</option>
          <option>Manual</option>
        </select>
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

  if (!categories.length) return null;

  return (
    <section className="space-y-3 p-4">
      <div className="rounded-xl border border-border/80 bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
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
            <Trophy className="size-3.5" />
            {selectedCategory?.registrations.length ?? 0} parejas en esta categoría
          </span>
        </div>
      </div>

      {selectedCategory?.zones.length ? (
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max items-stretch gap-4">
            {rounds.map((round, roundIndex) => (
              <section key={round.label} className="flex w-72 shrink-0 flex-col">
                <header className="mb-3 flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold uppercase text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {round.label}
                  </p>
                  <span className="text-muted-foreground text-[11px]">
                    {round.matches.length}{" "}
                    {round.matches.length === 1 ? "partido" : "partidos"}
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

      <p className="text-muted-foreground inline-flex items-start gap-1.5 text-xs">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
        Los cruces se completan solos con los clasificados de cada zona y con
        los ganadores cargados en Resultados. Podés corregir manualmente
        cualquier pareja o ganador.
      </p>
    </section>
  );
}
