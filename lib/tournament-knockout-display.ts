import type { TournamentCategory, TournamentMatch } from "@/types/tournament";

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

export function getKnockoutRoundLabel(
  category: TournamentCategory,
  roundNumber: number,
) {
  return getKnockoutRoundMeta(category, roundNumber).label;
}

function buildFirstRoundSlot(
  zones: TournamentCategory["zones"],
  matchIndex: number,
) {
  const sortedZones = [...zones].sort((a, b) => a.order - b.order);
  if (!sortedZones.length) {
    return {
      home: "1° Zona A",
      away: "BYE",
    };
  }

  const zoneCount = sortedZones.length;
  if (zoneCount % 2 === 1 && matchIndex === 0) {
    return {
      home: `1° ${sortedZones[0].name}`,
      away: "BYE",
    };
  }

  const effectiveIndex = zoneCount % 2 === 1 ? matchIndex - 1 : matchIndex;
  const zonePairBase = zoneCount % 2 === 1 ? 1 : 0;
  const pairIndex = Math.floor(effectiveIndex / 2);
  const subMatch = effectiveIndex % 2;
  const zoneA = sortedZones[zonePairBase + pairIndex * 2];
  const zoneB = sortedZones[zonePairBase + pairIndex * 2 + 1];

  if (!zoneA) {
    return { home: "A definir", away: "BYE" };
  }
  if (!zoneB) {
    return { home: `1° ${zoneA.name}`, away: "BYE" };
  }

  if (subMatch === 0) {
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

export function getKnockoutMatchLabels(
  match: TournamentMatch,
  category: TournamentCategory,
) {
  const roundNumber = match.roundNumber;
  const orderInRound = match.orderInRound;

  if (match.homeSlotBye) {
    return {
      home: "BYE",
      away: match.awayRegistration
        ? pairLabel(match.awayRegistration)
        : (formatZoneSlotKey(match.awaySlotKey, category.zones) ??
          buildFirstRoundSlot(category.zones, orderInRound - 1).away),
    };
  }
  if (match.awaySlotBye) {
    return {
      home: match.homeRegistration
        ? pairLabel(match.homeRegistration)
        : (formatZoneSlotKey(match.homeSlotKey, category.zones) ??
          buildFirstRoundSlot(category.zones, orderInRound - 1).home),
      away: "BYE",
    };
  }

  const homeFromKey = formatZoneSlotKey(match.homeSlotKey, category.zones);
  const awayFromKey = formatZoneSlotKey(match.awaySlotKey, category.zones);
  const { roundIndex } = getKnockoutRoundMeta(category, roundNumber);

  if (roundIndex <= 0) {
    const fallback = buildFirstRoundSlot(category.zones, orderInRound - 1);
    return {
      home: match.homeRegistration
        ? pairLabel(match.homeRegistration)
        : (homeFromKey ?? fallback.home),
      away: match.awayRegistration
        ? pairLabel(match.awayRegistration)
        : (awayFromKey ?? fallback.away),
    };
  }

  if (homeFromKey || awayFromKey) {
    const prev = getKnockoutWinnerSlotLabels(
      category,
      roundNumber,
      orderInRound,
    );
    return {
      home: homeFromKey ?? prev.home,
      away: awayFromKey ?? prev.away,
    };
  }

  return getKnockoutWinnerSlotLabels(category, roundNumber, orderInRound);
}
