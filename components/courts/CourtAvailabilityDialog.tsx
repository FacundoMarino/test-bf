"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Ban, Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  createCourtCustomSlotAction,
  deleteCourtCustomSlotAction,
  getCourtAvailabilityExceptionsAction,
  getCourtCustomSlotsAction,
  getCourtSchedulesAction,
  replaceCourtAvailabilityExceptionsAction,
  type CourtAvailabilityException,
  type CourtCustomSlot,
} from "@/actions/courts";
import { MiniMonthCalendar } from "@/components/calendar/mini-month-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { effectiveEndTimeMinutes } from "@/lib/court-schedule-map";
import type { CourtRecord } from "@/types/club";

type CourtAvailabilityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: string;
  court: CourtRecord | null;
  selectableCourts?: CourtRecord[];
  onSelectCourt?: (courtId: string) => void;
  onSaved?: () => void;
};

function notifyReservationsRefresh() {
  window.dispatchEvent(new CustomEvent("club-reservations-refresh"));
}

type RegularSlot = { start: number; end: number; label: string };
type DateState = {
  allDayClosed: boolean;
  excluded: Array<{ start: number; end: number }>;
};

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
function parseTimeInput(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}
function minutesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function slotsOverlappingRange(
  slots: RegularSlot[],
  startMin: number,
  endMin: number,
): Array<{ start: number; end: number }> {
  return slots
    .filter((s) => minutesOverlap(startMin, endMin, s.start, s.end))
    .map((s) => ({ start: s.start, end: s.end }));
}

type MonthExceptionPayload = {
  date: string;
  isClosedAllDay: boolean;
  startTimeMinutes?: number;
  endTimeMinutes?: number;
};

