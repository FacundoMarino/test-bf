"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, ChevronLeft, ChevronRight, X } from "lucide-react";

import {
  getCourtAvailabilityExceptionsAction,
  getCourtSchedulesAction,
  replaceCourtAvailabilityExceptionsAction,
  type CourtAvailabilityException,
} from "@/actions/courts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CourtRecord } from "@/types/club";

type CourtAvailabilityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: string;
  court: CourtRecord | null;
  onSaved: () => void;
};

type Slot = { start: number; end: number; label: string };
type DateState = {
  allDayClosed: boolean;
  excluded: Array<{ start: number; end: number }>;
};

const DAYS_SHORT = ["do", "lu", "ma", "mi", "ju", "vi", "sá"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}
function formatDateLabel(d: Date) {
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
function timeLabel(minutes: number) {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export function CourtAvailabilityDialog({
  open,
  onOpenChange,
  clubId,
  court,
  onSaved,
}: CourtAvailabilityDialogProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [exceptionsByDate, setExceptionsByDate] = useState<
    Record<string, DateState>
  >({});
  const [monthLoaded, setMonthLoaded] = useState<Record<string, boolean>>({});
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = `Gestionar disponibilidad - ${court?.name?.trim() || "Cancha"}`;
  const monthKey = toMonthKey(currentMonth);

  useEffect(() => {
    if (!open || !court) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setError(null);
      setSelectedDate(null);
      setSlots([]);
      setExceptionsByDate({});
      setMonthLoaded({});
      setCurrentMonth(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [open, court]);

  useEffect(() => {
    if (!open || !court || monthLoaded[monthKey]) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    void getCourtAvailabilityExceptionsAction(clubId, court.id, monthKey).then(
      (res) => {
        setLoading(false);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        const next = { ...exceptionsByDate };
        const grouped: Record<string, DateState> = {};
        for (const row of res.rows) {
          const raw = row as CourtAvailabilityException & {
            is_closed_all_day?: boolean;
          };
          const date = row.date.slice(0, 10);
          if (!grouped[date])
            grouped[date] = { allDayClosed: false, excluded: [] };
          const allDay = row.isClosedAllDay ?? raw.is_closed_all_day ?? false;
          if (allDay) grouped[date].allDayClosed = true;
          else if (
            typeof row.startTimeMinutes === "number" &&
            typeof row.endTimeMinutes === "number"
          ) {
            grouped[date].excluded.push({
              start: row.startTimeMinutes,
              end: row.endTimeMinutes,
            });
          }
        }
        for (const [k, v] of Object.entries(grouped)) next[k] = v;
        setExceptionsByDate(next);
        setMonthLoaded({ ...monthLoaded, [monthKey]: true });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [open, court, monthKey, monthLoaded, clubId, exceptionsByDate]);

  useEffect(() => {
    if (!selectedDate || !court) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    void getCourtSchedulesAction(clubId, court.id).then((res) => {
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const dow = selectedDate.getDay();
      const dateKey = toDateKey(selectedDate);
      const dayRows = res.rows.filter((r) => {
        const row = r as typeof r & {
          period_start?: string | null;
          period_end?: string | null;
        };
        const ps = (r.periodStart ?? row.period_start)?.slice(0, 10);
        const pe = (r.periodEnd ?? row.period_end)?.slice(0, 10);
        if (r.dayOfWeek !== dow) return false;
        if (ps && dateKey < ps) return false;
        if (pe && dateKey > pe) return false;
        return true;
      });
      if (!dayRows.length) {
        setSlots([]);
        return;
      }
      const generated: Slot[] = [];
      const row = dayRows[0];
      let cur = row.startTimeMinutes;
      while (cur + row.slotDurationMinutes <= row.endTimeMinutes) {
        const end = cur + row.slotDurationMinutes;
        generated.push({
          start: cur,
          end,
          label: `${timeLabel(cur)} - ${timeLabel(end)}`,
        });
        cur = end;
      }
      setSlots(generated);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, clubId, court]);

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null;
  const selectedState = selectedKey ? exceptionsByDate[selectedKey] : undefined;

  function toggleSlot(slot: Slot) {
    if (!selectedKey) return;
    const curr = exceptionsByDate[selectedKey] ?? {
      allDayClosed: false,
      excluded: [],
    };
    const exists = curr.excluded.some(
      (s) => s.start === slot.start && s.end === slot.end,
    );
    const nextExcluded = exists
      ? curr.excluded.filter(
          (s) => !(s.start === slot.start && s.end === slot.end),
        )
      : [...curr.excluded, { start: slot.start, end: slot.end }];
    setExceptionsByDate({
      ...exceptionsByDate,
      [selectedKey]: { ...curr, allDayClosed: false, excluded: nextExcluded },
    });
  }

  function toggleAllDay() {
    if (!selectedKey) return;
    const curr = exceptionsByDate[selectedKey] ?? {
      allDayClosed: false,
      excluded: [],
    };
    setExceptionsByDate({
      ...exceptionsByDate,
      [selectedKey]: {
        allDayClosed: !curr.allDayClosed,
        excluded: curr.allDayClosed ? curr.excluded : [],
      },
    });
  }

  async function saveMonth() {
    if (!court) return;
    const start = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    );
    const exceptions: Array<{
      date: string;
      isClosedAllDay: boolean;
      startTimeMinutes?: number;
      endTimeMinutes?: number;
    }> = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const key = toDateKey(d);
      const state = exceptionsByDate[key];
      if (!state) continue;
      if (state.allDayClosed) {
        exceptions.push({ date: key, isClosedAllDay: true });
      } else {
        for (const s of state.excluded) {
          exceptions.push({
            date: key,
            isClosedAllDay: false,
            startTimeMinutes: s.start,
            endTimeMinutes: s.end,
          });
        }
      }
    }
    setPending(true);
    const res = await replaceCourtAvailabilityExceptionsAction(
      clubId,
      court.id,
      {
        month: monthKey,
        exceptions,
      },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onSaved();
    onOpenChange(false);
  }

  const calendarDays = useMemo(() => {
    const first = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const start = new Date(first);
    start.setDate(1 - ((first.getDay() + 6) % 7));
    const out: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, [currentMonth]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card max-h-[min(90vh,780px)] overflow-y-auto rounded-2xl p-6 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-[34px] leading-none font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Seleccioná una fecha en el calendario para ver los turnos. Tocá un
          turno para cancelarlo o reactivarlo.
        </p>

        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="border-border/80 rounded-2xl border p-3">
            <div className="mb-3 flex items-center justify-between">
              <button
                className="border-border text-muted-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full border"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm font-semibold capitalize">
                {currentMonth.toLocaleDateString("es-AR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                className="border-border text-muted-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-full border"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                type="button"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="mb-2 grid grid-cols-7 text-center text-xs text-muted-foreground">
              {DAYS_SHORT.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((d) => {
                const inMonth = d.getMonth() === currentMonth.getMonth();
                const key = toDateKey(d);
                const selected = selectedKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(new Date(d))}
                    className={`h-9 rounded-lg text-sm ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : inMonth
                          ? "hover:bg-muted"
                          : "text-muted-foreground/50"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {!selectedDate ? (
              <div className="text-muted-foreground flex h-full items-center justify-center rounded-2xl border border-dashed">
                Seleccioná una fecha para ver los turnos
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold capitalize">
                    {formatDateLabel(selectedDate)}
                  </h3>
                  <Button
                    type="button"
                    variant={
                      selectedState?.allDayClosed ? "destructive" : "outline"
                    }
                    className="rounded-xl"
                    onClick={toggleAllDay}
                  >
                    <Ban className="mr-2 size-4" />
                    {selectedState?.allDayClosed
                      ? "Día cerrado"
                      : "Cerrar día completo"}
                  </Button>
                </div>

                {selectedState?.allDayClosed ? (
                  <div className="border-destructive/40 bg-destructive/8 text-destructive rounded-2xl border p-6 text-center font-medium">
                    Este día está completamente cerrado
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {slots.map((slot) => {
                      const excluded =
                        selectedState?.excluded.some(
                          (s) => s.start === slot.start && s.end === slot.end,
                        ) ?? false;
                      return (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                            excluded
                              ? "border-destructive/40 bg-destructive/8 text-destructive"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          {excluded ? (
                            <span className="mr-1 inline-flex items-center">
                              ×
                            </span>
                          ) : null}
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-border/70 border-t pt-4">
          <p className="text-muted-foreground mb-2 text-sm font-medium">
            Resumen de excepciones
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(exceptionsByDate)
              .filter(([, st]) => st.allDayClosed || st.excluded.length > 0)
              .map(([date, st]) =>
                st.allDayClosed ? (
                  <span
                    key={`${date}-all`}
                    className="bg-destructive text-destructive-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {date.slice(8, 10)}/{date.slice(5, 7)} - Día completo{" "}
                    <X className="ml-1 size-3" />
                  </span>
                ) : (
                  st.excluded.map((s) => (
                    <span
                      key={`${date}-${s.start}-${s.end}`}
                      className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {date.slice(8, 10)}/{date.slice(5, 7)}{" "}
                      {timeLabel(s.start)}-{timeLabel(s.end)}
                    </span>
                  ))
                ),
              )}
          </div>
          <Button
            type="button"
            className="h-11 w-full rounded-xl text-base font-semibold"
            onClick={() => void saveMonth()}
            disabled={loading || pending}
          >
            {pending ? "Guardando..." : "Listo"}
          </Button>
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
