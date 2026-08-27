"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleSlash,
  ClipboardList,
  Clock3,
  Dumbbell,
  Flag,
  Grip,
  Landmark,
  ListChecks,
  Plus,
  Save,
  Settings2,
  Trophy,
  Users,
} from "lucide-react";

import {
  createTournamentAction,
  publishTournamentAction,
  updateTournamentAction,
} from "@/actions/tournaments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TournamentRecord } from "@/types/tournament";

type CourtOption = {
  id: string;
  name: string;
  schedules: Array<{
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    periodStart?: string | null;
    periodEnd?: string | null;
  }>;
};

type CategoryDraft = {
  id?: string;
  level: number;
  modality: "MALE" | "FEMALE" | "MIXED";
  maxPairs: number;
  minPairs: number;
  registrationFeeCents: number;
  groupTeamsPerZone: number;
  groupSets: number;
  groupSuperTieBreak: boolean;
  groupQualifiers: number;
  groupPointsWin: number;
  groupPointsLoss: number;
  groupPointsNoShow: number;
  knockoutFirstRoundMatches: number;
  knockoutSets: number;
  knockoutSuperTieBreak: boolean;
  groupDurationMin: number;
  knockoutDurationMin: number;
};

type CourtBlockDraft = {
  clientKey: string;
  id?: string;
  isExternal: boolean;
  courtId: string;
  externalClubName: string;
  externalCourtName: string;
  startsAt: string;
  endsAt: string;
};

type Props = {
  clubId: string;
  ownClubName: string;
  tournament?: TournamentRecord;
  courts: CourtOption[];
  showHeaderCard?: boolean;
};

const tournamentStatusLabel: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  REGISTRATION_OPEN: "Inscripciones",
  REGISTRATION_CLOSED: "Inscripciones cerradas",
  IN_PROGRESS: "Jugando",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

function defaultCategory(): CategoryDraft {
  return {
    level: 4,
    modality: "MALE",
    maxPairs: 16,
    minPairs: 8,
    registrationFeeCents: 20000,
    groupTeamsPerZone: 4,
    groupSets: 3,
    groupSuperTieBreak: true,
    groupQualifiers: 2,
    groupPointsWin: 3,
    groupPointsLoss: 1,
    groupPointsNoShow: 0,
    knockoutFirstRoundMatches: 2,
    knockoutSets: 3,
    knockoutSuperTieBreak: true,
    groupDurationMin: 60,
    knockoutDurationMin: 90,
  };
}

function toDateTimeLocal(date: string, minutes: number) {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${date.slice(0, 10)}T${hours}:${mins}`;
}

/** ISO / Date → value for `<input type="datetime-local" />` in local timezone. */
function isoToDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

/** `datetime-local` → ISO UTC for the API (`@IsDateString`). */
function dateTimeLocalToIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${value}`);
  }
  return date.toISOString();
}

function formatLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLocalHumanDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function minutesToHHmm(total: number) {
  const normalized = ((total % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (normalized % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function isWithinPeriod(
  targetIso: string,
  periodStart?: string | null,
  periodEnd?: string | null,
) {
  const start = periodStart?.slice(0, 10) ?? null;
  const end = periodEnd?.slice(0, 10) ?? null;
  if (start && targetIso < start) return false;
  if (end && targetIso > end) return false;
  return true;
}

function splitRangeIntoDailyBlocks(startsAt: Date, endsAt: Date) {
  const results: Array<{
    date: string;
    startTimeMinutes: number;
    endTimeMinutes: number;
  }> = [];

  const startDay = new Date(startsAt);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(endsAt);
  endDay.setHours(0, 0, 0, 0);

  const cursor = new Date(startDay);
  while (cursor <= endDay) {
    const isStartDay = cursor.getTime() === startDay.getTime();
    const isEndDay = cursor.getTime() === endDay.getTime();
    const startTimeMinutes = isStartDay
      ? startsAt.getHours() * 60 + startsAt.getMinutes()
      : 0;
    const endTimeMinutes = isEndDay
      ? endsAt.getHours() * 60 + endsAt.getMinutes()
      : 1440;
    if (endTimeMinutes > startTimeMinutes) {
      results.push({
        date: formatLocalIsoDate(cursor),
        startTimeMinutes,
        endTimeMinutes,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}

function splitRangeIntoDailyRanges(startsAt: Date, endsAt: Date) {
  const results: Array<{
    date: string;
    rangeStartMinutes: number;
    rangeEndMinutes: number;
  }> = [];

  const startDay = new Date(startsAt);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(endsAt);
  endDay.setHours(0, 0, 0, 0);

  const cursor = new Date(startDay);
  while (cursor <= endDay) {
    const isStartDay = cursor.getTime() === startDay.getTime();
    const isEndDay = cursor.getTime() === endDay.getTime();
    const rangeStartMinutes = isStartDay
      ? startsAt.getHours() * 60 + startsAt.getMinutes()
      : 0;
    const rangeEndMinutes = isEndDay
      ? endsAt.getHours() * 60 + endsAt.getMinutes()
      : 1440;

    results.push({
      date: formatLocalIsoDate(cursor),
      rangeStartMinutes,
      rangeEndMinutes,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}

function getScheduleWindowsForDate(
  date: Date,
  schedules: CourtOption["schedules"],
  options?: { ignorePeriod?: boolean },
) {
  const dateIso = formatLocalIsoDate(date);
  const dayOfWeek = date.getDay();
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);
  const previousDateIso = formatLocalIsoDate(previousDay);
  const previousDayOfWeek = previousDay.getDay();

  const sameDayWindows = schedules
    .filter(
      (row) =>
        row.dayOfWeek === dayOfWeek &&
        (options?.ignorePeriod
          ? true
          : isWithinPeriod(dateIso, row.periodStart, row.periodEnd)),
    )
    .map((row) =>
      row.endTimeMinutes > row.startTimeMinutes
        ? { from: row.startTimeMinutes, to: row.endTimeMinutes }
        : { from: row.startTimeMinutes, to: 1440 },
    );

  const carryWindows = schedules
    .filter(
      (row) =>
        row.dayOfWeek === previousDayOfWeek &&
        row.endTimeMinutes <= row.startTimeMinutes &&
        (options?.ignorePeriod
          ? true
          : isWithinPeriod(previousDateIso, row.periodStart, row.periodEnd)),
    )
    .map((row) => ({ from: 0, to: row.endTimeMinutes }));

  return [...sameDayWindows, ...carryWindows];
}

function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
) {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

function clipRangeToWindows(
  start: number,
  end: number,
  windows: Array<{ from: number; to: number }>,
) {
  return windows
    .map((window) => ({
      start: Math.max(start, window.from),
      end: Math.min(end, window.to),
    }))
    .filter((segment) => segment.end > segment.start);
}

function getCourtAvailabilityError(
  startsAt: Date,
  endsAt: Date,
  schedules: CourtOption["schedules"],
) {
  if (!schedules.length) {
    return "La cancha no tiene horarios configurados.";
  }
  const dailyRanges = splitRangeIntoDailyRanges(startsAt, endsAt);
  for (const dayRange of dailyRanges) {
    const dayDate = new Date(`${dayRange.date}T00:00`);
    const windows = getScheduleWindowsForDate(dayDate, schedules);
    const fallbackWindows = getScheduleWindowsForDate(dayDate, schedules, {
      ignorePeriod: true,
    });
    const windowsForValidation = windows.length ? windows : fallbackWindows;
    const hasAnyOverlap = windowsForValidation.some((window) =>
      rangesOverlap(
        dayRange.rangeStartMinutes,
        dayRange.rangeEndMinutes,
        window.from,
        window.to,
      ),
    );
    if (hasAnyOverlap) {
      continue;
    }
    if (!windowsForValidation.length) {
      return `La cancha no tiene disponibilidad el ${formatLocalHumanDate(dayDate)}.`;
    }
    const windowsLabel = windowsForValidation
      .map((window) => `${minutesToHHmm(window.from)}-${minutesToHHmm(window.to)}`)
      .join(" · ");
    return `Fuera de disponibilidad para el ${formatLocalHumanDate(dayDate)}. Horarios permitidos: ${windowsLabel}.`;
  }
  return null;
}

function buildOwnCourtBlocksFromSchedules(
  startsAt: Date,
  endsAt: Date,
  schedules: CourtOption["schedules"],
) {
  const dailyRanges = splitRangeIntoDailyRanges(startsAt, endsAt);
  const blocks: Array<{
    date: string;
    startTimeMinutes: number;
    endTimeMinutes: number;
  }> = [];

  for (const dayRange of dailyRanges) {
    const dayDate = new Date(`${dayRange.date}T00:00`);
    const windows = getScheduleWindowsForDate(dayDate, schedules);
    const fallbackWindows = getScheduleWindowsForDate(dayDate, schedules, {
      ignorePeriod: true,
    });
    const windowsForDay = windows.length ? windows : fallbackWindows;
    const segments = clipRangeToWindows(
      dayRange.rangeStartMinutes,
      dayRange.rangeEndMinutes,
      windowsForDay,
    );

    for (const segment of segments) {
      blocks.push({
        date: dayRange.date,
        startTimeMinutes: segment.start,
        endTimeMinutes: segment.end,
      });
    }
  }

  return blocks;
}

function defaultCourtBlock(isExternal = false): CourtBlockDraft {
  return {
    clientKey: crypto.randomUUID(),
    isExternal,
    courtId: "",
    externalClubName: "",
    externalCourtName: "",
    startsAt: "",
    endsAt: "",
  };
}

export function TournamentEditor({
  clubId,
  ownClubName,
  tournament,
  courts,
  showHeaderCard = true,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(tournament?.name ?? "");
  const [description, setDescription] = useState(tournament?.description ?? "");
  const [venueMode, setVenueMode] = useState<"OWN_CLUB" | "MULTI_CLUB">(
    tournament?.venueMode ?? "OWN_CLUB",
  );
  const [participantClubs, setParticipantClubs] = useState<string[]>(
    tournament?.venueMode === "MULTI_CLUB" && tournament.participantClubNames.length
      ? tournament.participantClubNames
      : [ownClubName],
  );
  const [startsAt, setStartsAt] = useState(isoToDateTimeLocal(tournament?.startsAt));
  const [endsAt, setEndsAt] = useState(isoToDateTimeLocal(tournament?.endsAt));
  const [registrationStartsAt, setRegistrationStartsAt] = useState(
    isoToDateTimeLocal(tournament?.registrationStartsAt),
  );
  const [registrationEndsAt, setRegistrationEndsAt] = useState(
    isoToDateTimeLocal(tournament?.registrationEndsAt),
  );
  const [groupStartsAt, setGroupStartsAt] = useState(
    isoToDateTimeLocal(tournament?.groupStartsAt),
  );
  const [groupEndsAt, setGroupEndsAt] = useState(
    isoToDateTimeLocal(tournament?.groupEndsAt),
  );
  const [knockoutStartsAt, setKnockoutStartsAt] = useState(
    isoToDateTimeLocal(tournament?.knockoutStartsAt),
  );
  const [knockoutEndsAt, setKnockoutEndsAt] = useState(
    isoToDateTimeLocal(tournament?.knockoutEndsAt),
  );

  const [categories, setCategories] = useState<CategoryDraft[]>(
    tournament?.categories.length
      ? tournament.categories.map((category) => ({
          id: category.id,
          level: category.level,
          modality: category.modality,
          maxPairs: category.maxPairs,
          minPairs: category.minPairs ?? 0,
          registrationFeeCents: category.registrationFeeCents,
          groupTeamsPerZone: category.groupTeamsPerZone,
          groupSets: category.groupSets,
          groupSuperTieBreak: category.groupSuperTieBreak,
          groupQualifiers: category.groupQualifiers,
          groupPointsWin: category.groupPointsWin,
          groupPointsLoss: category.groupPointsLoss,
          groupPointsNoShow: category.groupPointsNoShow,
          knockoutFirstRoundMatches: category.knockoutFirstRoundMatches,
          knockoutSets: category.knockoutSets,
          knockoutSuperTieBreak: category.knockoutSuperTieBreak,
          groupDurationMin: category.groupMatchDurationMin,
          knockoutDurationMin: category.knockoutMatchDurationMin,
        }))
      : [],
  );

  const [blocks, setBlocks] = useState<CourtBlockDraft[]>(
    tournament?.courtBlocks.length
      ? tournament.courtBlocks.map((block) => ({
          clientKey: crypto.randomUUID(),
          id: block.id,
          isExternal: block.isExternal,
          courtId: block.court?.id ?? "",
          externalClubName: block.externalClubName ?? "",
          externalCourtName: block.externalCourtName ?? "",
          startsAt: toDateTimeLocal(block.date, block.startTimeMinutes),
          endsAt: toDateTimeLocal(block.date, block.endTimeMinutes),
        }))
      : [],
  );
  const [validatedOwnBlocks, setValidatedOwnBlocks] = useState<Record<string, boolean>>(
    {},
  );

  const totals = useMemo(() => {
    const totalPairs = categories.reduce((acc, current) => acc + current.maxPairs, 0);
    return { categories: categories.length, pairs: totalPairs };
  }, [categories]);

  const applyCategoryChange = (index: number, patch: Partial<CategoryDraft>) => {
    setCategories((current) =>
      current.map((item, rowIndex) =>
        rowIndex === index ? { ...item, ...patch } : item,
      ),
    );
  };

  const applyBlockChange = (index: number, patch: Partial<CourtBlockDraft>) => {
    setBlocks((current) => {
      const currentItem = current[index];
      if (
        currentItem &&
        !currentItem.isExternal &&
        ("startsAt" in patch || "endsAt" in patch || "courtId" in patch)
      ) {
        setValidatedOwnBlocks((prev) => ({
          ...prev,
          [currentItem.clientKey]: false,
        }));
      }
      return current.map((item, rowIndex) =>
        rowIndex === index ? { ...item, ...patch } : item,
      );
    });
  };

  const ownBlocks = useMemo(
    () =>
      blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => !block.isExternal),
    [blocks],
  );
  const externalBlocks = useMemo(
    () =>
      blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => block.isExternal),
    [blocks],
  );
  const courtById = useMemo(
    () => new Map(courts.map((court) => [court.id, court])),
    [courts],
  );

  const ownBlockValidity = useMemo(() => {
    const indexed = ownBlocks.map(({ block, index }) => {
      if (!block.courtId || !block.startsAt || !block.endsAt) {
        return { index, valid: false, ready: false, reason: "" };
      }
      const startsAt = new Date(block.startsAt);
      const endsAt = new Date(block.endsAt);
      if (
        Number.isNaN(startsAt.getTime()) ||
        Number.isNaN(endsAt.getTime())
      ) {
        return {
          index,
          valid: false,
          ready: true,
          reason: "La fecha y hora ingresadas no son válidas.",
        };
      }
      if (endsAt <= startsAt) {
        return {
          index,
          valid: false,
          ready: true,
          reason: "La fecha/hora de fin debe ser mayor al inicio.",
        };
      }
      const selectedCourt = courtById.get(block.courtId);
      if (!selectedCourt) {
        return {
          index,
          valid: false,
          ready: true,
          reason: "Seleccioná una cancha válida.",
        };
      }
      const availabilityError = getCourtAvailabilityError(
        startsAt,
        endsAt,
        selectedCourt.schedules,
      );
      if (availabilityError) {
        return {
          index,
          valid: false,
          ready: true,
          reason: availabilityError,
        };
      }
      return { index, valid: true, ready: true, reason: "" };
    });

    for (let i = 0; i < indexed.length; i += 1) {
      if (!indexed[i]?.valid) continue;
      const first = ownBlocks[i]?.block;
      if (!first) continue;
      const firstStart = new Date(first.startsAt);
      const firstEnd = new Date(first.endsAt);
      for (let j = i + 1; j < indexed.length; j += 1) {
        if (!indexed[j]?.valid) continue;
        const second = ownBlocks[j]?.block;
        if (!second) continue;
        if (first.courtId !== second.courtId) {
          continue;
        }
        const secondStart = new Date(second.startsAt);
        const secondEnd = new Date(second.endsAt);
        const overlap = firstStart < secondEnd && secondStart < firstEnd;
        if (overlap) {
          indexed[i] = {
            ...indexed[i],
            valid: false,
            reason:
              "Se superpone con otro bloque de la misma cancha en ese horario.",
          };
          indexed[j] = {
            ...indexed[j],
            valid: false,
            reason:
              "Se superpone con otro bloque de la misma cancha en ese horario.",
          };
        }
      }
    }

    return indexed;
  }, [courtById, ownBlocks]);

  const setParticipantClub = (index: number, value: string) => {
    setParticipantClubs((current) =>
      current.map((clubName, currentIndex) =>
        currentIndex === index ? value : clubName,
      ),
    );
  };

  const addParticipantClub = () => {
    setParticipantClubs((current) => [...current, ""]);
  };

  const removeParticipantClub = (index: number) => {
    setParticipantClubs((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const payload = useMemo(() => {
    const preparedCategories = categories.map((category) => ({
      ...(category.id ? { id: category.id } : {}),
      name: `${category.level}ª ${
        category.modality === "MALE"
          ? "Masculino"
          : category.modality === "FEMALE"
            ? "Femenino"
            : "Mixto"
      }`,
      level: category.level,
      modality: category.modality,
      maxPairs: category.maxPairs,
      minPairs: category.minPairs || undefined,
      groupCount: Math.max(
        1,
        Math.ceil(category.maxPairs / category.groupTeamsPerZone),
      ),
      groupTeamsPerZone: category.groupTeamsPerZone,
      groupSets: category.groupSets,
      groupSuperTieBreak: category.groupSuperTieBreak,
      groupQualifiers: category.groupQualifiers,
      groupPointsWin: category.groupPointsWin,
      groupPointsLoss: category.groupPointsLoss,
      groupPointsNoShow: category.groupPointsNoShow,
      groupTieBreakRules: "head_to_head,set_diff,game_diff",
      groupMatchDurationMin: category.groupDurationMin,
      knockoutFirstRoundMatches: category.knockoutFirstRoundMatches,
      knockoutSets: category.knockoutSets,
      knockoutSuperTieBreak: category.knockoutSuperTieBreak,
      knockoutMatchDurationMin: category.knockoutDurationMin,
      registrationFeeCents: category.registrationFeeCents,
    }));

    const preparedBlocks = blocks
      .flatMap((block) => {
        if (!block.startsAt || !block.endsAt) return null;
        const startsAtDate = new Date(block.startsAt);
        const endsAtDate = new Date(block.endsAt);
        if (
          Number.isNaN(startsAtDate.getTime()) ||
          Number.isNaN(endsAtDate.getTime()) ||
          endsAtDate <= startsAtDate
        ) {
          return null;
        }
        const selectedCourt = block.isExternal ? null : courtById.get(block.courtId);
        const dailyBlocks =
          block.isExternal || !selectedCourt
            ? splitRangeIntoDailyBlocks(startsAtDate, endsAtDate)
            : buildOwnCourtBlocksFromSchedules(
                startsAtDate,
                endsAtDate,
                selectedCourt.schedules,
              );
        return dailyBlocks.map((dailyBlock) => ({
          isExternal: block.isExternal,
          courtId: block.isExternal ? undefined : block.courtId,
          externalClubName: block.isExternal ? block.externalClubName : undefined,
          externalCourtName: block.isExternal ? block.externalCourtName : undefined,
          date: dailyBlock.date,
          startTimeMinutes: dailyBlock.startTimeMinutes,
          endTimeMinutes: dailyBlock.endTimeMinutes,
        }));
      })
      .flat()
      .filter(Boolean);

    return {
      name,
      format: "TORNEO",
      description: description || undefined,
      venueMode,
      participantClubNames:
        venueMode === "OWN_CLUB"
          ? [ownClubName]
          : participantClubs.map((club) => club.trim()).filter(Boolean),
      venue: venueMode === "OWN_CLUB" ? ownClubName : "En varios clubes",
      startsAt: startsAt ? dateTimeLocalToIso(startsAt) : "",
      endsAt: endsAt ? dateTimeLocalToIso(endsAt) : "",
      registrationStartsAt: registrationStartsAt
        ? dateTimeLocalToIso(registrationStartsAt)
        : "",
      registrationEndsAt: registrationEndsAt
        ? dateTimeLocalToIso(registrationEndsAt)
        : "",
      groupStartsAt: groupStartsAt ? dateTimeLocalToIso(groupStartsAt) : undefined,
      groupEndsAt: groupEndsAt ? dateTimeLocalToIso(groupEndsAt) : undefined,
      knockoutStartsAt: knockoutStartsAt
        ? dateTimeLocalToIso(knockoutStartsAt)
        : undefined,
      knockoutEndsAt: knockoutEndsAt ? dateTimeLocalToIso(knockoutEndsAt) : undefined,
      categories: preparedCategories,
      courtBlocks: preparedBlocks,
    };
  }, [
    blocks,
    categories,
    description,
    endsAt,
    groupEndsAt,
    groupStartsAt,
    knockoutEndsAt,
    knockoutStartsAt,
    name,
    registrationEndsAt,
    registrationStartsAt,
    startsAt,
    ownClubName,
    participantClubs,
    venueMode,
    courtById,
  ]);

  const persist = (publish = false) => {
    setError(null);
    startTransition(async () => {
      if (!payload.name || !payload.startsAt || !payload.endsAt) {
        setError("Completa nombre y fechas obligatorias.");
        return;
      }
      if (!payload.categories.length) {
        setError("Debes cargar al menos una categoría.");
        return;
      }
      if (!payload.courtBlocks.length) {
        setError("Debes cargar al menos un bloque de cancha.");
        return;
      }
      const invalidOwnBlock = ownBlockValidity.find((entry) => entry.ready && !entry.valid);
      if (invalidOwnBlock) {
        setError(
          "Hay canchas propias con disponibilidad inválida (solapamiento o rango horario incorrecto).",
        );
        return;
      }
      if (
        payload.venueMode === "MULTI_CLUB" &&
        (!payload.participantClubNames || payload.participantClubNames.length === 0)
      ) {
        setError("Debes agregar al menos un club participante.");
        return;
      }

      const result = tournament
        ? await updateTournamentAction(clubId, tournament.id, payload)
        : await createTournamentAction(clubId, payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!tournament) {
        router.push("/dashboard/club/torneos");
        return;
      }

      if (publish) {
        const publishResult = await publishTournamentAction(clubId, tournament.id);
        if (!publishResult.ok) {
          setError(publishResult.error);
          return;
        }
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {showHeaderCard ? (
        <section className="rounded-2xl border border-border/80 bg-card px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Trophy className="size-4.5 text-primary" />
                {name || "Nuevo torneo"}
              </h1>
              {tournament ? (
                <p className="text-muted-foreground mt-1 inline-flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Trophy className="size-3.5" />
                    {totals.categories} categorías
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3.5" />
                    {totals.pairs} parejas inscriptas
                  </span>
                </p>
              ) : null}
            </div>
            <span className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium">
              {tournament
                ? (tournamentStatusLabel[tournament.status] ?? tournament.status)
                : "Borrador"}
            </span>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border/80 bg-card px-4 py-3 shadow-sm">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg"
            onClick={() => router.push("/dashboard/club/torneos")}
          >
            <CircleSlash className="size-4" />
            Cancelar torneo
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg"
            onClick={() => persist(false)}
            disabled={isPending}
          >
            <Save className="size-4" />
            Guardar borrador
          </Button>
          {tournament ? (
            <Button
              size="lg"
              className="rounded-lg"
              onClick={() => persist(true)}
              disabled={isPending}
            >
              <Flag className="size-4" />
              Publicar torneo
            </Button>
          ) : null}
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <details open className="rounded-xl border border-border/80 bg-card p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
            <span className="inline-flex items-center gap-2">
              <ClipboardList className="size-4 text-primary" />
              Datos generales
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </summary>
          <div className="mt-4 grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tournament-name">Nombre del torneo</Label>
              <Input
                id="tournament-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 rounded-lg"
                placeholder="Nombre del torneo"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tournament-description">Descripción</Label>
              <Textarea
                id="tournament-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-20 rounded-lg"
                placeholder="Contá de qué se trata el torneo, premios, reglamento..."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Formato</Label>
                <select
                  className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                  value="TORNEO"
                  disabled
                >
                  <option value="TORNEO">Torneo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tournament-venue-mode">Sede</Label>
                <select
                  id="tournament-venue-mode"
                  className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                  value={venueMode}
                  onChange={(event) => {
                    const nextMode = event.target.value as "OWN_CLUB" | "MULTI_CLUB";
                    setVenueMode(nextMode);
                    if (nextMode === "OWN_CLUB") {
                      setParticipantClubs([ownClubName]);
                    } else if (
                      participantClubs.length === 1 &&
                      participantClubs[0]?.trim().toLowerCase() ===
                        ownClubName.trim().toLowerCase()
                    ) {
                      setParticipantClubs([""]);
                    }
                  }}
                >
                  <option value="OWN_CLUB">En mi club</option>
                  <option value="MULTI_CLUB">En varios clubes</option>
                </select>
              </div>
            </div>
            {venueMode === "OWN_CLUB" ? (
              <div className="space-y-1.5">
                <Label htmlFor="tournament-own-club">Club anfitrión</Label>
                <Input
                  id="tournament-own-club"
                  value={ownClubName}
                  disabled
                  className="h-10 rounded-lg"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Clubes participantes</Label>
                <div className="space-y-2">
                  {participantClubs.map((clubName, index) => (
                    <div key={`participant-club-${index}`} className="flex items-center gap-2">
                      <Input
                        value={clubName}
                        onChange={(event) => setParticipantClub(index, event.target.value)}
                        className="h-10 rounded-lg"
                        placeholder="Nombre del club"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg text-muted-foreground"
                        onClick={() => removeParticipantClub(index)}
                        disabled={participantClubs.length <= 1}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={addParticipantClub}
                >
                  <Plus className="size-4" />
                  Agregar club
                </Button>
              </div>
            )}
          </div>
        </details>

        <details open className="mt-4 rounded-xl border border-border/80 bg-card p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" />
            Fechas y duración de partidos
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Inicio del torneo</Label>
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Fin del torneo</Label>
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Inicio de inscripciones</Label>
              <Input type="datetime-local" value={registrationStartsAt} onChange={(e) => setRegistrationStartsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Fin de inscripciones</Label>
              <Input type="datetime-local" value={registrationEndsAt} onChange={(e) => setRegistrationEndsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Inicio fase de grupos</Label>
              <Input type="datetime-local" value={groupStartsAt} onChange={(e) => setGroupStartsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Fin fase de grupos</Label>
              <Input type="datetime-local" value={groupEndsAt} onChange={(e) => setGroupEndsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Inicio fase de cuadros</Label>
              <Input type="datetime-local" value={knockoutStartsAt} onChange={(e) => setKnockoutStartsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Fin fase de cuadros</Label>
              <Input type="datetime-local" value={knockoutEndsAt} onChange={(e) => setKnockoutEndsAt(e.target.value)} className="h-10 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Duración partido — grupos (min)</Label>
              <Input
                type="number"
                value={categories[0]?.groupDurationMin ?? 60}
                onChange={(e) => {
                  const value = Number(e.target.value) || 60;
                  setCategories((current) =>
                    current.map((item) => ({ ...item, groupDurationMin: value })),
                  );
                }}
                className="h-10 rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duración partido — cuadros (min)</Label>
              <Input
                type="number"
                value={categories[0]?.knockoutDurationMin ?? 90}
                onChange={(e) => {
                  const value = Number(e.target.value) || 90;
                  setCategories((current) =>
                    current.map((item) => ({ ...item, knockoutDurationMin: value })),
                  );
                }}
                className="h-10 rounded-lg"
              />
            </div>
          </div>
        </details>

        <details open className="mt-4 rounded-xl border border-border/80 bg-card p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
            <span className="inline-flex items-center gap-2">
              <Users className="size-4 text-primary" />
            Categorías y modalidades
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </summary>
          <div className="mt-4 space-y-4">
            {categories.map((category, index) => {
              const registeredPairs = tournament?.categories.find(
                (c) => c.id === category.id,
              )?.registrations.length ?? 0;
              const estimatedZones = Math.max(
                1,
                Math.ceil(category.maxPairs / category.groupTeamsPerZone),
              );
              const knockoutTotal =
                category.knockoutFirstRoundMatches > 0
                  ? category.knockoutFirstRoundMatches * 2 - 1
                  : 0;
              const knockoutFirstLabel =
                category.knockoutFirstRoundMatches <= 1
                  ? "Final"
                  : category.knockoutFirstRoundMatches <= 2
                    ? "Semifinal"
                    : category.knockoutFirstRoundMatches <= 4
                      ? "Cuartos de final"
                      : `${category.knockoutFirstRoundMatches} partidos`;

              return (
              <div key={category.id ?? index} className="space-y-4 rounded-lg border border-border/80 p-4">
                <div className="grid gap-2 sm:grid-cols-12">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-[11px]">Categoría</Label>
                    <select
                      className="border-input bg-background h-10 w-full rounded-lg border px-2 text-sm"
                      value={category.level}
                      onChange={(e) =>
                        applyCategoryChange(index, { level: Number(e.target.value) })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                        <option key={level} value={level}>
                          {level}ª
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-[11px]">Modalidad</Label>
                    <select
                      className="border-input bg-background h-10 w-full rounded-lg border px-2 text-sm"
                      value={category.modality}
                      onChange={(e) =>
                        applyCategoryChange(index, {
                          modality: e.target.value as CategoryDraft["modality"],
                        })
                      }
                    >
                      <option value="MALE">Masculino</option>
                      <option value="FEMALE">Femenino</option>
                      <option value="MIXED">Mixto</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <Label className="text-muted-foreground text-[11px]">Cupo</Label>
                    <Input
                      type="number"
                      value={category.maxPairs}
                      onChange={(e) =>
                        applyCategoryChange(index, { maxPairs: Number(e.target.value) })
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <Label className="text-muted-foreground text-[11px]">Mínimo</Label>
                    <Input
                      type="number"
                      value={category.minPairs}
                      onChange={(e) =>
                        applyCategoryChange(index, { minPairs: Number(e.target.value) })
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-[11px]">Precio</Label>
                    <Input
                      type="number"
                      value={category.registrationFeeCents}
                      onChange={(e) =>
                        applyCategoryChange(index, {
                          registrationFeeCents: Number(e.target.value),
                        })
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2 flex h-full items-center text-xs text-muted-foreground">
                    <span className="rounded-full border border-border bg-muted/40 px-2 py-1">
                      Faltan {Math.max(0, category.minPairs - registeredPairs)}{" "}
                      parejas
                    </span>
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-rose-600"
                      onClick={() =>
                        setCategories((current) =>
                          current.filter((_, rowIndex) => rowIndex !== index),
                        )
                      }
                    >
                      <CircleSlash className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-rose-600"
                      onClick={() =>
                        setCategories((current) =>
                          current.filter((_, rowIndex) => rowIndex !== index),
                        )
                      }
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>

                {/* Fase de grupos */}
                <details open className="rounded-lg border border-primary/30 bg-card p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <Grip className="size-4 text-primary" />
                      Fase de grupos
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </summary>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Equipos por zona</Label>
                      <Input
                        type="number"
                        value={category.groupTeamsPerZone}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            groupTeamsPerZone: Number(e.target.value) || 4,
                          })
                        }
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Clasifican por zona</Label>
                      <Input
                        type="number"
                        value={category.groupQualifiers}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            groupQualifiers: Number(e.target.value) || 2,
                          })
                        }
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Puntos por ganado</Label>
                      <Input
                        type="number"
                        value={category.groupPointsWin}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            groupPointsWin: Number(e.target.value) || 3,
                          })
                        }
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Puntos por perdido</Label>
                      <Input
                        type="number"
                        value={category.groupPointsLoss}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            groupPointsLoss: Number(e.target.value) || 1,
                          })
                        }
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Puntos por no presentado (WO)</Label>
                      <Input
                        type="number"
                        value={category.groupPointsNoShow}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            groupPointsNoShow: Number(e.target.value) || 0,
                          })
                        }
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cantidad de sets</Label>
                      <select
                        className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                        value={category.groupSets}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            groupSets: Number(e.target.value) || 3,
                          })
                        }
                      >
                        <option value={2}>2 sets</option>
                        <option value={3}>3 sets</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">Super tie-break</p>
                        <p className="text-muted-foreground text-xs">
                          Habilitar definición por super tie-break en grupos.
                        </p>
                      </div>
                      <Switch
                        checked={category.groupSuperTieBreak}
                        onCheckedChange={(checked) =>
                          applyCategoryChange(index, { groupSuperTieBreak: checked })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Settings2 className="size-3.5 text-primary" />
                        {registeredPairs} parejas inscriptas → <strong className="text-foreground">{estimatedZones} zonas</strong> estimadas.
                      </span>{" "}
                      Desempate: enfrentamiento directo → diferencia de sets → diferencia de games
                    </div>
                  </div>
                </details>

                {/* Cuadro (eliminación) */}
                <details open className="rounded-lg border border-primary/30 bg-card p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <Dumbbell className="size-4 text-primary" />
                      Cuadro
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </summary>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Partidos de la primera fase</Label>
                      <Input
                        type="number"
                        value={category.knockoutFirstRoundMatches}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            knockoutFirstRoundMatches: Number(e.target.value) || 2,
                          })
                        }
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cantidad de sets</Label>
                      <select
                        className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                        value={category.knockoutSets}
                        onChange={(e) =>
                          applyCategoryChange(index, {
                            knockoutSets: Number(e.target.value) || 3,
                          })
                        }
                      >
                        <option value={2}>2 sets</option>
                        <option value={3}>3 sets</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">Super tie-break</p>
                        <p className="text-muted-foreground text-xs">
                          Habilitar super tie-break para cruces eliminatorios.
                        </p>
                      </div>
                      <Switch
                        checked={category.knockoutSuperTieBreak}
                        onCheckedChange={(checked) =>
                          applyCategoryChange(index, { knockoutSuperTieBreak: checked })
                        }
                      />
                    </div>
                    <div className="sm:col-span-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Settings2 className="size-3.5 text-primary" />
                        Primera fase: <strong className="text-foreground">{category.knockoutFirstRoundMatches} partidos</strong> ({knockoutFirstLabel}) · Total: <strong className="text-foreground">{knockoutTotal} partidos</strong>.
                      </span>{" "}
                      Los cruces se definen a mano en la pestaña Cuadro.
                    </div>
                  </div>
                </details>
              </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="rounded-lg"
              onClick={() =>
                setCategories((current) => [...current, defaultCategory()])
              }
            >
              <Plus className="size-4" />
              + Agregar categoría
            </Button>
          </div>
        </details>

        <details open className="mt-4 rounded-xl border border-border/80 bg-card p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
            <span className="inline-flex items-center gap-2">
              <Landmark className="size-4 text-primary" />
              Canchas y horarios
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </summary>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="border-primary pl-2 text-sm font-semibold leading-none border-l-2">
                Canchas propias
              </p>
              {ownBlocks.map(({ block, index: globalIndex }, ownIndex) => {
                const status = ownBlockValidity.find((entry) => entry.index === globalIndex);
                const showCheck = Boolean(
                  status?.ready && validatedOwnBlocks[block.clientKey],
                );
                return (
                  <div key={block.id ?? `own-${ownIndex}`} className="rounded-lg border border-border/80 p-3">
                    <div className="grid gap-2 sm:grid-cols-12">
                      <div className="space-y-1 sm:col-span-3">
                        <Label className="text-muted-foreground text-[11px]">Cancha</Label>
                        <select
                          className="border-input bg-background h-10 w-full rounded-lg border px-2 text-sm"
                          value={block.courtId}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { courtId: e.target.value })
                          }
                        >
                          <option value="">Seleccionar cancha</option>
                          {courts.map((court) => (
                            <option key={court.id} value={court.id}>
                              {court.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1 sm:col-span-4">
                        <Label className="text-muted-foreground text-[11px]">Desde</Label>
                        <Input
                          type="datetime-local"
                          className="h-10 rounded-lg"
                          value={block.startsAt}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { startsAt: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-4">
                        <Label className="text-muted-foreground text-[11px]">Hasta</Label>
                        <Input
                          type="datetime-local"
                          className="h-10 rounded-lg"
                          value={block.endsAt}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { endsAt: e.target.value })
                          }
                          onBlur={() =>
                            setValidatedOwnBlocks((prev) => ({
                              ...prev,
                              [block.clientKey]: true,
                            }))
                          }
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-end justify-end gap-1">
                        {showCheck ? (
                          status?.valid ? (
                            <CheckCircle2 className="mb-2 size-4 text-emerald-600" />
                          ) : (
                            <span
                              className="mb-2 inline-flex"
                              title={status?.reason || "Horario no disponible"}
                              aria-label={status?.reason || "Horario no disponible"}
                            >
                              <AlertCircle className="size-4 text-amber-600" />
                            </span>
                          )
                        ) : null}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-rose-600 hover:text-rose-600"
                          onClick={() =>
                            setBlocks((current) => {
                              const currentBlock = current[globalIndex];
                              if (currentBlock && !currentBlock.isExternal) {
                                setValidatedOwnBlocks((prev) => {
                                  const next = { ...prev };
                                  delete next[currentBlock.clientKey];
                                  return next;
                                });
                              }
                              return current.filter((_, rowIndex) => rowIndex !== globalIndex);
                            })
                          }
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => setBlocks((current) => [...current, defaultCourtBlock(false)])}
              >
                <Plus className="size-4" />
                Agregar cancha propia
              </Button>
            </div>

            <div className="space-y-2 pt-1">
              <p className="border-lime-500 pl-2 text-sm font-semibold leading-none border-l-2">
                Canchas de otros clubes
              </p>
              {externalBlocks.map(({ block, index: globalIndex }, externalIndex) => {
                return (
                  <div key={block.id ?? `external-${externalIndex}`} className="rounded-lg border border-border/80 p-3">
                    <div className="grid gap-2 sm:grid-cols-12">
                      <div className="space-y-1 sm:col-span-3">
                        <Label className="text-muted-foreground text-[11px]">Club</Label>
                        <Input
                          className="h-10 rounded-lg"
                          placeholder="Nombre del club"
                          value={block.externalClubName}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { externalClubName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-muted-foreground text-[11px]">Cancha</Label>
                        <Input
                          className="h-10 rounded-lg"
                          placeholder="Cancha externa"
                          value={block.externalCourtName}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { externalCourtName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-3">
                        <Label className="text-muted-foreground text-[11px]">Desde</Label>
                        <Input
                          type="datetime-local"
                          className="h-10 rounded-lg"
                          value={block.startsAt}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { startsAt: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-3">
                        <Label className="text-muted-foreground text-[11px]">Hasta</Label>
                        <Input
                          type="datetime-local"
                          className="h-10 rounded-lg"
                          value={block.endsAt}
                          onChange={(e) =>
                            applyBlockChange(globalIndex, { endsAt: e.target.value })
                          }
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-end justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-rose-600 hover:text-rose-600"
                          onClick={() =>
                            setBlocks((current) =>
                              current.filter((_, rowIndex) => rowIndex !== globalIndex),
                            )
                          }
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => setBlocks((current) => [...current, defaultCourtBlock(true)])}
              >
                <Plus className="size-4" />
                Agregar cancha externa
              </Button>
            </div>
          </div>
        </details>

        {/* Fase de grupos y Cuadro ahora se configuran dentro de cada categoría */}
      </section>
    </div>
  );
}
