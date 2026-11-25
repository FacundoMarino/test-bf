"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Lock,
  Plus,
  Repeat,
  Sparkles,
  Trophy,
  User,
  Users,
} from "lucide-react";

import { MiniMonthCalendar } from "@/components/calendar/mini-month-calendar";
import { Button } from "@/components/ui/button";
import {
  bookingOverlapsLocalDay,
  buildCalendarSlotRows,
  matchParticipantsCount,
  reservationGuestLabel,
  type CalendarSlotRow,
  type CourtDaySlot,
} from "@/lib/club-reservation-utils";
import { cn } from "@/lib/utils";
import type { ClubReservation } from "@/types/club-reservation";

type CourtOption = {
  id: string;
  name: string;
  type: string;
  surface: string;
};

type CourtSlotsState =
  | { status: "error"; error: string }
  | { status: "ok"; slots: CourtDaySlot[] };

const PX_PER_MINUTE = 56 / 60;
const MINUTES_PER_DAY = 24 * 60;

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number): Date {
  const x = startOfLocalDay(d);
  x.setDate(x.getDate() + days);
  return x;
}

function fmtHm(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function minutesFromDayStart(iso: string, dayStartMs: number): number {
  const m = (new Date(iso).getTime() - dayStartMs) / 60000;
  return Math.min(MINUTES_PER_DAY, Math.max(0, m));
}

function courtTypeTag(type: string): string {
  if (type === "outdoor") return "Outdoor";
  if (type === "indoor") return "Indoor";
  return "";
}

function bookingMetaLine(b: ClubReservation): string {
  const parts: string[] = [];
  const level = b.level ?? b.user.level;
  if (typeof level === "number" && Number.isFinite(level)) {
    parts.push(`Nivel ${Math.round(level)}`);
  }
  if (b.isMatch) {
    parts.push(`${matchParticipantsCount(b)}/${b.maxPlayers ?? 4}`);
  }
  if (parts.length === 0) {
    parts.push(b.status === "PENDING" ? "Por confirmar" : "Confirmada");
  }
  return parts.join(" · ");
}

export function AllCourtsDayView({
  courts,
  active,
  fetchCourtSlots,
  selectedDate,
  onSelectDate,
  dayBookings,
  refreshKey,
  onFreeSlotClick,
  onBookingClick,
}: {
  courts: CourtOption[];
  /** Con la vista oculta no se piden franjas; al volver se reutiliza la caché. */
  active: boolean;
  fetchCourtSlots: (
    courtId: string,
    ymd: string,
  ) => Promise<
    { ok: true; slots: CourtDaySlot[] } | { ok: false; error: string }
  >;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  /** Reservas del rango del día (todas las canchas); null mientras carga. */
  dayBookings: ClubReservation[] | null;
  /** Cambiar el valor fuerza la recarga de franjas. */
  refreshKey: number;
  onFreeSlotClick: (
    courtId: string,
    slot: { start: string; end: string },
  ) => void;
  onBookingClick: (booking: ClubReservation) => void;
}) {
  const [loaded, setLoaded] = useState<{
    ymd: string;
    byCourt: Record<string, CourtSlotsState>;
  }>({ ymd: "", byCourt: {} });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState<Date>(() => selectedDate);
  const requestRef = useRef(0);

  const ymd = formatLocalYmd(selectedDate);
  const slotsByCourt = useMemo<Record<string, CourtSlotsState>>(
    () => (loaded.ymd === ymd ? loaded.byCourt : {}),
    [loaded, ymd],
  );

  const loadAllSlots = useCallback(async () => {
    if (!active || courts.length === 0) return;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    const results = await Promise.all(
      courts.map(async (c) => {
        const res = await fetchCourtSlots(c.id, ymd);
        const state: CourtSlotsState = res.ok
          ? { status: "ok", slots: res.slots }
          : { status: "error", error: res.error };
        return [c.id, state] as const;
      }),
    );
    if (requestId !== requestRef.current) return;
    setLoaded({ ymd, byCourt: Object.fromEntries(results) });
  }, [active, courts, ymd, fetchCourtSlots]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      void loadAllSlots();
    });
  }, [loadAllSlots, refreshKey]);

  const dayStartMs = startOfLocalDay(selectedDate).getTime();

  const rowsByCourt = useMemo(() => {
    const out: Record<string, CalendarSlotRow[]> = {};
    for (const c of courts) {
      const state = slotsByCourt[c.id];
      if (state?.status !== "ok" || dayBookings === null) {
        out[c.id] = [];
        continue;
      }
      const bookings = dayBookings.filter(
        (r) =>
          r.court.id === c.id &&
          bookingOverlapsLocalDay(r.start, r.end, selectedDate),
      );
      out[c.id] = buildCalendarSlotRows(state.slots, bookings);
    }
    return out;
  }, [courts, slotsByCourt, dayBookings, selectedDate]);

  const stats = useMemo(() => {
    const s = { libres: 0, pendientes: 0, reservados: 0, fijos: 0, custom: 0 };
    for (const rows of Object.values(rowsByCourt)) {
      for (const r of rows) {
        if (r.kind === "available") s.libres += 1;
        else if (r.kind === "tentativeOpen") s.pendientes += 1;
        else if (r.kind === "personalized") s.custom += 1;
        else if (r.kind === "reserved") {
          if (r.booking?.isFixedSeries) s.fijos += 1;
          else s.reservados += 1;
        }
      }
    }
    return s;
  }, [rowsByCourt]);

  const { gridStartMin, gridEndMin } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const rows of Object.values(rowsByCourt)) {
      for (const r of rows) {
        min = Math.min(min, minutesFromDayStart(r.start, dayStartMs));
        max = Math.max(max, minutesFromDayStart(r.end, dayStartMs));
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
      return { gridStartMin: 8 * 60, gridEndMin: 22 * 60 };
    }
    return {
      gridStartMin: Math.floor(min / 60) * 60,
      gridEndMin: Math.ceil(max / 60) * 60,
    };
  }, [rowsByCourt, dayStartMs]);

  const gridHeight = (gridEndMin - gridStartMin) * PX_PER_MINUTE;
  const hourMarks: number[] = [];
  for (let m = gridStartMin; m < gridEndMin; m += 60) hourMarks.push(m);

  const isColumnLoading = (courtId: string) =>
    !slotsByCourt[courtId] || dayBookings === null;
  const anyLoading = courts.some((c) => isColumnLoading(c.id));
  const skeletonBlocks: Array<{ top: number; height: number }> = [];
  for (let m = gridStartMin; m + 90 <= gridEndMin; m += 90) {
    skeletonBlocks.push({
      top: (m - gridStartMin) * PX_PER_MINUTE + 2,
      height: 90 * PX_PER_MINUTE - 4,
    });
  }

  const dateLabel = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const isToday = ymd === formatLocalYmd(new Date());

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            Vista del día
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Estado de todas las canchas en una sola pantalla
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-lg"
            aria-label="Día anterior"
            onClick={() => onSelectDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="min-w-[200px] gap-2 rounded-lg capitalize"
              onClick={() => {
                setPickerMonth(selectedDate);
                setPickerOpen((v) => !v);
              }}
            >
              <CalendarDays className="size-4" />
              {dateLabel}
            </Button>
            {pickerOpen ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  aria-hidden
                  onClick={() => setPickerOpen(false)}
                />
                <MiniMonthCalendar
                  className="border-border bg-card absolute right-0 z-50 mt-2 w-72 rounded-xl border p-3 shadow-lg"
                  viewMonth={pickerMonth}
                  onViewMonthChange={setPickerMonth}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    onSelectDate(startOfLocalDay(d));
                    setPickerOpen(false);
                  }}
                />
              </>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-lg"
            aria-label="Día siguiente"
            onClick={() => onSelectDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-lg"
            disabled={isToday}
            onClick={() => onSelectDate(startOfLocalDay(new Date()))}
          >
            Hoy
          </Button>
        </div>
      </div>

      {anyLoading ? (
        <div className="flex flex-wrap gap-2" aria-hidden>
          {[64, 92, 96, 104, 76].map((w, i) => (
            <span
              key={i}
              className="bg-muted h-[22px] animate-pulse rounded-full"
              style={{ width: w }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="border-border text-foreground rounded-full border px-2.5 py-0.5">
            <span className="text-[#405fd3]">{stats.libres}</span> libres
          </span>
          <span className="rounded-full border border-amber-300/70 px-2.5 py-0.5 text-amber-700 dark:text-amber-300">
            {stats.pendientes} pendientes
          </span>
          <span className="rounded-full border border-sky-300/70 px-2.5 py-0.5 text-sky-700 dark:text-sky-300">
            {stats.reservados} reservados
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300/70 px-2.5 py-0.5 text-indigo-600 dark:text-indigo-300">
            <Repeat className="size-3" />
            {stats.fijos} turnos fijos
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-300/70 px-2.5 py-0.5 text-purple-700 dark:text-purple-300">
            <Sparkles className="size-3" />
            {stats.custom} custom
          </span>
        </div>
      )}

      <div
        className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm"
        aria-busy={anyLoading}
      >
        <div className="overflow-x-auto">
          <div
            className="grid min-w-max"
            style={{
              gridTemplateColumns: `64px repeat(${courts.length}, minmax(180px, 1fr))`,
            }}
          >
            <div className="border-border bg-muted/30 text-muted-foreground sticky left-0 z-20 border-r border-b px-2 py-3 text-center text-xs font-medium">
              Hora
            </div>
            {courts.map((c) => {
              const tag = courtTypeTag(c.type);
              return (
                <div
                  key={c.id}
                  className="border-border bg-muted/30 border-b border-l px-3 py-2.5 first-of-type:border-l-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground truncate text-sm font-semibold">
                      {c.name.trim() || "Sin nombre"}
                    </span>
                    {tag ? (
                      <span
                        className={cn(
                          "rounded-full border px-1.5 text-[10px] font-medium",
                          c.type === "indoor"
                            ? "border-sky-300 text-sky-700 dark:text-sky-300"
                            : "border-emerald-300 text-emerald-700 dark:text-emerald-300",
                        )}
                      >
                        {tag}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {c.surface}
                  </p>
                </div>
              );
            })}

            <div
              className="border-border bg-card sticky left-0 z-10 border-r"
              style={{ height: gridHeight }}
            >
              <div className="relative h-full">
                {hourMarks.map((m) => (
                  <span
                    key={m}
                    className="text-muted-foreground absolute right-0 left-0 px-2 pt-1 text-center text-[11px] font-medium"
                    style={{ top: (m - gridStartMin) * PX_PER_MINUTE }}
                  >
                    {`${String(Math.floor(m / 60) % 24).padStart(2, "0")}:00`}
                  </span>
                ))}
              </div>
            </div>

            {courts.map((c) => {
              const state = slotsByCourt[c.id];
              const rows = rowsByCourt[c.id] ?? [];
              return (
                <div
                  key={c.id}
                  className="border-border relative border-l"
                  style={{ height: gridHeight }}
                >
                  {hourMarks.map((m) => (
                    <div
                      key={m}
                      className="border-border/60 pointer-events-none absolute right-0 left-0 border-t border-dashed"
                      style={{ top: (m - gridStartMin) * PX_PER_MINUTE }}
                    />
                  ))}
                  {isColumnLoading(c.id) && state?.status !== "error"
                    ? skeletonBlocks.map((b, i) => (
                        <div
                          key={i}
                          aria-hidden
                          className="border-border bg-muted/40 absolute inset-x-1.5 animate-pulse space-y-1.5 overflow-hidden rounded-lg border px-2 py-2"
                          style={{
                            top: b.top,
                            height: b.height,
                            animationDelay: `${(i % 4) * 120}ms`,
                          }}
                        >
                          <div className="bg-muted h-2.5 w-20 rounded" />
                          <div
                            className="bg-muted h-2.5 rounded"
                            style={{ width: `${45 + ((i * 17) % 35)}%` }}
                          />
                          <div className="bg-muted h-2 w-14 rounded" />
                        </div>
                      ))
                    : null}
                  {state?.status === "error" ? (
                    <p className="text-destructive absolute inset-x-2 top-3 text-xs">
                      {state.error}
                    </p>
                  ) : null}
                  {state?.status === "ok" &&
                  !isColumnLoading(c.id) &&
                  rows.length === 0 ? (
                    <p className="text-muted-foreground absolute inset-x-2 top-3 text-center text-xs">
                      Sin franjas
                    </p>
                  ) : null}
                  {rows.map((row, i) => {
                    const top =
                      (minutesFromDayStart(row.start, dayStartMs) -
                        gridStartMin) *
                      PX_PER_MINUTE;
                    const height =
                      (minutesFromDayStart(row.end, dayStartMs) -
                        minutesFromDayStart(row.start, dayStartMs)) *
                      PX_PER_MINUTE;
                    return (
                      <SlotBlock
                        key={`${c.id}-${ymd}-${i}-${row.kind}`}
                        row={row}
                        style={{
                          top: top + 2,
                          height: Math.max(height - 4, 20),
                        }}
                        onFreeClick={() =>
                          onFreeSlotClick(c.id, {
                            start: row.start,
                            end: row.end,
                          })
                        }
                        onBookingClick={onBookingClick}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {anyLoading ? <span className="sr-only">Cargando turnos…</span> : null}
      </div>
    </div>
  );
}

function SlotBlock({
  row,
  style,
  onFreeClick,
  onBookingClick,
}: {
  row: CalendarSlotRow;
  style: CSSProperties;
  onFreeClick: () => void;
  onBookingClick: (booking: ClubReservation) => void;
}) {
  const booking = row.booking;
  const range =
    row.kind === "reserved" && booking
      ? `${fmtHm(booking.start)}–${fmtHm(booking.end)}`
      : `${fmtHm(row.start)}–${fmtHm(row.end)}`;
  const base =
    "absolute inset-x-1.5 overflow-hidden rounded-lg border px-2 py-1.5 text-left text-xs leading-tight";

  if (row.kind === "available") {
    return (
      <button
        type="button"
        className={cn(
          base,
          "border-border bg-muted/20 hover:border-[#405fd3]/40 hover:bg-[#405fd3]/5 transition-colors",
        )}
        style={style}
        onClick={onFreeClick}
      >
        <p className="text-foreground inline-flex items-center gap-1 font-semibold">
          <Plus className="size-3" />
          {range}
        </p>
        <p className="text-foreground mt-0.5">Libre</p>
      </button>
    );
  }

  if (row.kind === "tentativeOpen" && booking) {
    return (
      <button
        type="button"
        className={cn(
          base,
          "border-amber-300/70 bg-amber-50 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:text-amber-200",
        )}
        style={style}
        onClick={() => onBookingClick(booking)}
      >
        <p className="inline-flex items-center gap-1 font-semibold">
          <Users className="size-3" />
          {range}
        </p>
        <p className="mt-0.5 truncate font-medium">
          {reservationGuestLabel(booking)}
        </p>
        <p className="mt-0.5 opacity-80">
          Pendiente · {matchParticipantsCount(booking)}/
          {booking.maxPlayers ?? 4}
        </p>
      </button>
    );
  }

  if (row.kind === "reserved" && booking) {
    const fixed = booking.isFixedSeries === true;
    return (
      <button
        type="button"
        className={cn(
          base,
          fixed
            ? "border-indigo-300/70 bg-indigo-50 text-indigo-800 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:text-indigo-200"
            : "border-sky-300/70 bg-sky-50 text-sky-800 hover:bg-sky-100/80 dark:bg-sky-950/30 dark:text-sky-200",
        )}
        style={style}
        onClick={() => onBookingClick(booking)}
      >
        <p className="inline-flex items-center gap-1 font-semibold">
          {fixed ? <Repeat className="size-3" /> : <Lock className="size-3" />}
          {range}
        </p>
        <p className="mt-0.5 inline-flex max-w-full items-center gap-1 font-medium">
          <User className="size-3 shrink-0" />
          <span className="truncate">{reservationGuestLabel(booking)}</span>
        </p>
        <p className="mt-0.5 opacity-80">
          {fixed ? "Turno fijo" : bookingMetaLine(booking)}
        </p>
      </button>
    );
  }

  if (row.kind === "personalized") {
    return (
      <div
        className={cn(
          base,
          "border-purple-300/70 bg-purple-50 text-purple-800 dark:bg-purple-950/30 dark:text-purple-200",
        )}
        style={style}
      >
        <p className="inline-flex items-center gap-1 font-semibold">
          <Sparkles className="size-3" />
          {range}
        </p>
        <p className="mt-0.5 truncate font-medium">
          {row.holdLabel?.trim() || "Turno personalizado"}
        </p>
      </div>
    );
  }

  if (row.kind === "tournament") {
    return (
      <div
        className={cn(
          base,
          "border-[#e8a317]/60 bg-[#e8a317]/15 text-[#9a6b0a]",
        )}
        style={style}
      >
        <p className="inline-flex items-center gap-1 font-semibold">
          <Trophy className="size-3" />
          {range}
        </p>
        <p className="mt-0.5 truncate font-medium">
          {row.holdLabel?.trim() || "Torneo"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        base,
        "border-border bg-muted/50 text-muted-foreground bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,rgba(148,163,184,0.12)_6px,rgba(148,163,184,0.12)_12px)]",
      )}
      style={style}
    >
      <p className="font-semibold">{range}</p>
      <p className="mt-0.5">No disponible</p>
    </div>
  );
}
