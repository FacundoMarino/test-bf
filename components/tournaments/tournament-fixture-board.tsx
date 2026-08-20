"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Info,
  MapPin,
  Pencil,
  Trophy,
} from "lucide-react";

import type { TournamentCategory, TournamentMatch } from "@/types/tournament";

type FixtureView = "day" | "court";

type FixtureMatch = {
  id: string;
  categoryName: string;
  phase: "GROUP" | "KNOCKOUT";
  stageLabel: string;
  isRoundWindow: boolean;
  matchDate: string | null;
  startTimeMinutes: number | null;
  courtName: string | null;
  homeLabel: string;
  awayLabel: string;
};

type Props = {
  categories: TournamentCategory[];
  matches: TournamentMatch[];
};

function minutesToTime(value: number | null) {
  if (value === null) return "--:--";
  const h = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const m = (value % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function formatIsoDate(value: string | null) {
  if (!value) return "Sin fecha";
  return value.slice(0, 10);
}

function formatFixtureDayHeading(value: string) {
  const formatted = new Date(`${value}T12:00:00`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return formatted.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

function pairLabel(
  registration: TournamentMatch["homeRegistration"],
  fallback = "A definir",
) {
  if (!registration) return fallback;
  return `${registration.playerProfile.fullName ?? "Jugador"} / ${registration.partnerName}`;
}

function getKnockoutRoundMeta(category: TournamentCategory, roundNumber: number) {
  const firstRoundMatches = Math.max(1, category.knockoutFirstRoundMatches);
  const roundMatchCounts: number[] = [];
  let count = firstRoundMatches;
  while (count >= 1) {
    roundMatchCounts.push(count);
    count = Math.floor(count / 2);
  }

  const roundIndex = roundNumber - 1;
  const totalRounds = roundMatchCounts.length;
  const remaining = totalRounds - roundIndex;
  let label = `Ronda ${roundNumber}`;
  if (remaining === 1) label = "Final";
  else if (remaining === 2) label = "Semifinal";
  else if (remaining === 3) label = "Cuartos de final";
  else if (remaining === 4) label = "Octavos de final";

  return { label, roundIndex, totalRounds, roundMatchCounts };
}

function buildFirstRoundSlot(
  zones: TournamentCategory["zones"],
  matchIndex: number,
) {
  const sortedZones = [...zones].sort((a, b) => a.order - b.order);
  if (!sortedZones.length) {
    return {
      home: "1° Zona A",
      away: "2° Zona B",
    };
  }

  const zoneA = sortedZones[matchIndex % sortedZones.length];
  const zoneB = sortedZones[(matchIndex + 1) % sortedZones.length];

  if (matchIndex % 2 === 0) {
    return {
      home: `1° ${zoneA.name}`,
      away: `2° ${zoneB.name}`,
    };
  }

  return {
    home: `1° ${zoneB.name}`,
    away: `2° ${zoneA.name}`,
  };
}

function getKnockoutSlotLabels(
  category: TournamentCategory,
  roundNumber: number,
  orderInRound: number,
) {
  const { roundIndex, totalRounds, roundMatchCounts } = getKnockoutRoundMeta(
    category,
    roundNumber,
  );
  const matchIndex = orderInRound - 1;

  if (roundIndex === 0) {
    const slot = buildFirstRoundSlot(category.zones, matchIndex);
    return { home: slot.home, away: slot.away };
  }

  const prevRemaining = totalRounds - (roundIndex - 1);
  let prevPrefix = "R";
  if (prevRemaining === 2) prevPrefix = "SF";
  else if (prevRemaining === 3) prevPrefix = "CF";
  else if (prevRemaining === 4) prevPrefix = "OF";

  return {
    home: `Ganador ${prevPrefix}${matchIndex * 2 + 1}`,
    away: `Ganador ${prevPrefix}${matchIndex * 2 + 2}`,
  };
}

function collectFixtureMatches(
  categories: TournamentCategory[],
  allMatches: TournamentMatch[],
): FixtureMatch[] {
  const items: FixtureMatch[] = [];
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const zoneMatchIds = new Set<string>();

  for (const category of categories) {
    for (const zone of category.zones) {
      for (const match of zone.matches) {
        zoneMatchIds.add(match.id);
        items.push({
          id: match.id,
          categoryName: category.name,
          phase: "GROUP",
          stageLabel: zone.name,
          isRoundWindow: false,
          matchDate: match.matchDate,
          startTimeMinutes: match.startTimeMinutes,
          courtName: match.court?.name ?? null,
          homeLabel: pairLabel(match.homeRegistration),
          awayLabel: pairLabel(match.awayRegistration),
        });
      }
    }
  }

  for (const match of allMatches) {
    if (match.phase !== "KNOCKOUT" || zoneMatchIds.has(match.id)) continue;
    const category = categoryById.get(match.categoryId);
    if (!category) continue;

    const { label } = getKnockoutRoundMeta(category, match.roundNumber);
    const slots = getKnockoutSlotLabels(
      category,
      match.roundNumber,
      match.orderInRound,
    );

    items.push({
      id: match.id,
      categoryName: category.name,
      phase: "KNOCKOUT",
      stageLabel: label,
      isRoundWindow: true,
      matchDate: match.matchDate,
      startTimeMinutes: match.startTimeMinutes,
      courtName: match.court?.name ?? null,
      homeLabel: match.homeRegistration
        ? pairLabel(match.homeRegistration)
        : slots.home,
      awayLabel: match.awayRegistration
        ? pairLabel(match.awayRegistration)
        : slots.away,
    });
  }

  return items.sort((a, b) => {
    const dateA = a.matchDate ?? "9999-12-31";
    const dateB = b.matchDate ?? "9999-12-31";
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    return (a.startTimeMinutes ?? 0) - (b.startTimeMinutes ?? 0);
  });
}

function FixtureViewToggle({
  view,
  onChange,
}: {
  view: FixtureView;
  onChange: (view: FixtureView) => void;
}) {
  return (
    <div className="rounded-xl border border-border/80 border-l-4 border-l-primary bg-card px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-full border border-border/80 bg-background p-1">
          <button
            type="button"
            onClick={() => onChange("day")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              view === "day"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/80 hover:text-foreground"
            }`}
          >
            <CalendarDays
              className={`size-4 ${view === "day" ? "text-primary-foreground" : "text-foreground/70"}`}
            />
            Por día
          </button>
          <button
            type="button"
            onClick={() => onChange("court")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              view === "court"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/80 hover:text-foreground"
            }`}
          >
            <MapPin
              className={`size-4 ${view === "court" ? "text-primary-foreground" : "text-foreground/70"}`}
            />
            Por cancha
          </button>
        </div>
        <p className="text-muted-foreground inline-flex items-center gap-2 text-xs leading-snug">
          <Info className="size-4 shrink-0 text-primary" />
          Cada partido programado bloquea el turno en el Calendario del club
          como tipo Torneo.
        </p>
      </div>
    </div>
  );
}

function MatchBadges({ match }: { match: FixtureMatch }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
        <Trophy className="size-3 shrink-0" />
        {match.categoryName}
      </span>
      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
        {match.stageLabel}
      </span>
      {match.isRoundWindow ? (
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
          Ventana de ronda
        </span>
      ) : null}
    </div>
  );
}

function FixtureMatchRow({
  match,
  view,
}: {
  match: FixtureMatch;
  view: FixtureView;
}) {
  return (
    <article className="flex items-center gap-5 px-5 py-4">
      <div className="w-18 shrink-0">
        <p className="text-[15px] font-bold leading-none text-foreground">
          {minutesToTime(match.startTimeMinutes)}
        </p>
        <p className="text-muted-foreground mt-1.5 text-[11px] leading-none">
          {view === "day"
            ? match.courtName ?? "Sin cancha"
            : formatIsoDate(match.matchDate)}
        </p>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <MatchBadges match={match} />
        <div className="space-y-1 text-sm font-medium leading-snug text-foreground">
          <p>{match.homeLabel}</p>
          <p>{match.awayLabel}</p>
        </div>
      </div>
      <button
        type="button"
        className="text-muted-foreground/70 shrink-0 rounded-md p-1.5 hover:bg-muted/60 hover:text-foreground"
        aria-label="Editar partido"
      >
        <Pencil className="size-4" />
      </button>
    </article>
  );
}

function GroupSection({
  title,
  icon: Icon,
  countLabel,
  matches,
  view,
}: {
  title: string;
  icon: typeof CalendarDays;
  countLabel: string;
  matches: FixtureMatch[];
  view: FixtureView;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-border/60 bg-[#F8F9FB] px-5 py-3.5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-primary" />
          {title}
        </p>
        <span className="text-muted-foreground text-xs font-normal">
          {countLabel}
        </span>
      </header>
      <div className="divide-y divide-border/60">
        {matches.map((match) => (
          <FixtureMatchRow key={match.id} match={match} view={view} />
        ))}
      </div>
    </section>
  );
}

export function TournamentFixtureBoard({ categories, matches }: Props) {
  const [view, setView] = useState<FixtureView>("day");

  const fixtureMatches = useMemo(
    () => collectFixtureMatches(categories, matches),
    [categories, matches],
  );

  const groupedByDay = useMemo(() => {
    const groups = new Map<string, FixtureMatch[]>();
    for (const match of fixtureMatches) {
      const key = match.matchDate?.slice(0, 10) ?? "sin-fecha";
      const bucket = groups.get(key) ?? [];
      bucket.push(match);
      groups.set(key, bucket);
    }
    return [...groups.entries()].sort(([a], [b]) => {
      if (a === "sin-fecha") return 1;
      if (b === "sin-fecha") return -1;
      return a.localeCompare(b);
    });
  }, [fixtureMatches]);

  const groupedByCourt = useMemo(() => {
    const groups = new Map<string, FixtureMatch[]>();
    for (const match of fixtureMatches) {
      const key = match.courtName ?? "Sin cancha";
      const bucket = groups.get(key) ?? [];
      bucket.push(match);
      groups.set(key, bucket);
    }
    return [...groups.entries()].sort(([a], [b]) => {
      if (a === "Sin cancha") return 1;
      if (b === "Sin cancha") return -1;
      return a.localeCompare(b, "es");
    });
  }, [fixtureMatches]);

  return (
    <section className="space-y-3 p-4">
      <FixtureViewToggle view={view} onChange={setView} />

      {fixtureMatches.length ? (
        view === "day" ? (
          <div className="space-y-3">
            {groupedByDay.map(([dayKey, dayMatches]) => (
              <GroupSection
                key={dayKey}
                title={
                  dayKey === "sin-fecha"
                    ? "Sin fecha"
                    : formatFixtureDayHeading(dayKey)
                }
                icon={CalendarDays}
                countLabel={`${dayMatches.length} ${
                  dayMatches.length === 1 ? "partido" : "partidos"
                }`}
                matches={dayMatches}
                view="day"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {groupedByCourt.map(([courtName, courtMatches]) => (
              <GroupSection
                key={courtName}
                title={courtName}
                icon={MapPin}
                countLabel={`${courtMatches.length} ${
                  courtMatches.length === 1 ? "partido" : "partidos"
                }`}
                matches={courtMatches}
                view="court"
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          Todavía no hay partidos programados. Sorteá las zonas para generar el
          fixture de grupos.
        </div>
      )}
    </section>
  );
}
