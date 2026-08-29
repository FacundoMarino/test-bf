"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Info, MapPin, Pencil, Trophy } from "lucide-react";

import { updateTournamentMatchScheduleAction } from "@/actions/tournaments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  TournamentCategory,
  TournamentCourtBlock,
  TournamentMatch,
} from "@/types/tournament";

type FixtureView = "day" | "court";

type CourtOption = {
  id: string;
  name: string;
};

type FixtureMatch = {
  id: string;
  categoryId: string;
  categoryName: string;
  phase: "GROUP" | "KNOCKOUT";
  stageLabel: string;
  isRoundWindow: boolean;
  matchDate: string | null;
  startTimeMinutes: number | null;
  courtId: string | null;
  courtName: string | null;
  venueLabel: string | null;
  durationMin: number;
  homeLabel: string;
  awayLabel: string;
  status: TournamentMatch["status"];
};

type Props = {
  clubId: string;
  tournamentId: string;
  ownClubName: string;
  categories: TournamentCategory[];
  matches: TournamentMatch[];
  courtBlocks: TournamentCourtBlock[];
  courts: CourtOption[];
};

function hasMixedVenues(courtBlocks: TournamentCourtBlock[]) {
  const hasOwn = courtBlocks.some((block) => !block.isExternal);
  const hasExternal = courtBlocks.some((block) => block.isExternal);
  return hasOwn && hasExternal;
}

function resolveMatchCourtBlock(
  match: TournamentMatch,
  courtBlocks: TournamentCourtBlock[],
  durationMin: number,
): TournamentMatch["courtBlock"] {
  if (match.courtBlock) return match.courtBlock;
  if (!match.matchDate || match.startTimeMinutes === null) return null;

  const dateKey = match.matchDate.slice(0, 10);
  return (
    courtBlocks.find((block) => {
      if (block.date.slice(0, 10) !== dateKey) return false;
      if (match.startTimeMinutes! < block.startTimeMinutes) return false;
      if (match.startTimeMinutes! + durationMin > block.endTimeMinutes) {
        return false;
      }
      if (block.isExternal) return !match.court?.id;
      return block.court?.id === match.court?.id;
    }) ?? null
  );
}

function formatMatchVenueLabel(
  match: TournamentMatch,
  ownClubName: string,
  courtBlocks: TournamentCourtBlock[],
  durationMin: number,
  mixedVenues: boolean,
) {
  const block = resolveMatchCourtBlock(match, courtBlocks, durationMin);
  if (block?.isExternal) {
    const club = block.externalClubName?.trim();
    const court = block.externalCourtName?.trim();
    if (club && court) return `${club} · ${court}`;
    return court ?? club ?? null;
  }

  const courtName = match.court?.name ?? block?.court?.name ?? null;
  if (!courtName) return null;
  if (mixedVenues) return `${ownClubName} · ${courtName}`;
  return courtName;
}

function mapFixtureMatch(
  match: TournamentMatch,
  category: TournamentCategory,
  params: {
    phase: "GROUP" | "KNOCKOUT";
    stageLabel: string;
    isRoundWindow: boolean;
    homeLabel: string;
    awayLabel: string;
    durationMin: number;
    ownClubName: string;
    courtBlocks: TournamentCourtBlock[];
    mixedVenues: boolean;
  },
): FixtureMatch {
  const venueLabel = formatMatchVenueLabel(
    match,
    params.ownClubName,
    params.courtBlocks,
    params.durationMin,
    params.mixedVenues,
  );

  return {
    id: match.id,
    categoryId: category.id,
    categoryName: category.name,
    phase: params.phase,
    stageLabel: params.stageLabel,
    isRoundWindow: params.isRoundWindow,
    matchDate: match.matchDate,
    startTimeMinutes: match.startTimeMinutes,
    courtId: match.court?.id ?? null,
    courtName: venueLabel,
    venueLabel,
    durationMin: params.durationMin,
    homeLabel: params.homeLabel,
    awayLabel: params.awayLabel,
    status: match.status,
  };
}

