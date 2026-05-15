import type { CourtScheduleRow } from "@/lib/court-schedule-map";
import type { FixedSeriesView } from "@/lib/turnos-fijos/aggregate-fixed-series";

export type FixedSeriesFormState = {
  guestName: string;
  guestPhone: string;
  courtId: string;
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  notes: string;
};

export const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
] as const;

export function toHm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function parseHmToMinutes(v: string): number {
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
}

export function formatLocalYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function alignDateToDayOfWeek(
  dateStr: string,
  targetDow: number,
): string {
  const d = parseYmd(dateStr);
  if (!d) return dateStr;
  const diff = (targetDow - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return formatLocalYmd(d);
}

export function addMinutes(base: number, add: number): number {
  return Math.max(0, Math.min(24 * 60 - 1, base + add));
}

export function parseYmd(dateStr: string): Date | null {
  if (!dateStr) return null;
  const normalized = dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
  const [y, m, d] = normalized.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function normalizeDateYmd(dateStr: string): string {
  const trimmed = dateStr.trim();
  if (!trimmed) return "";
  const parsed = parseYmd(trimmed);
  return parsed ? formatLocalYmd(parsed) : trimmed.slice(0, 10);
}

function rangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd;
}

export function scheduleActiveInRange(
  row: CourtScheduleRow,
  from: Date,
  to: Date,
): boolean {
  const periodStart = row.periodStart;
  const periodEnd = row.periodEnd;
  if (!periodStart || !periodEnd) return true;
  const ps = parseYmd(periodStart);
  const pe = parseYmd(periodEnd);
  const windowsOk = ps !== null && pe !== null;
  return windowsOk ? rangeOverlaps(ps, pe, from, to) : false;
}

export function formatDatePill(isoDate: string | null): string {
  if (!isoDate) return "Indefinido";
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function initialFixedSeriesForm(courtId: string): FixedSeriesFormState {
  const now = new Date();
  return {
    guestName: "",
    guestPhone: "",
    courtId,
    dayOfWeek: now.getDay(),
    startTime: "20:00",
    durationMinutes: 90,
    startDate: now.toISOString().slice(0, 10),
    endDate: "",
    notes: "",
  };
}

export function groupFixedSeriesByDay(items: FixedSeriesView[]) {
  const map = new Map<number, FixedSeriesView[]>();
  for (const item of items) {
    const list = map.get(item.dayOfWeek) ?? [];
    list.push(item);
    map.set(item.dayOfWeek, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);
  }
  return map;
}

export type DaySection = {
  dayLabel: string;
  dayOfWeek: number;
  rows: FixedSeriesView[];
};

export function buildNonEmptyDaySections(
  grouped: Map<number, FixedSeriesView[]>,
): DaySection[] {
  return DAY_LABELS.map((dayLabel, dayOfWeek) => ({
    dayLabel,
    dayOfWeek,
    rows: grouped.get(dayOfWeek) ?? [],
  })).filter((s) => s.rows.length > 0);
}

export function validateSubmitBasics(input: {
  guestName: string;
  courtId: string;
  startDate: string;
  durationMinutes: number;
  dayOptions: number[];
  startTimeOptions: number[];
  effectiveDayOfWeek: number;
  effectiveStartHm: string;
}): string | null {
  const failures: ReadonlyArray<readonly [boolean, string]> = [
    [!input.guestName.trim(), "Ingresa el nombre del jugador"],
    [!input.courtId, "Selecciona una cancha"],
    [!input.startDate, "Selecciona fecha de inicio"],
    [input.durationMinutes < 1, "La duracion debe ser mayor a 0"],
    [
      input.dayOptions.length > 0 &&
        !input.dayOptions.includes(input.effectiveDayOfWeek),
      "No hay horarios disponibles para ese dia",
    ],
    [
      input.startTimeOptions.length > 0 &&
        !input.startTimeOptions.includes(
          parseHmToMinutes(input.effectiveStartHm),
        ),
      "La hora seleccionada no existe en el horario de la cancha",
    ],
  ];

  for (const [bad, message] of failures) {
    if (bad) return message;
  }
  return null;
}

export function validateSeriesDateRange(
  startDateYmd: string,
  endDateYmd: string,
): string | null {
  const startDateParsed = parseYmd(startDateYmd);
  if (!startDateParsed) return "La fecha de inicio no es valida";
  if (!endDateYmd) return null;
  const endDateParsed = parseYmd(endDateYmd);
  if (!endDateParsed) return "La fecha de fin no es valida";
  const rangeOk = endDateParsed.getTime() >= startDateParsed.getTime();
  return rangeOk
    ? null
    : "La fecha de fin debe ser igual o posterior al inicio";
}
