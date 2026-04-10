import { isProfileCity } from "@/lib/profile-cities";
import {
  DEFAULT_AMENITY_KEYS,
  defaultPricingPayload,
  type ClubRecord,
  type ProfileRecord,
} from "@/types/club";

function sanitizeProfileCity(raw: string | null | undefined): string {
  const t = (raw ?? "").trim();
  return isProfileCity(t) ? t : "";
}

export function parsePricingFromClub(raw: unknown) {
  const fallback = defaultPricingPayload();
  if (!Array.isArray(raw)) return fallback;
  const byDay = new Map<string, { day: string; pricePerHour: number }>();
  for (const row of raw) {
    if (
      row &&
      typeof row === "object" &&
      "day" in row &&
      typeof (row as { day: unknown }).day === "string" &&
      "pricePerHour" in row &&
      typeof (row as { pricePerHour: unknown }).pricePerHour === "number"
    ) {
      const r = row as { day: string; pricePerHour: number };
      byDay.set(r.day, { day: r.day, pricePerHour: r.pricePerHour });
    }
  }
  return fallback.map((d) => byDay.get(d.day) ?? d);
}

export function parseAmenities(raw: unknown): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const k of DEFAULT_AMENITY_KEYS) out[k] = false;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    for (const k of DEFAULT_AMENITY_KEYS) {
      if (k in o) out[k] = Boolean(o[k]);
    }
  }
  return out;
}

export function buildInitialFormState(
  club: ClubRecord | null,
  profile: ProfileRecord | null,
) {
  return {
    clubName: club?.name ?? profile?.fullName ?? "",
    description: profile?.description ?? "",
    email: club?.email ?? "",
    web: club?.web ?? "",
    phone: profile?.phone ?? "",
    location: sanitizeProfileCity(club?.location ?? profile?.location),
    address: club?.address ?? "",
    avatarUrl: club?.avatarUrl ?? "",
    courtCount: club?.courtCount ?? 1,
    courtType: (club?.courtType as "indoor" | "outdoor" | "both") ?? "both",
    amenities: parseAmenities(profile?.amenities),
    pricing: parsePricingFromClub(club?.pricing),
  };
}

export type ClubFormState = ReturnType<typeof buildInitialFormState>;