function minutesToTime(value: number | null) {
  if (value === null) return "--:--";
  const h = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const m = (value % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function timeToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
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

function getKnockoutRoundMeta(
  category: TournamentCategory,
  roundNumber: number,
) {
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
  const { roundIndex, totalRounds } = getKnockoutRoundMeta(
    category,
    roundNumber,
  );
  const matchIndex = Math.max(0, orderInRound - 1);

  if (roundIndex <= 0) {
    return buildFirstRoundSlot(category.zones, matchIndex);
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
  ownClubName: string,
  courtBlocks: TournamentCourtBlock[],
): FixtureMatch[] {
  const items: FixtureMatch[] = [];
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const zoneMatchIds = new Set<string>();
  const mixedVenues = hasMixedVenues(courtBlocks);

  for (const category of categories) {
    for (const zone of category.zones) {
      for (const match of zone.matches) {
        zoneMatchIds.add(match.id);
        items.push(
          mapFixtureMatch(match, category, {
            phase: "GROUP",
            stageLabel: zone.name,
            isRoundWindow: false,
            homeLabel: pairLabel(match.homeRegistration),
            awayLabel: pairLabel(match.awayRegistration),
            durationMin: category.groupMatchDurationMin,
            ownClubName,
            courtBlocks,
            mixedVenues,
          }),
        );
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

    items.push(
      mapFixtureMatch(match, category, {
        phase: "KNOCKOUT",
        stageLabel: label,
        isRoundWindow: true,
        homeLabel: match.homeRegistration
          ? pairLabel(match.homeRegistration)
          : slots.home,
        awayLabel: match.awayRegistration
          ? pairLabel(match.awayRegistration)
          : slots.away,
        durationMin: category.knockoutMatchDurationMin,
        ownClubName,
        courtBlocks,
        mixedVenues,
      }),
    );
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
  onEdit,
}: {
  match: FixtureMatch;
  view: FixtureView;
  onEdit: (match: FixtureMatch) => void;
}) {
  const canEdit = match.status !== "FINISHED";
  return (
    <article className="flex items-center gap-5 px-5 py-4">
      <div className="w-18 shrink-0">
        <p className="text-[15px] font-bold leading-none text-foreground">
          {minutesToTime(match.startTimeMinutes)}
        </p>
        <p className="text-muted-foreground mt-1.5 text-[11px] leading-none">
          {view === "day"
            ? (match.venueLabel ?? "Sin cancha")
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
        disabled={!canEdit}
        onClick={() => onEdit(match)}
        className="text-muted-foreground/70 shrink-0 rounded-md p-1.5 hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
  onEdit,
}: {
  title: string;
  icon: typeof CalendarDays;
  countLabel: string;
  matches: FixtureMatch[];
  view: FixtureView;
  onEdit: (match: FixtureMatch) => void;
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
          <FixtureMatchRow
            key={match.id}
            match={match}
            view={view}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}

export function TournamentFixtureBoard({
  clubId,
  tournamentId,
  ownClubName,
  categories,
  matches,
  courtBlocks,
  courts,
}: Props) {
  const router = useRouter();
  const [view, setView] = useState<FixtureView>("day");
  const [editing, setEditing] = useState<FixtureMatch | null>(null);
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [courtId, setCourtId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fixtureMatches = useMemo(
    () => collectFixtureMatches(categories, matches, ownClubName, courtBlocks),
    [categories, matches, ownClubName, courtBlocks],
  );

  const courtOptions = useMemo(() => {
    const map = new Map(courts.map((court) => [court.id, court]));
    for (const match of fixtureMatches) {
      if (match.courtId && match.courtName && !map.has(match.courtId)) {
        map.set(match.courtId, { id: match.courtId, name: match.courtName });
      }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [courts, fixtureMatches]);

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
      const key = match.venueLabel ?? "Sin cancha";
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

  const openEdit = (match: FixtureMatch) => {
    setEditing(match);
    setDateValue(match.matchDate?.slice(0, 10) ?? "");
    setTimeValue(
      match.startTimeMinutes !== null
        ? minutesToTime(match.startTimeMinutes)
        : "",
    );
    setCourtId(match.courtId ?? "");
    setError(null);
  };

  const saveSchedule = () => {
    if (!editing) return;
    setError(null);
    const startTimeMinutes = timeToMinutes(timeValue);
    if (!dateValue || startTimeMinutes === null) {
      setError("Completá fecha y hora.");
      return;
    }
    if (!courtId) {
      setError("Seleccioná una cancha.");
      return;
    }

    startTransition(async () => {
      const result = await updateTournamentMatchScheduleAction(
        clubId,
        tournamentId,
        editing.id,
        {
          matchDate: dateValue,
          startTimeMinutes,
          courtId,
        },
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  };

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
                onEdit={openEdit}
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
                onEdit={openEdit}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Todavía no hay partidos programados. Generá el sorteo para armar el
          fixture de grupos.
        </div>
      )}

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar partido</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-sm">
                <p className="font-medium text-foreground">
                  {editing.homeLabel}
                </p>
                <p className="text-muted-foreground">{editing.awayLabel}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {editing.categoryName} · {editing.stageLabel} ·{" "}
                  {editing.durationMin} min
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fixture-match-date">Fecha</Label>
                  <Input
                    id="fixture-match-date"
                    type="date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fixture-match-time">Hora</Label>
                  <Input
                    id="fixture-match-time"
                    type="time"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    className="h-10 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fixture-match-court">Cancha</Label>
                <select
                  id="fixture-match-court"
                  className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                  value={courtId}
                  onChange={(e) => setCourtId(e.target.value)}
                >
                  <option value="">Seleccionar cancha</option>
                  {courtOptions.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>
              </div>

              {error ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={saveSchedule}
                  disabled={isPending}
                >
                  {isPending ? "Guardando…" : "Guardar"}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
