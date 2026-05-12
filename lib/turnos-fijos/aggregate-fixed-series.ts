/** Builds the fixed-series list for the Turnos fijos dashboard from raw booking rows. */

export type FixedSeriesView = {
  id: string;
  courtId: string;
  bookingIds: string[];
  dayOfWeek: number;
  startTimeMinutes: number;
  durationMinutes: number;
  courtName: string;
  startDate: string;
  endDate: string | null;
  guestName: string;
  guestPhone: string | null;
  notes: string | null;
};

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED"]);

function sliceYmd(iso: string): string {
  return iso.slice(0, 10);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

function firstNonEmptyString(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

function readFixedSeriesRule(
  row: Record<string, unknown>,
): Record<string, unknown> | null {
  const camel = row.fixedSeriesRule;
  const snake = row.fixed_series_rule;
  if (isRecord(camel)) return camel;
  if (isRecord(snake)) return snake;
  return null;
}

function readManualGuestList(row: Record<string, unknown>): unknown[] {
  const camel = row.manualGuests;
  const snake = row.manual_guests;
  return Array.isArray(camel) ? camel : Array.isArray(snake) ? snake : [];
}

function readManualClubNotes(row: Record<string, unknown>): string | null {
  const camel = row.manualClubNotes;
  const snake = row.manual_club_notes;
  return typeof camel === "string"
    ? camel
    : typeof snake === "string"
      ? snake
      : null;
}

type ParsedOccurrence = {
  seriesId: string;
  rowId: string;
  cancellable: boolean;
  seed: FixedSeriesView;
};

function buildGuestName(
  row: Record<string, unknown>,
  firstGuest: Record<string, unknown> | null,
): string {
  const fromGuest =
    firstGuest && typeof firstGuest.name === "string" ? firstGuest.name : null;
  const user = row.user;
  const fromUser =
    isRecord(user) && typeof user.fullName === "string" ? user.fullName : null;
  return fromGuest ?? fromUser ?? "Reserva fija";
}

function parseOccurrence(
  raw: unknown,
  referenceMs: number,
): ParsedOccurrence | null {
  if (!isRecord(raw)) return null;
  const row = raw;
  const isFixed = Boolean(row.isFixedSeries ?? row.is_fixed_series);
  if (!isFixed) return null;

  const status = typeof row.status === "string" ? row.status : "";
  if (!ACTIVE_STATUSES.has(status)) return null;

  const seriesId = firstNonEmptyString(
    row.fixedSeriesId,
    row.fixed_series_id,
    row.id,
  );
  if (!seriesId) return null;

  const startIso = typeof row.start === "string" ? row.start : "";
  const endIso = typeof row.end === "string" ? row.end : "";
  if (!startIso || !endIso) return null;

  const startDate = new Date(startIso);
  const endDate = new Date(endIso);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }

  const rule = readFixedSeriesRule(row);
  const durationFromRule =
    rule && typeof rule.durationMinutes === "number"
      ? rule.durationMinutes
      : null;
  const dayFromRule =
    rule && typeof rule.dayOfWeek === "number" ? rule.dayOfWeek : null;
  const startMinFromRule =
    rule && typeof rule.startTimeMinutes === "number"
      ? rule.startTimeMinutes
      : null;

  const guests = readManualGuestList(row);
  const firstGuest =
    guests.length > 0 && isRecord(guests[0]) ? guests[0] : null;

  const courtRaw = isRecord(row.court) ? row.court : {};
  const rowId = typeof row.id === "string" ? row.id : "";
  const rowEndMs = endDate.getTime();
  const cancellable =
    rowId.length > 0 && ACTIVE_STATUSES.has(status) && rowEndMs > referenceMs;

  const seed: FixedSeriesView = {
    id: seriesId,
    courtId: firstNonEmptyString(courtRaw.id) ?? "",
    bookingIds: [],
    dayOfWeek: dayFromRule ?? startDate.getDay(),
    startTimeMinutes:
      startMinFromRule ?? startDate.getHours() * 60 + startDate.getMinutes(),
    durationMinutes:
      durationFromRule ??
      Math.max(
        1,
        Math.round((endDate.getTime() - startDate.getTime()) / 60000),
      ),
    courtName: firstNonEmptyString(courtRaw.name) ?? "Cancha",
    startDate:
      rule && typeof rule.startDate === "string"
        ? String(rule.startDate)
        : sliceYmd(startIso),
    endDate: rule && typeof rule.endDate === "string" ? rule.endDate : null,
    guestName: buildGuestName(row, firstGuest),
    guestPhone:
      firstGuest && typeof firstGuest.phone === "string"
        ? firstGuest.phone
        : null,
    notes: readManualClubNotes(row),
  };

  return { seriesId, rowId, cancellable, seed };
}

function mergeOccurrence(
  bySeries: Map<string, FixedSeriesView>,
  parsed: ParsedOccurrence,
): void {
  const current = bySeries.get(parsed.seriesId);
  const next = current ?? parsed.seed;
  const shouldAppend =
    parsed.cancellable && parsed.rowId.length > 0
      ? !next.bookingIds.includes(parsed.rowId)
      : false;
  bySeries.set(parsed.seriesId, {
    ...next,
    bookingIds: shouldAppend
      ? [...next.bookingIds, parsed.rowId]
      : next.bookingIds,
  });
}

function sortFixedSeries(views: FixedSeriesView[]): FixedSeriesView[] {
  return [...views].sort((a, b) =>
    a.dayOfWeek !== b.dayOfWeek
      ? a.dayOfWeek - b.dayOfWeek
      : a.startTimeMinutes - b.startTimeMinutes,
  );
}

/** Aggregates raw API booking rows into fixed-series cards. Pass `referenceMs` to override the wall clock (e.g. tests). */
export function aggregateFixedSeriesBookings(
  rows: unknown[],
  referenceMs?: number,
): FixedSeriesView[] {
  const at = referenceMs ?? Date.now();
  const bySeries = new Map<string, FixedSeriesView>();
  for (const raw of rows) {
    const parsed = parseOccurrence(raw, at);
    if (!parsed) continue;
    mergeOccurrence(bySeries, parsed);
  }
  return sortFixedSeries([...bySeries.values()]);
}
