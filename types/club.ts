import { z } from "zod";

export type MyClubResponse = {
  club: ClubRecord | null;
};

export type ClubRecord = {
  id: string;
  name: string;
  courtCount: number;
  courtType: string;
  address: string;
  email: string | null;
  web: string | null;
  avatarUrl: string | null;
  pricing: unknown;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CourtRecord = {
  id: string;
  name: string;
  type: string;
  surface: string;
  lighting: boolean;
  /** Si es false, la cancha no se muestra en la app de jugadores. */
  listed?: boolean;
  clubId: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileRecord = {
  id: string;
  fullName: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  amenities: unknown;
  availability: unknown;
  isClub: boolean;
  avatarUrl: string | null;
};

export type ClubScheduleBlock = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
};

export type ClubScheduleBlocks = {
  weekday: ClubScheduleBlock;
  saturday: ClubScheduleBlock;
  sunday: ClubScheduleBlock;
};

export type DailyScheduleBlocks = {
  monday: ClubScheduleBlock;
  tuesday: ClubScheduleBlock;
  wednesday: ClubScheduleBlock;
  thursday: ClubScheduleBlock;
  friday: ClubScheduleBlock;
  saturday: ClubScheduleBlock;
  sunday: ClubScheduleBlock;
};

export type AvailabilitySlot = {
  day: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  timeSlots?: string[];
};

export const SLOT_DURATION_OPTIONS: ReadonlyArray<{
  minutes: number;
  label: string;
}> = [
  { minutes: 30, label: "30 min" },
  { minutes: 45, label: "45 min" },
  { minutes: 60, label: "1 h" },
  { minutes: 90, label: "1 h 30" },
  { minutes: 120, label: "2 h" },
];

export const DEFAULT_CLUB_SCHEDULE_BLOCK: ClubScheduleBlock = {
  enabled: true,
  startTime: "07:00",
  endTime: "23:00",
  slotDurationMinutes: 60,
};

export function defaultClubScheduleBlocks(): ClubScheduleBlocks {
  const b = { ...DEFAULT_CLUB_SCHEDULE_BLOCK };
  return {
    weekday: { ...b },
    saturday: { ...b },
    sunday: { ...b },
  };
}

const dayPricingSchema = z.object({
  day: z.string(),
  pricePerHour: z.number().min(0),
});

const optionalWebUrlSchema = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .refine(
      (s) => {
        // Acepta formato web simple:
        // - www.midominio.com
        // - midominio.com
        // - también con http/https opcional
        const simpleWebPattern =
          /^(?:https?:\/\/)?(?:www\.)?[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
        return simpleWebPattern.test(s);
      },
      {
        message: "Introduce una web válida (ej: www.clubpadel.com)",
      },
    ),
]);

const clubAvatarUrlSchema = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .refine(
      (s) => {
        const low = s.toLowerCase();
        if (
          low.startsWith("data:image/png") ||
          low.startsWith("data:image/jpeg") ||
          low.startsWith("data:image/jpg") ||
          low.startsWith("data:image/webp")
        ) {
          return true;
        }
        try {
          new URL(s);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL de imagen no válida" },
    ),
]);

export const clubProfileSaveSchema = z.object({
  clubId: z.string().uuid().optional(),
  club: z.object({
    name: z.string().min(1, "El nombre del club es obligatorio"),
    address: z.string().min(1, "La dirección es obligatoria"),
    email: z.union([
      z.literal(""),
      z.string().email("Introduce un email válido"),
    ]),
    web: optionalWebUrlSchema,
    avatarUrl: clubAvatarUrlSchema,
    courtCount: z.coerce.number().int().min(1),
    courtType: z.enum(["indoor", "outdoor", "both"]),
    pricing: z.array(dayPricingSchema).min(1),
  }),
  profile: z.object({
    description: z.string().optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    amenities: z.record(z.string(), z.boolean()),
  }),
});

export type ClubProfileSavePayload = z.infer<typeof clubProfileSaveSchema>;

export const DEFAULT_AMENITY_KEYS = [
  "parking",
  "showers",
  "lockers",
  "cafeteria",
  "proShop",
  "physiotherapy",
  "kidsZone",
  "wifi",
] as const;

export const AMENITY_LABELS: Record<
  (typeof DEFAULT_AMENITY_KEYS)[number],
  string
> = {
  parking: "Parking",
  showers: "Duchas",
  lockers: "Taquillas",
  cafeteria: "Cafetería",
  proShop: "Pro Shop",
  physiotherapy: "Fisioterapia",
  kidsZone: "Zona infantil",
  wifi: "WiFi",
};

export function defaultPricingPayload() {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;
  return days.map((day) => ({ day, pricePerHour: 0 }));
}
