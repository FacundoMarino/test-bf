import type { ClubReservation } from "@/types/club-reservation";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function asNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Convierte fila del auth-service al modelo del dashboard. */
export function normalizeClubReservation(raw: unknown): ClubReservation | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const userRaw =
    row.user && typeof row.user === "object"
      ? (row.user as Record<string, unknown>)
      : {};
  const courtRaw =
    row.court && typeof row.court === "object"
      ? (row.court as Record<string, unknown>)
      : {};

  const nestedMatch =
    row.match && typeof row.match === "object"
      ? (row.match as Record<string, unknown>)
      : null;
  const participantsRawSource =
    row.participants ??
    row.matchParticipants ??
    row.players ??
    nestedMatch?.participants;
  const participantsRaw = Array.isArray(participantsRawSource)
    ? participantsRawSource
    : [];
  const participants = participantsRaw
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      const pr = p as Record<string, unknown>;
      const profileId = asString(pr.profileId ?? pr.profile_id);
      if (!profileId) return null;
      return {
        profileId,
        fullName: asNullableString(pr.fullName ?? pr.full_name),
        avatarUrl: asNullableString(pr.avatarUrl ?? pr.avatar_url),
        level: asNullableNumber(pr.level),
        phone: asNullableString(pr.phone ?? pr.phoneNumber ?? pr.phone_number),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const id = asString(row.id);
  const userId = asString(row.userId ?? row.user_id);
  const start = asString(row.start);
  const end = asString(row.end);
  const createdAt = asString(row.createdAt ?? row.created_at);
  const status = asString(row.status) as ClubReservation["status"];
  if (!id || !userId || !start || !end || !createdAt) return null;

  const occupiesSlotRaw = row.occupiesSlot ?? row.occupies_slot;
  const occupiesSlot =
    typeof occupiesSlotRaw === "boolean" ? occupiesSlotRaw : true;

  return {
    id,
    userId,
    user: {
      fullName: asNullableString(userRaw.fullName ?? userRaw.full_name),
      avatarUrl: asNullableString(userRaw.avatarUrl ?? userRaw.avatar_url),
      phone: asNullableString(
        userRaw.phone ?? userRaw.phoneNumber ?? userRaw.phone_number,
      ),
      email: asNullableString(
        userRaw.email ??
          userRaw.mail ??
          userRaw.emailAddress ??
          userRaw.email_address,
      ),
      level: asNullableNumber(userRaw.level),
    },
    userEmail: asNullableString(
      row.userEmail ?? row.user_email ?? row.bookerEmail ?? row.booker_email,
    ),
    court: {
      id: asString(courtRaw.id),
      name: asString(courtRaw.name),
      type: asString(courtRaw.type),
    },
    start,
    end,
    status,
    createdAt,
    occupiesSlot,
    isMatch: Boolean(row.isMatch ?? row.is_match),
    title: asNullableString(row.title),
    maxPlayers: asNullableNumber(row.maxPlayers ?? row.max_players),
    level: asNullableNumber(row.level),
    visibility: asNullableString(row.visibility),
    participants,
    manualGuests: (() => {
      let rawGuests: unknown = row.manualGuests ?? row.manual_guests;
      if (typeof rawGuests === "string") {
        try {
          rawGuests = JSON.parse(rawGuests) as unknown;
        } catch {
          return null;
        }
      }
      if (!Array.isArray(rawGuests)) return null;
      const list: Array<{ name: string; phone: string | null }> = [];
      for (const item of rawGuests) {
        if (!item || typeof item !== "object") continue;
        const g = item as Record<string, unknown>;
        const name = asNullableString(g.name);
        if (!name) continue;
        list.push({
          name,
          phone: asNullableString(g.phone ?? g.phoneNumber ?? g.phone_number),
        });
      }
      return list.length ? list : null;
    })(),
    manualClubNotes: asNullableString(
      row.manualClubNotes ?? row.manual_club_notes,
    ),
    slotPricePerHour: asNullableNumber(
      row.slotPricePerHour ?? row.slot_price_per_hour,
    ),
  };
}
