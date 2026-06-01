"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Plus, X } from "lucide-react";

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
  onSaved: () => void;
};

type RegularSlot = { start: number; end: number; label: string };
type DateState = {
  allDayClosed: boolean;
  excluded: Array<{ start: number; end: number }>;
};

type CustomWizardPhase = null | "pick" | "define";

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
  const [customWizard, setCustomWizard] = useState<CustomWizardPhase>(null);
  const [customStart, setCustomStart] = useState("10:00");
  const [customEnd, setCustomEnd] = useState("11:30");
  const [customPrice, setCustomPrice] = useState("0");
  const [customGuestName, setCustomGuestName] = useState("");
  const [creatingCustom, setCreatingCustom] = useState(false);

  const title = `Gestionar disponibilidad - ${court?.name?.trim() || "Cancha"}`;
  const monthKey = toMonthKey(currentMonth);

  function exitCustomWizard() {
    setCustomWizard(null);
    setError(null);
  }

  function startCustomWizard() {
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
    if (regularSlots.length === 0) {
      setError(
        "No hay turnos regulares este día. Configurá horarios en la cancha.",
      );
      return;
    }
    setError(null);
    setCustomWizard("pick");
  }

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
      setCustomWizard(null);
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

  const wizardExcluded = selectedState?.excluded ?? [];

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
    if (!selectedKey || customWizard === "define") return;
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
    if (customWizard === "pick") setError(null);
  }

  function toggleAllDay() {
    if (!selectedKey || customWizard) return;
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

  function tryContinueToDefine() {
    if (wizardExcluded.length === 0) {
      setError(
        "Primero cancelá los turnos del horario habitual que querés reemplazar (tocá cada turno para marcarlo en rojo).",
      );
      return;
    }
    setError(null);
    setCustomWizard("define");
  }

  function validateCustomAgainstCancellations(
    startMin: number,
    endMin: number,
    excluded: Array<{ start: number; end: number }>,
  ): string | null {
    const overlapping = regularSlots.filter((s) =>
      minutesOverlap(startMin, endMin, s.start, s.end),
    );
    if (overlapping.length === 0) {
      return null;
    }
    const missing = overlapping.filter(
      (s) => !excluded.some((e) => e.start === s.start && e.end === s.end),
    );
    if (missing.length > 0) {
      const m = missing[0]!;
      return `Cancelá también el turno ${timeLabel(m.start)}-${timeLabel(m.end)}: forma parte del horario que querés reemplazar.`;
    }
    if (
      !excluded.some((e) => minutesOverlap(startMin, endMin, e.start, e.end))
    ) {
      return "Seleccioná al menos un turno cancelado que se solape con el horario personalizado que querés crear.";
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
    const validationMsg = validateCustomAgainstCancellations(
      startMin,
      endMin,
      wizardExcluded,
    );
    if (validationMsg) {
      setError(validationMsg);
      if (customWizard !== "pick") setCustomWizard("pick");
      return;
    }
    const price = Number(customPrice);
    if (!Number.isFinite(price) || price < 0) {
      setError("Precio inválido");
      return;
    }

    setCreatingCustom(true);
    setError(null);
    const res = await createCourtCustomSlotAction(clubId, court.id, {
      date: selectedKey,
      startTimeMinutes: startMin,
      endTimeMinutes: endMin,
      price: Math.round(price),
      note: customGuestName.trim() || undefined,
      cancelledSlots: wizardExcluded,
    });
    setCreatingCustom(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setCustomSlotsByDate({
      ...customSlotsByDate,
      [selectedKey]: [...dayCustomSlots, res.slot],
    });
    setExceptionsByDate({
      ...exceptionsByDate,
      [selectedKey]: {
        allDayClosed: false,
        excluded: wizardExcluded,
      },
    });
    exitCustomWizard();
    setCustomGuestName("");
    onSaved();
  }

  async function handleDeleteCustomSlot(slotId: string) {
    if (!court || !selectedKey) return;
    setError(null);
    const res = await deleteCourtCustomSlotAction(clubId, court.id, slotId);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCustomSlotsByDate({
      ...customSlotsByDate,
      [selectedKey]: dayCustomSlots.filter((s) => s.id !== slotId),
    });
    onSaved();
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
      { month: monthKey, exceptions },
    );
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onSaved();
    onOpenChange(false);
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
        if (!next) exitCustomWizard();
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
          {customWizard === "pick"
            ? "Paso 1: Tocá los turnos habituales que querés reemplazar (quedan en rojo)."
            : customWizard === "define"
              ? "Paso 2: Definí el horario personalizado. Al crear, se cancelan esos turnos y se agrega el turno personalizado en un solo paso."
              : "Seleccioná una fecha para cancelar turnos o crear horarios personalizados."}
        </p>

        {customWizard ? (
          <div
            className={
              customWizard === "pick"
                ? "border-destructive/30 bg-destructive/5 rounded-xl border px-4 py-3 text-sm"
                : "border-[#c5e835]/60 bg-[#d4f542]/15 rounded-xl border px-4 py-3 text-sm"
            }
          >
            {customWizard === "pick" ? (
              <p>
                <strong>Paso 1 de 2:</strong> Marcá en rojo cada turno del
                horario que vas a reemplazar. Después continuá al paso 2.
              </p>
            ) : (
              <p>
                <strong>Paso 2 de 2:</strong> Horario personalizado. Se guardará
                junto con las cancelaciones seleccionadas.
              </p>
            )}
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
                exitCustomWizard();
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
                  {!customWizard ? (
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
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={exitCustomWizard}
                    >
                      Salir del asistente
                    </Button>
                  )}
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
                              {!customWizard ? (
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
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {customWizard !== "define" ? (
                      <>
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
                                    s.start === slot.start &&
                                    s.end === slot.end,
                                ) ?? false;
                              const highlightPick =
                                customWizard === "pick" && excluded;
                              return (
                                <button
                                  key={`${slot.start}-${slot.end}`}
                                  type="button"
                                  onClick={() => toggleSlot(slot)}
                                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                                    excluded
                                      ? "border-destructive/40 bg-destructive/8 text-destructive"
                                      : customWizard === "pick"
                                        ? "border-primary/40 ring-primary/20 hover:bg-primary/5 ring-2"
                                        : "border-border hover:bg-muted"
                                  } ${highlightPick ? "ring-destructive/30" : ""}`}
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
                      </>
                    ) : null}

                    {customWizard === "pick" ? (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          className="h-11 flex-1 rounded-xl font-semibold"
                          onClick={tryContinueToDefine}
                        >
                          Continuar — definir horario personalizado
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 rounded-xl"
                          onClick={exitCustomWizard}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : null}

                    {customWizard === "define" ? (
                      <div className="border-border space-y-3 rounded-2xl border p-4">
                        <p className="font-semibold">
                          Nuevo turno personalizado
                        </p>
                        {wizardExcluded.length > 0 ? (
                          <p className="text-muted-foreground text-xs">
                            Se cancelarán:{" "}
                            {wizardExcluded
                              .map(
                                (s) =>
                                  `${timeLabel(s.start)}-${timeLabel(s.end)}`,
                              )
                              .join(", ")}
                          </p>
                        ) : null}
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
                          <div className="space-y-1">
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
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-muted-foreground text-xs">
                              Nombre del jugador
                            </label>
                            <Input
                              placeholder="Ej: Juan Pérez"
                              value={customGuestName}
                              onChange={(e) =>
                                setCustomGuestName(e.target.value)
                              }
                            />
                            <p className="text-muted-foreground text-xs">
                              Se guarda como nota interna y se muestra en
                              reservas.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            type="button"
                            className="h-11 flex-1 rounded-xl font-semibold"
                            disabled={creatingCustom}
                            onClick={() => void handleCreateCustomSlot()}
                          >
                            {creatingCustom
                              ? "Guardando…"
                              : "Crear turno personalizado"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-xl"
                            onClick={() => {
                              setError(null);
                              setCustomWizard("pick");
                            }}
                          >
                            Volver al paso 1
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {!customWizard ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#c5e835]/60 bg-[#d4f542]/20 hover:bg-[#d4f542]/35 h-11 w-full rounded-xl font-semibold"
                        onClick={startCustomWizard}
                      >
                        <Plus className="mr-2 size-4" />
                        Crear turno personalizado
                      </Button>
                    ) : null}
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
            disabled={loading || pending || !!customWizard}
          >
            {pending ? "Guardando..." : "Listo"}
          </Button>
          {customWizard ? (
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Terminá el asistente de turno personalizado antes de cerrar con
              Listo.
            </p>
          ) : null}
        </div>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