function buildMonthExceptionsPayload(
  exceptionsByDate: Record<string, DateState>,
  monthStart: Date,
): MonthExceptionPayload[] {
  const end = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
  const exceptions: MonthExceptionPayload[] = [];
  for (let d = new Date(monthStart); d < end; d.setDate(d.getDate() + 1)) {
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
  return exceptions;
}

function buildCustomSlotNote(parts: {
  name?: string;
  phone?: string;
  note?: string;
}): string | undefined {
  const segments: string[] = [];
  const name = parts.name?.trim();
  const phone = parts.phone?.trim();
  const note = parts.note?.trim();
  if (name) segments.push(name);
  if (phone) segments.push(`Tel: ${phone}`);
  if (note) segments.push(note);
  return segments.length > 0 ? segments.join(" · ") : undefined;
}

export function CourtAvailabilityDialog({
  open,
  onOpenChange,
  clubId,
  court,
  selectableCourts,
  onSelectCourt,
  onSaved,
}: CourtAvailabilityDialogProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [exceptionsByDate, setExceptionsByDate] = useState<
    Record<string, DateState>
  >({});
  const [customSlotsByDate, setCustomSlotsByDate] = useState<
    Record<string, CourtCustomSlot[]>
  >({});
  const [monthLoaded, setMonthLoaded] = useState<Record<string, boolean>>({});
  const [regularSlots, setRegularSlots] = useState<RegularSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [customStart, setCustomStart] = useState("10:00");
  const [customEnd, setCustomEnd] = useState("11:30");
  const [customPrice, setCustomPrice] = useState("0");
  const [customGuestName, setCustomGuestName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [creatingCustom, setCreatingCustom] = useState(false);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const title = `Gestionar disponibilidad - ${court?.name?.trim() || "Cancha"}`;
  const monthKey = toMonthKey(currentMonth);

  function closeCustomForm() {
    setCustomFormOpen(false);
    setError(null);
  }

  function openCustomForm() {
    if (!selectedKey) {
      setError("Seleccioná una fecha en el calendario.");
      return;
    }
    if (selectedState?.allDayClosed) {
      setError(
        "Este día está cerrado. Reabrilo antes de crear un turno personalizado.",
      );
      return;
    }
    setError(null);
    setCustomFormOpen(true);
  }

  function resetCustomFormFields() {
    setCustomStart("10:00");
    setCustomEnd("11:30");
    setCustomPrice("0");
    setCustomGuestName("");
    setCustomPhone("");
    setCustomNote("");
  }

  useEffect(() => {
    if (!error) return;
    queueMicrotask(() => {
      errorBannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, [error]);

  useEffect(() => {
    if (!open || !court) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setError(null);
      setSelectedDate(null);
      setRegularSlots([]);
      setExceptionsByDate({});
      setCustomSlotsByDate({});
      setMonthLoaded({});
      setCustomFormOpen(false);
      resetCustomFormFields();
      setCurrentMonth(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [open, court?.id]);

  useEffect(() => {
    if (!open || !court || monthLoaded[monthKey]) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    void Promise.all([
      getCourtAvailabilityExceptionsAction(clubId, court.id, monthKey),
      getCourtCustomSlotsAction(clubId, court.id, monthKey),
    ]).then(([exRes, customRes]) => {
      setLoading(false);
      if (!exRes.ok) {
        setError(exRes.error);
        return;
      }
      if (!customRes.ok) {
        setError(customRes.error);
        return;
      }
      const grouped: Record<string, DateState> = {};
      for (const row of exRes.rows) {
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

      const customByDate: Record<string, CourtCustomSlot[]> = {};
      for (const row of customRes.rows) {
        const date = row.date.slice(0, 10);
        if (!customByDate[date]) customByDate[date] = [];
        customByDate[date].push(row);
      }

      setExceptionsByDate(grouped);
      setCustomSlotsByDate(customByDate);
      setMonthLoaded((prev) => ({ ...prev, [monthKey]: true }));
    });
    return () => {
      cancelled = true;
    };
  }, [open, court, monthKey, monthLoaded, clubId]);

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
      const generatedByKey = new Map<string, RegularSlot>();
      const sortedRows = [...dayRows].sort(
        (a, b) => a.startTimeMinutes - b.startTimeMinutes,
      );
      for (const row of sortedRows) {
        let cur = row.startTimeMinutes;
        const effectiveEnd = effectiveEndTimeMinutes(
          row.startTimeMinutes,
          row.endTimeMinutes,
        );
        while (cur + row.slotDurationMinutes <= effectiveEnd) {
          const end = cur + row.slotDurationMinutes;
          const key = `${cur}-${end}`;
          if (!generatedByKey.has(key)) {
            generatedByKey.set(key, {
              start: cur,
              end,
              label: `${timeLabel(cur)} - ${timeLabel(end)}`,
            });
          }
          cur = end;
        }
      }
      setRegularSlots(Array.from(generatedByKey.values()));
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, clubId, court]);

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null;
  const selectedState = selectedKey ? exceptionsByDate[selectedKey] : undefined;
  const dayCustomSlots = selectedKey
    ? (customSlotsByDate[selectedKey] ?? [])
    : [];

  const regularSlotsVisible = useMemo(() => {
    const customOnDay = dayCustomSlots;
    return regularSlots.filter(
      (s) =>
        !customOnDay.some(
          (c) => c.startTimeMinutes < s.end && c.endTimeMinutes > s.start,
        ),
    );
  }, [regularSlots, dayCustomSlots]);

  function toggleSlot(slot: RegularSlot) {
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
    setError(null);
  }

  function toggleAllDay() {
    if (!selectedKey || customFormOpen) return;
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

  function validateCustomSlotRange(
    startMin: number,
    endMin: number,
  ): string | null {
    const overlapsCustom = dayCustomSlots.some((c) =>
      minutesOverlap(startMin, endMin, c.startTimeMinutes, c.endTimeMinutes),
    );
    if (overlapsCustom) {
      return "El horario se superpone con otro turno personalizado.";
    }

    if (regularSlots.length === 0) {
      return "No hay turnos configurados para este día.";
    }

    const dayStart = Math.min(...regularSlots.map((s) => s.start));
    const dayEnd = Math.max(...regularSlots.map((s) => s.end));
    if (startMin < dayStart || endMin > dayEnd) {
      return `El horario debe estar entre ${timeLabel(dayStart)} y ${timeLabel(dayEnd)}.`;
    }

    return null;
  }

  async function handleCreateCustomSlot() {
    if (!selectedKey || !court) return;
    const startMin = parseTimeInput(customStart);
    const endMin = parseTimeInput(customEnd);
    if (startMin === null || endMin === null) {
      setError("Ingresá horarios válidos (HH:MM)");
      return;
    }
    if (endMin <= startMin) {
      setError("La hora de fin debe ser posterior a la de inicio");
      return;
    }
    const validationMsg = validateCustomSlotRange(startMin, endMin);
    if (validationMsg) {
      setError(validationMsg);
      return;
    }
    const price = Number(customPrice);
    if (!Number.isFinite(price) || price < 0) {
      setError("Precio inválido");
      return;
    }

    const cancelledSlots = slotsOverlappingRange(
      regularSlots,
      startMin,
      endMin,
    );

    setCreatingCustom(true);
    setError(null);
    const res = await createCourtCustomSlotAction(clubId, court.id, {
      date: selectedKey,
      startTimeMinutes: startMin,
      endTimeMinutes: endMin,
      price: Math.round(price),
      note: buildCustomSlotNote({
        name: customGuestName,
        phone: customPhone,
        note: customNote,
      }),
      cancelledSlots,
    });
    setCreatingCustom(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    const prevExcluded = exceptionsByDate[selectedKey]?.excluded ?? [];
    const mergedExcluded = [...prevExcluded];
    for (const slot of cancelledSlots) {
      if (
        !mergedExcluded.some(
          (e) => e.start === slot.start && e.end === slot.end,
        )
      ) {
        mergedExcluded.push(slot);
      }
    }

    setCustomSlotsByDate({
      ...customSlotsByDate,
      [selectedKey]: [...dayCustomSlots, res.slot],
    });
    setExceptionsByDate({
      ...exceptionsByDate,
      [selectedKey]: {
        allDayClosed: false,
        excluded: mergedExcluded,
      },
    });
    closeCustomForm();
    resetCustomFormFields();
    notifyReservationsRefresh();
    toast.success("Turno personalizado creado");
    onSaved?.();
  }

  async function handleDeleteCustomSlot(slotId: string) {
    if (!court || !selectedKey) return;
    const slot = dayCustomSlots.find((s) => s.id === slotId);
    if (!slot) return;

    setError(null);
    const res = await deleteCourtCustomSlotAction(clubId, court.id, slotId);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    const curr = exceptionsByDate[selectedKey];
    const nextExceptionsByDate = { ...exceptionsByDate };
    if (curr && !curr.allDayClosed) {
      const nextExcluded = curr.excluded.filter(
        (e) =>
          !minutesOverlap(
            e.start,
            e.end,
            slot.startTimeMinutes,
            slot.endTimeMinutes,
          ),
      );
      if (nextExcluded.length === 0) {
        delete nextExceptionsByDate[selectedKey];
      } else {
        nextExceptionsByDate[selectedKey] = {
          ...curr,
          excluded: nextExcluded,
        };
      }
    }

    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const exRes = await replaceCourtAvailabilityExceptionsAction(
      clubId,
      court.id,
      {
        month: monthKey,
        exceptions: buildMonthExceptionsPayload(
          nextExceptionsByDate,
          monthStart,
        ),
      },
    );
    if (!exRes.ok) {
      setError(exRes.error);
      return;
    }

    setCustomSlotsByDate({
      ...customSlotsByDate,
      [selectedKey]: dayCustomSlots.filter((s) => s.id !== slotId),
    });
    setExceptionsByDate(nextExceptionsByDate);
    notifyReservationsRefresh();
    toast.success("Turno personalizado eliminado");
    onSaved?.();
  }

  async function saveMonth() {
    if (!court) return;
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    setPending(true);
    const res = await replaceCourtAvailabilityExceptionsAction(
      clubId,
      court.id,
      {
        month: monthKey,
        exceptions: buildMonthExceptionsPayload(exceptionsByDate, monthStart),
      },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    notifyReservationsRefresh();
    toast.success("Excepciones guardadas");
    onSaved?.();
  }

  const daysWithCustom = useMemo(() => {
    const s = new Set<string>();
    for (const [date, rows] of Object.entries(customSlotsByDate)) {
      if (rows.length > 0) s.add(date);
    }
    return s;
  }, [customSlotsByDate]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeCustomForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="border-border bg-card max-h-[min(90vh,780px)] overflow-y-auto rounded-2xl p-6 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-[34px] leading-none font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        {selectableCourts && selectableCourts.length > 1 && onSelectCourt ? (
          <div className="space-y-1">
            <label htmlFor="availability-court-select" className="text-sm">
              Cancha
            </label>
            <select
              id="availability-court-select"
              className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm shadow-sm"
              value={court?.id ?? ""}
              onChange={(e) => onSelectCourt(e.target.value)}
            >
              {selectableCourts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <p className="text-muted-foreground text-sm">
          Seleccioná una fecha para cancelar turnos o crear horarios
          personalizados.
        </p>

        {error ? (
          <div
            ref={errorBannerRef}
            role="alert"
            className="border-destructive/50 bg-destructive/10 text-destructive flex gap-3 rounded-xl border px-4 py-3 text-sm"
          >
            <AlertCircle
              className="text-destructive mt-0.5 size-5 shrink-0"
              aria-hidden
            />
            <p className="min-w-0 flex-1 font-medium leading-snug">{error}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="border-border/80 rounded-2xl border p-3">
            <MiniMonthCalendar
              viewMonth={currentMonth}
              onViewMonthChange={setCurrentMonth}
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
                setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                closeCustomForm();
              }}
              highlightedDays={daysWithCustom}
            />
            <ul className="text-muted-foreground mt-4 space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#d4f542]" />
                Turno personalizado
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-destructive/80" />
                Cancelado (excepción)
              </li>
            </ul>
          </div>

          <div>
            {!selectedDate ? (
              <div className="text-muted-foreground flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed">
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
                    disabled={customFormOpen}
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
                  <>
                    {dayCustomSlots.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                          Turnos personalizados
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {dayCustomSlots.map((custom) => (
                            <div
                              key={custom.id}
                              className="border-[#c5e835]/70 bg-[#d4f542]/30 flex flex-col gap-1 rounded-2xl border px-4 py-3 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <span>
                                  {timeLabel(custom.startTimeMinutes)} -{" "}
                                  {timeLabel(custom.endTimeMinutes)}
                                </span>
                                <p className="text-muted-foreground mt-0.5 text-xs font-normal">
                                  {custom.note?.trim()
                                    ? custom.note.trim()
                                    : "Ocupado · sin nombre"}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-destructive"
                                aria-label="Eliminar turno personalizado"
                                onClick={() =>
                                  void handleDeleteCustomSlot(custom.id)
                                }
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {regularSlotsVisible.length === 0 &&
                    dayCustomSlots.length === 0 ? (
                      <p className="text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
                        No hay turnos configurados para este día.
                      </p>
                    ) : regularSlotsVisible.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {regularSlotsVisible.map((slot) => {
                          const excluded =
                            selectedState?.excluded.some(
                              (s) =>
                                s.start === slot.start && s.end === slot.end,
                            ) ?? false;
                          return (
                            <button
                              key={`${slot.start}-${slot.end}`}
                              type="button"
                              onClick={() => toggleSlot(slot)}
                              disabled={customFormOpen}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                                excluded
                                  ? "border-destructive/40 bg-destructive/8 text-destructive"
                                  : "border-border hover:bg-muted"
                              }`}
                            >
                              {excluded ? (
                                <span className="mr-1">×</span>
                              ) : null}
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {customFormOpen ? (
                      <div className="border-border space-y-4 rounded-2xl border p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">Nuevo turno custom</p>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Cerrar formulario"
                            onClick={closeCustomForm}
                          >
                            <X className="size-5" />
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-muted-foreground text-xs">
                              Inicio
                            </label>
                            <Input
                              type="time"
                              value={customStart}
                              onChange={(e) => setCustomStart(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground text-xs">
                              Fin
                            </label>
                            <Input
                              type="time"
                              value={customEnd}
                              onChange={(e) => setCustomEnd(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-muted-foreground text-xs">
                              Precio
                            </label>
                            <div className="relative">
                              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                                $
                              </span>
                              <Input
                                type="number"
                                min={0}
                                className="pl-7"
                                value={customPrice}
                                onChange={(e) => setCustomPrice(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground text-xs">
                              Teléfono (opcional)
                            </label>
                            <Input
                              type="tel"
                              placeholder="Ej: +54 9 11 1234-5678"
                              value={customPhone}
                              onChange={(e) => setCustomPhone(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-muted-foreground text-xs">
                              Nombre (opcional)
                            </label>
                            <Input
                              placeholder="Ej: Juan Pérez"
                              value={customGuestName}
                              onChange={(e) =>
                                setCustomGuestName(e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-muted-foreground text-xs">
                              Nota (opcional)
                            </label>
                            <Input
                              placeholder="Ej: Llamó Juan"
                              value={customNote}
                              onChange={(e) => setCustomNote(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          className="h-11 w-full rounded-xl font-semibold"
                          disabled={creatingCustom}
                          onClick={() => void handleCreateCustomSlot()}
                        >
                          {creatingCustom ? "Guardando…" : "Crear turno"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#c5e835]/60 bg-[#d4f542]/20 hover:bg-[#d4f542]/35 h-11 w-full rounded-xl font-semibold"
                        onClick={openCustomForm}
                      >
                        <Plus className="mr-2 size-4" />
                        Crear turno personalizado
                      </Button>
                    )}
                  </>
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
                    {date.slice(8, 10)}/{date.slice(5, 7)} - Día completo
                  </span>
                ) : (
                  st.excluded.map((s) => (
                    <span
                      key={`${date}-${s.start}-${s.end}`}
                      className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium"
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
      </DialogContent>
    </Dialog>
  );
}
