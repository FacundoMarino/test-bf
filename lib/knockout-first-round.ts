export type KnockoutZoneSeed = {
  id: string;
  name: string;
  order: number;
  qualifierCount: number;
};

export type KnockoutZoneRef = {
  zoneId: string;
  zoneName: string;
  rank: number;
};

export type FirstRoundKnockoutSlot = {
  home: KnockoutZoneRef | null;
  away: KnockoutZoneRef | null;
  awayBye: boolean;
};

export function zoneKnockoutQualifierCount(
  teamCount: number,
  defaultQualifiers = 2,
) {
  const fallback = Math.max(1, defaultQualifiers);
  if (teamCount >= 4) return Math.min(3, teamCount);
  if (teamCount > 0) return Math.min(fallback, teamCount);
  return fallback;
}

export function knockoutFirstRoundMatchCount(
  qualifierCount: number,
  configured: number,
) {
  const n = Math.max(2, qualifierCount);
  let bracket = 2;
  while (bracket < n) bracket *= 2;
  return Math.max(Math.max(1, configured), Math.floor(bracket / 2));
}

function ref(
  zone: KnockoutZoneSeed,
  rank: number,
): KnockoutZoneRef {
  return { zoneId: zone.id, zoneName: zone.name, rank };
}

function pushCrossovers(
  sorted: KnockoutZoneSeed[],
  homeRank: number,
  awayRank: number,
  slots: FirstRoundKnockoutSlot[],
) {
  let start = 0;
  if (sorted.length % 2 === 1 && homeRank === 1 && awayRank === 2) {
    const zone = sorted[0];
    slots.push({
      home: ref(zone, 1),
      away: null,
      awayBye: true,
    });
    start = 1;
  }
  for (let index = start; index < sorted.length; index += 2) {
    const zoneA = sorted[index];
    const zoneB = sorted[index + 1];
    if (!zoneB) {
      slots.push({
        home: ref(zoneA, homeRank),
        away: null,
        awayBye: true,
      });
      break;
    }
    slots.push({
      home: ref(zoneA, homeRank),
      away: ref(zoneB, awayRank),
      awayBye: false,
    });
    slots.push({
      home: ref(zoneB, homeRank),
      away: ref(zoneA, awayRank),
      awayBye: false,
    });
  }
}

export function buildFirstRoundKnockoutSlotsLegacy(
  zones: KnockoutZoneSeed[],
  firstRoundMatches: number,
): FirstRoundKnockoutSlot[] {
  const needed = Math.max(1, firstRoundMatches);
  const sorted = [...zones].sort((a, b) => a.order - b.order);
  const slots: FirstRoundKnockoutSlot[] = [];

  if (!sorted.length) {
    return Array.from({ length: needed }, () => ({
      home: { zoneId: '', zoneName: 'Zona A', rank: 1 },
      away: null,
      awayBye: true,
    }));
  }

  pushCrossovers(sorted, 1, 2, slots);
  for (let rank = 3; slots.length < needed && rank <= 8; rank += 1) {
    pushCrossovers(sorted, rank, rank, slots);
  }
  while (slots.length < needed) {
    slots.push({ home: null, away: null, awayBye: true });
  }
  return slots.slice(0, needed);
}

export function buildFirstRoundKnockoutSlots(
  zones: KnockoutZoneSeed[],
  firstRoundMatches: number,
): FirstRoundKnockoutSlot[] {
  const needed = Math.max(1, firstRoundMatches);
  const sorted = [...zones].sort((a, b) => a.order - b.order);
  const slots: FirstRoundKnockoutSlot[] = [];

  if (!sorted.length) {
    return Array.from({ length: needed }, () => ({
      home: { zoneId: '', zoneName: 'Zona A', rank: 1 },
      away: null,
      awayBye: true,
    }));
  }

  const logical: FirstRoundKnockoutSlot[] = [];
  pushCrossovers(sorted, 1, 2, logical);

  const thirdZones = sorted.filter((zone) => zone.qualifierCount >= 3);
  const playInByLogicalIndex = new Map<number, KnockoutZoneRef>();
  for (const zone of thirdZones) {
    const index = logical.findIndex(
      (slot) =>
        slot.home?.zoneId === zone.id &&
        slot.home.rank === 1 &&
        Boolean(slot.away) &&
        !slot.awayBye,
    );
    if (index >= 0) {
      playInByLogicalIndex.set(index, ref(zone, 3));
    }
  }

  const canExpand = needed >= logical.length * 2 && logical.length > 0;

  if (canExpand) {
    for (let index = 0; index < logical.length; index += 1) {
      const slot = logical[index];
      const third = playInByLogicalIndex.get(index);
      if (third && slot.away) {
        slots.push({ home: slot.home, away: null, awayBye: true });
        slots.push({ home: third, away: slot.away, awayBye: false });
      } else if (slot.awayBye || !slot.away) {
        slots.push({ home: slot.home, away: null, awayBye: true });
      } else {
        slots.push({ home: slot.home, away: null, awayBye: true });
        slots.push({ home: slot.away, away: null, awayBye: true });
      }
    }
    for (const zone of thirdZones) {
      const used = [...playInByLogicalIndex.values()].some(
        (item) => item.zoneId === zone.id,
      );
      if (!used && slots.length < needed) {
        slots.push({
          home: ref(zone, 3),
          away: null,
          awayBye: true,
        });
      }
    }
  } else {
    slots.push(...logical);
    for (const zone of thirdZones) {
      if (slots.length >= needed) break;
      slots.push({
        home: ref(zone, 3),
        away: null,
        awayBye: true,
      });
    }
  }

  while (slots.length < needed) {
    slots.push({ home: null, away: null, awayBye: true });
  }
  return slots.slice(0, needed);
}

export function firstRoundSlotKeysMatch(
  match: {
    homeSlotKey: string | null;
    awaySlotKey: string | null;
    awaySlotBye: boolean;
  },
  slot: FirstRoundKnockoutSlot,
) {
  const homeKey = slot.home?.zoneId
    ? `zone:${slot.home.zoneId}:${slot.home.rank}`
    : null;
  const awayKey = slot.away?.zoneId
    ? `zone:${slot.away.zoneId}:${slot.away.rank}`
    : null;
  return (
    (match.homeSlotKey ?? null) === homeKey &&
    Boolean(match.awaySlotBye) === Boolean(slot.awayBye) &&
    (match.awaySlotKey ?? null) === awayKey
  );
}
