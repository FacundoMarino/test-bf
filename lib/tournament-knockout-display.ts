import type { TournamentCategory, TournamentMatch } from "@/types/tournament";

type KnockoutLabelOptions = {
  knockoutMatches?: TournamentMatch[];
};

function formatZoneSlotKey(
  key: string | null | undefined,
  zones: TournamentCategory["zones"],
) {
  if (!key?.startsWith("zone:")) return null;
  const [, zoneId, rankRaw] = key.split(":");
  const zone = zones.find((row) => row.id === zoneId);
  if (!zone) return null;
  return `${rankRaw}° ${zone.name}`;
}

export function zoneHasPlayedGroupMatch(
  zone: TournamentCategory["zones"][number] | undefined,
) {
  return Boolean(zone?.matches?.some((match) => match.status === "FINISHED"));
}

export function buildFirstRoundKnockoutSlotLabels(
  zones: TournamentCategory["zones"],
  matchIndex: number,
  firstRoundMatches = matchIndex + 1,
) {
  const needed = Math.max(1, firstRoundMatches);
  const sorted = [...zones].sort((a, b) => a.order - b.order);
  const slots: Array<{ home: string; away: string }> = [];

  const pushCrossovers = (homeRank: number, awayRank: number) => {
    let start = 0;
    if (sorted.length % 2 === 1 && homeRank === 1 && awayRank === 2) {
      slots.push({
        home: `1° ${sorted[0].name}`,
        away: "BYE",
      });
      start = 1;
    }
    for (let index = start; index < sorted.length; index += 2) {
      const zoneA = sorted[index];
      const zoneB = sorted[index + 1];
      if (!zoneB) {
        slots.push({ home: `${homeRank}° ${zoneA.name}`, away: "BYE" });
        break;
      }
      slots.push({
        home: `${homeRank}° ${zoneA.name}`,
        away: `${awayRank}° ${zoneB.name}`,
      });
      slots.push({
        home: `${homeRank}° ${zoneB.name}`,
        away: `${awayRank}° ${zoneA.name}`,
      });
    }
  };

  if (!sorted.length) {
    return { home: "1° Zona A", away: "BYE" };
  }

  pushCrossovers(1, 2);
  for (let rank = 3; slots.length < needed && rank <= 8; rank += 1) {
    pushCrossovers(rank, rank);
  }
  while (slots.length < needed) {
    slots.push({ home: "A definir", away: "BYE" });
  }
  return slots[matchIndex] ?? { home: "A definir", away: "BYE" };
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

function getKnockoutWinnerSlotLabels(
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
    return buildFirstRoundKnockoutSlotLabels(
      category.zones,
      matchIndex,
      category.knockoutFirstRoundMatches,
    );
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

function pairLabel(
  registration: TournamentMatch["homeRegistration"],
  fallback = "A definir",
) {
  if (!registration) return fallback;
  return `${registration.playerProfile.fullName ?? "Jugador"} / ${registration.partnerName}`;
}

function resolveRegistrationLabel(
  category: TournamentCategory,
  registration: TournamentMatch["homeRegistration"],
  registrationId: string | null | undefined,
) {
  if (registration) return pairLabel(registration);
  if (!registrationId) return null;
  const fromCategory = category.registrations.find(
    (row) => row.id === registrationId,
  );
  return fromCategory ? pairLabel(fromCategory) : null;
}

function resolvePreviousRoundWinnerLabel(
  match: TournamentMatch,
  side: "home" | "away",
  category: TournamentCategory,
  knockoutMatches: TournamentMatch[],
) {
  if (match.roundNumber <= 1) return null;

  const feederOrder =
    side === "home" ? match.orderInRound * 2 - 1 : match.orderInRound * 2;
  const feeder = knockoutMatches.find(
    (row) =>
      row.categoryId === match.categoryId &&
      row.roundNumber === match.roundNumber - 1 &&
      row.orderInRound === feederOrder,
  );
  if (!feeder?.winnerRegistrationId) return null;

  const winner = category.registrations.find(
    (row) => row.id === feeder.winnerRegistrationId,
  );
  return winner ? pairLabel(winner) : null;
}

function resolveSideLabel(
  match: TournamentMatch,
  side: "home" | "away",
  category: TournamentCategory,
  options?: KnockoutLabelOptions,
) {
  const registration =
    side === "home" ? match.homeRegistration : match.awayRegistration;
  const registrationId =
    side === "home" ? match.homeRegistrationId : match.awayRegistrationId;
  const slotKey = side === "home" ? match.homeSlotKey : match.awaySlotKey;
  const manual = side === "home" ? match.homeSlotManual : match.awaySlotManual;

  if (manual) {
    const fromRegistration = resolveRegistrationLabel(
      category,
      registration,
      registrationId ?? null,
    );
    if (fromRegistration) return fromRegistration;
  }

  if (slotKey?.startsWith("zone:")) {
    const zoneId = slotKey.split(":")[1];
    const zone = category.zones.find((row) => row.id === zoneId);
    const zoneLabel = formatZoneSlotKey(slotKey, category.zones);
    if (!zoneHasPlayedGroupMatch(zone)) {
      return zoneLabel ?? "A definir";
    }
    if (registration) return pairLabel(registration);
    const fromRegistration = resolveRegistrationLabel(
      category,
      registration,
      registrationId ?? null,
    );
    if (fromRegistration) return fromRegistration;
    if (zoneLabel) return zoneLabel;
  }

  if (registration) return pairLabel(registration);
  const fromRegistration = resolveRegistrationLabel(
    category,
    registration,
    registrationId ?? null,
  );
  if (fromRegistration && match.roundNumber > 1) return fromRegistration;

  const knockoutMatches =
    options?.knockoutMatches?.filter(
      (row) => row.phase === "KNOCKOUT" && row.categoryId === match.categoryId,
    ) ?? [];
  const fromPrevious = resolvePreviousRoundWinnerLabel(
    match,
    side,
    category,
    knockoutMatches,
  );
  if (fromPrevious) return fromPrevious;

  const zoneLabel = formatZoneSlotKey(slotKey, category.zones);
  if (zoneLabel) return zoneLabel;

  const { roundIndex } = getKnockoutRoundMeta(category, match.roundNumber);
  const matchIndex = Math.max(0, match.orderInRound - 1);
  if (roundIndex <= 0) {
    const fallback = buildFirstRoundKnockoutSlotLabels(
      category.zones,
      matchIndex,
      category.knockoutFirstRoundMatches,
    );
    return side === "home" ? fallback.home : fallback.away;
  }

  const winnerLabels = getKnockoutWinnerSlotLabels(
    category,
    match.roundNumber,
    match.orderInRound,
  );
  return side === "home" ? winnerLabels.home : winnerLabels.away;
}

export function getKnockoutMatchLabels(
  match: TournamentMatch,
  category: TournamentCategory,
  options?: KnockoutLabelOptions,
) {
  if (match.homeSlotBye) {
    return {
      home: "BYE",
      away: resolveSideLabel(match, "away", category, options),
    };
  }

  if (match.awaySlotBye) {
    return {
      home: resolveSideLabel(match, "home", category, options),
      away: "BYE",
    };
  }

  return {
    home: resolveSideLabel(match, "home", category, options),
    away: resolveSideLabel(match, "away", category, options),
  };
}

export function getKnockoutRoundLabel(
  category: TournamentCategory,
  roundNumber: number,
) {
  return getKnockoutRoundMeta(category, roundNumber).label;
}

export function getKnockoutStageLabel(
  category: TournamentCategory,
  roundNumber: number,
  orderInRound: number,
) {
  const { label, roundIndex, roundMatchCounts } = getKnockoutRoundMeta(
    category,
    roundNumber,
  );
  const matchCount = roundMatchCounts[roundIndex] ?? 1;
  if (matchCount <= 1) return label;
  return `${label} ${orderInRound}`;
}

export function formatGroupFeederLabel(
  match: TournamentMatch,
  side: "home" | "away",
  zoneMatches: TournamentMatch[],
) {
  const registration =
    side === "home" ? match.homeRegistration : match.awayRegistration;
  if (registration) {
    return `${registration.playerProfile.fullName ?? "Jugador"} / ${registration.partnerName}`;
  }
  const key = side === "home" ? match.homeSlotKey : match.awaySlotKey;
  if (key?.startsWith("gwin:")) {
    const feeder = zoneMatches.find((row) => row.id === key.slice(5));
    return `Ganador ${feeder?.orderInRound ?? 1}`;
  }
  if (key?.startsWith("glose:")) {
    const feeder = zoneMatches.find((row) => row.id === key.slice(6));
    return `Perdedor ${feeder?.orderInRound ?? 1}`;
  }
  return "A definir";
}
