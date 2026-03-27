"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { getCourtSchedulesAction, updateCourtAction } from "@/actions/courts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  COURT_SLOT_DURATION_OPTIONS,
  dailyBlocksToCourtSchedulePayload,
  hhmmToMinutes,
} from "@/lib/court-schedule-map";
import type { CourtRecord, DailyScheduleBlocks } from "@/types/club";

type DayPrices = Record<keyof DailyScheduleBlocks, number>;

type PeriodConfig = {
  id: string;
  name: string;
  start: string;
  end: string;
  dailySchedule: DailyScheduleBlocks;
  dayPrices: DayPrices;
};

const DAY_ROWS: Array<{ key: keyof DailyScheduleBlocks; label: string; short: string }> = [
  { key: "monday", label: "Lunes", short: "Lun" },
  { key: "tuesday", label: "Martes", short: "Mar" },
  { key: "wednesday", label: "Miércoles", short: "Mié" },
  { key: "thursday", label: "Jueves", short: "Jue" },
  { key: "friday", label: "Viernes", short: "Vie" },
  { key: "saturday", label: "Sábado", short: "Sáb" },
  { key: "sunday", label: "Domingo", short: "Dom" },
];

const GROUPED_ROWS: Array<{
  key: "weekday" | "saturday" | "sunday";
  label: string;
}> = [
  { key: "weekday", label: "Lunes - Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const EMPTY_DAILY: DailyScheduleBlocks = {
  monday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
  tuesday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
  wednesday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
  thursday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
  friday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
  saturday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
  sunday: { enabled: false, startTime: "07:00", endTime: "23:00", slotDurationMinutes: 60 },
};

const EMPTY_PRICES: DayPrices = {
  monday: 0,
  tuesday: 0,
  wednesday: 0,
  thursday: 0,
  friday: 0,
  saturday: 0,
  sunday: 0,
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function nextMonthIsoDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

function newPeriodDraft(): PeriodConfig {
  return {
    id: `period-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    start: todayIsoDate(),
    end: nextMonthIsoDate(),
    dailySchedule: { ...EMPTY_DAILY },
    dayPrices: { ...EMPTY_PRICES },
  };
}

function dayOfWeekToKey(dayOfWeek: number): keyof DailyScheduleBlocks {
  if (dayOfWeek === 1) return "monday";
  if (dayOfWeek === 2) return "tuesday";
  if (dayOfWeek === 3) return "wednesday";
  if (dayOfWeek === 4) return "thursday";
  if (dayOfWeek === 5) return "friday";
  if (dayOfWeek === 6) return "saturday";
  return "sunday";
}

function groupedFromDaily(daily: DailyScheduleBlocks) {
  return {
    weekday: { ...daily.monday },
    saturday: { ...daily.saturday },
    sunday: { ...daily.sunday },
  };
}

function applyGroupedToDaily(
  daily: DailyScheduleBlocks,
  group: "weekday" | "saturday" | "sunday",
  updater: (current: DailyScheduleBlocks[keyof DailyScheduleBlocks]) => DailyScheduleBlocks[keyof DailyScheduleBlocks],
): DailyScheduleBlocks {
  if (group === "weekday") {
    const next = updater(daily.monday);
    return {
      ...daily,
      monday: { ...next },
      tuesday: { ...next },
      wednesday: { ...next },
      thursday: { ...next },
      friday: { ...next },
    };
  }
  if (group === "saturday") return { ...daily, saturday: updater(daily.saturday) };
  return { ...daily, sunday: updater(daily.sunday) };
}

function areBlocksEqual(
  a: DailyScheduleBlocks[keyof DailyScheduleBlocks],
  b: DailyScheduleBlocks[keyof DailyScheduleBlocks],
) {
  return (
    a.enabled === b.enabled &&
    a.startTime === b.startTime &&
    a.endTime === b.endTime &&
    a.slotDurationMinutes === b.slotDurationMinutes
  );
}

function validateDailySchedule(blocks: DailyScheduleBlocks): string | null {
  for (const k of Object.keys(blocks) as Array<keyof DailyScheduleBlocks>) {
    const b = blocks[k];
    if (!b.enabled) continue;
    if (hhmmToMinutes(b.endTime) <= hhmmToMinutes(b.startTime)) {
      return "La hora de fin debe ser posterior a la de inicio en cada franja activa.";
    }
  }
  return null;
}

type CourtScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: string;
  court: CourtRecord | null;
  onSaved: () => void;
};

export function CourtScheduleDialog({
  open,
  onOpenChange,
  clubId,
  court,
  onSaved,
}: CourtScheduleDialogProps) {
  const [periods, setPeriods] = useState<PeriodConfig[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<PeriodConfig>(newPeriodDraft());
  const [scheduleMode, setScheduleMode] = useState<"grouped" | "daily">("grouped");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(
    () => `Horarios de ${court?.name ?? "Cancha"}`,
    [court?.name],
  );

  useEffect(() => {
    if (!open || !court) return;
    let active = true;
    setLoading(true);
    setError(null);
    setViewMode("list");
    setEditingIndex(null);

    void getCourtSchedulesAction(clubId, court.id).then((res) => {
      if (!active) return;
      if (!res.ok || res.rows.length === 0) {
        setPeriods([]);
        setLoading(false);
        return;
      }

      const grouped = new Map<string, PeriodConfig>();
      for (const row of res.rows) {
        const legacy = row as unknown as {
          period_name?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          price_per_hour?: number;
        };
        const periodName = row.periodName ?? legacy.period_name ?? "Sin nombre";
        const periodStart = (
          row.periodStart ??
          legacy.period_start ??
          todayIsoDate()
        ).slice(0, 10);
        const periodEnd = (
          row.periodEnd ??
          legacy.period_end ??
          nextMonthIsoDate()
        ).slice(0, 10);
        const groupKey = `${periodName}__${periodStart}__${periodEnd}`;
        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, {
            id: `period-${grouped.size + 1}`,
            name: periodName,
            start: periodStart,
            end: periodEnd,
            dailySchedule: { ...EMPTY_DAILY },
            dayPrices: { ...EMPTY_PRICES },
          });
        }
        const current = grouped.get(groupKey)!;
        const key = dayOfWeekToKey(row.dayOfWeek);
        current.dailySchedule[key] = {
          enabled: true,
          startTime: String(Math.floor(row.startTimeMinutes / 60)).padStart(2, "0") +
            ":" +
            String(row.startTimeMinutes % 60).padStart(2, "0"),
          endTime: String(Math.floor(row.endTimeMinutes / 60)).padStart(2, "0") +
            ":" +
            String(row.endTimeMinutes % 60).padStart(2, "0"),
          slotDurationMinutes: row.slotDurationMinutes,
        };
        current.dayPrices[key] = row.pricePerHour ?? legacy.price_per_hour ?? 0;
      }
      setPeriods(Array.from(grouped.values()));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [open, clubId, court]);

  async function persistPeriods(nextPeriods: PeriodConfig[]) {
    if (!court) return { ok: false as const, error: "Cancha inválida" };
    const payload = nextPeriods.flatMap((period) =>
      dailyBlocksToCourtSchedulePayload(period.dailySchedule).map((row) => ({
        ...row,
        pricePerHour: period.dayPrices[dayOfWeekToKey(row.dayOfWeek)],
        periodName: period.name.trim(),
        periodStart: period.start,
        periodEnd: period.end,
      })),
    );
    const fallback = nextPeriods[0]?.dailySchedule ?? EMPTY_DAILY;
    return updateCourtAction(clubId, court.id, {
      name: court.name,
      type: court.type === "outdoor" ? "outdoor" : "indoor",
      surface: court.surface,
      lighting: court.lighting,
      schedule: {
        weekday: fallback.monday,
        saturday: fallback.saturday,
        sunday: fallback.sunday,
      },
      schedulesPayload: payload,
    });
  }

  function openCreatePeriod() {
    setDraft(newPeriodDraft());
    setEditingIndex(null);
    setScheduleMode("grouped");
    setViewMode("edit");
    setError(null);
  }

  function openEditPeriod(index: number) {
    const period = periods[index];
    setDraft(JSON.parse(JSON.stringify(period)) as PeriodConfig);
    setEditingIndex(index);
    const d = period.dailySchedule;
    const p = period.dayPrices;
    const weekdayBlocksEqual =
      areBlocksEqual(d.monday, d.tuesday) &&
      areBlocksEqual(d.monday, d.wednesday) &&
      areBlocksEqual(d.monday, d.thursday) &&
      areBlocksEqual(d.monday, d.friday);
    const weekdayPricesEqual =
      p.monday === p.tuesday &&
      p.monday === p.wednesday &&
      p.monday === p.thursday &&
      p.monday === p.friday;
    setScheduleMode(weekdayBlocksEqual && weekdayPricesEqual ? "grouped" : "daily");
    setViewMode("edit");
    setError(null);
  }

  async function handleDeletePeriod(index: number) {
    const next = periods.filter((_, i) => i !== index);
    setPending(true);
    const res = await persistPeriods(next);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setPeriods(next);
    setError(null);
    onSaved();
  }

  async function handleSaveDraft() {
    const msg = validateDailySchedule(draft.dailySchedule);
    if (msg) return setError(msg);
    if (!draft.name.trim()) return setError("El nombre del período es obligatorio.");
    if (!draft.start || !draft.end || draft.start > draft.end) {
      return setError("Rango de fechas inválido para el período.");
    }
    const hasAnyEnabled = Object.values(draft.dailySchedule).some((b) => b.enabled);
    if (!hasAnyEnabled) {
      return setError("Debes habilitar al menos un día para el período.");
    }

    const next = [...periods];
    if (editingIndex === null) next.push(draft);
    else next[editingIndex] = draft;

    setPending(true);
    const res = await persistPeriods(next);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setPeriods(next);
    setViewMode("list");
    setEditingIndex(null);
    setError(null);
    onSaved();
  }

  function formatDate(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  function renderPeriodList() {
    return (
      <div className="space-y-4">
        {periods.length === 0 ? (
          <div className="border-border/80 text-muted-foreground rounded-2xl border px-4 py-8 text-center text-sm">
            No hay períodos configurados. Añadí uno para definir horarios de esta cancha.
          </div>
        ) : (
          periods.map((period, idx) => (
            <section key={period.id} className="border-border/80 rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{period.name || "Sin nombre"}</h3>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(period.start)} - {formatDate(period.end)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditPeriod(idx)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Editar período"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeletePeriod(idx)}
                    className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Eliminar período"
                    disabled={pending}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {DAY_ROWS.map(({ key, short }) => {
                  const b = period.dailySchedule[key];
                  return b.enabled ? (
                    <span
                      key={key}
                      className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                    >
                      {short}: {b.startTime}-{b.endTime} - ${period.dayPrices[key]}
                    </span>
                  ) : (
                    <span
                      key={key}
                      className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                    >
                      {short}: <X className="size-3" />
                    </span>
                  );
                })}
              </div>
            </section>
          ))
        )}
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-xl border-dashed"
          onClick={openCreatePeriod}
          disabled={pending}
        >
          <Plus className="mr-2 size-4" />
          Añadir período
        </Button>
      </div>
    );
  }

  function renderPeriodEditor() {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setViewMode("list");
            setError(null);
          }}
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          ← Volver a períodos
        </button>

        <section className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="period-name" className="text-sm">
              Nombre del período
            </Label>
            <Input
              id="period-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Ej: Temporada Abril"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="period-start" className="text-sm">
                Desde
              </Label>
              <Input
                id="period-start"
                type="date"
                value={draft.start}
                onChange={(e) => setDraft({ ...draft, start: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="period-end" className="text-sm">
                Hasta
              </Label>
              <Input
                id="period-end"
                type="date"
                value={draft.end}
                onChange={(e) => setDraft({ ...draft, end: e.target.value })}
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setScheduleMode("grouped")}
            className={`border-border rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              scheduleMode === "grouped"
                ? "bg-primary/15 text-primary border-primary/30"
                : "hover:bg-muted/80"
            }`}
          >
            Lunes a viernes
          </button>
          <button
            type="button"
            onClick={() => setScheduleMode("daily")}
            className={`border-border rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              scheduleMode === "daily"
                ? "bg-primary/15 text-primary border-primary/30"
                : "hover:bg-muted/80"
            }`}
          >
            Configurar por día
          </button>
        </div>

        {(scheduleMode === "daily" ? DAY_ROWS : GROUPED_ROWS).map((row) => {
          const key = row.key;
          const label = row.label;
          const block =
            scheduleMode === "daily"
              ? draft.dailySchedule[key as keyof DailyScheduleBlocks]
              : groupedFromDaily(draft.dailySchedule)[key as "weekday" | "saturday" | "sunday"];
          const knownSlot = COURT_SLOT_DURATION_OPTIONS.some(
            (o) => o.minutes === block.slotDurationMinutes,
          );
          const priceKey =
            scheduleMode === "daily"
              ? (key as keyof DailyScheduleBlocks)
              : key === "weekday"
                ? "monday"
                : (key as "saturday" | "sunday");
          const priceValue = draft.dayPrices[priceKey];

          const setBlock = (
            updater: (
              current: DailyScheduleBlocks[keyof DailyScheduleBlocks],
            ) => DailyScheduleBlocks[keyof DailyScheduleBlocks],
          ) => {
            if (scheduleMode === "daily") {
              const dayKey = key as keyof DailyScheduleBlocks;
              setDraft({
                ...draft,
                dailySchedule: {
                  ...draft.dailySchedule,
                  [dayKey]: updater(draft.dailySchedule[dayKey]),
                },
              });
              return;
            }
            setDraft({
              ...draft,
              dailySchedule: applyGroupedToDaily(
                draft.dailySchedule,
                key as "weekday" | "saturday" | "sunday",
                updater,
              ),
            });
          };

          const setPrice = (nextPrice: number) => {
            if (scheduleMode === "daily") {
              setDraft({
                ...draft,
                dayPrices: { ...draft.dayPrices, [priceKey]: nextPrice },
              });
              return;
            }
            if (key === "weekday") {
              setDraft({
                ...draft,
                dayPrices: {
                  ...draft.dayPrices,
                  monday: nextPrice,
                  tuesday: nextPrice,
                  wednesday: nextPrice,
                  thursday: nextPrice,
                  friday: nextPrice,
                },
              });
              return;
            }
            setDraft({
              ...draft,
              dayPrices: { ...draft.dayPrices, [priceKey]: nextPrice },
            });
          };

          return (
            <section key={key} className="border-border/80 space-y-4 rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-foreground text-xl font-semibold">{label}</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`period-${key}-enabled`} className="text-sm">
                    Abre
                  </Label>
                  <Switch
                    id={`period-${key}-enabled`}
                    checked={block.enabled}
                    onCheckedChange={(checked) =>
                      setBlock((current) => ({ ...current, enabled: checked }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`period-${key}-start`} className="text-sm">
                    Inicio
                  </Label>
                  <Input
                    id={`period-${key}-start`}
                    type="time"
                    value={block.startTime}
                    disabled={!block.enabled}
                    onChange={(e) =>
                      setBlock((current) => ({ ...current, startTime: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`period-${key}-end`} className="text-sm">
                    Fin
                  </Label>
                  <Input
                    id={`period-${key}-end`}
                    type="time"
                    value={block.endTime}
                    disabled={!block.enabled}
                    onChange={(e) =>
                      setBlock((current) => ({ ...current, endTime: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`period-${key}-slot`} className="text-sm">
                    Duración
                  </Label>
                  <select
                    id={`period-${key}-slot`}
                    value={block.slotDurationMinutes}
                    disabled={!block.enabled}
                    onChange={(e) =>
                      setBlock((current) => ({
                        ...current,
                        slotDurationMinutes: Number.parseInt(e.target.value, 10),
                      }))
                    }
                    className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                  >
                    {COURT_SLOT_DURATION_OPTIONS.map((o) => (
                      <option key={o.minutes} value={o.minutes}>
                        {o.label}
                      </option>
                    ))}
                    {!knownSlot ? (
                      <option value={block.slotDurationMinutes}>
                        {block.slotDurationMinutes} min (guardado)
                      </option>
                    ) : null}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`period-${key}-price`} className="text-sm">
                    Precio
                  </Label>
                  <div className="border-input bg-background flex h-10 items-center rounded-lg border px-3">
                    <span className="text-muted-foreground mr-2 text-sm">$</span>
                    <input
                      id={`period-${key}-price`}
                      type="number"
                      min={0}
                      step="1"
                      value={priceValue}
                      disabled={!block.enabled}
                      onChange={(e) =>
                        setPrice(Number.parseInt(e.target.value || "0", 10))
                      }
                      className="text-foreground w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <Button
          type="button"
          className="h-11 w-full rounded-xl text-base font-semibold"
          disabled={pending}
          onClick={() => void handleSaveDraft()}
        >
          {pending ? "Guardando..." : "Guardar período"}
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card max-h-[min(90vh,780px)] overflow-y-auto rounded-2xl p-6 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-[32px] leading-none font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground py-8 text-center text-sm">Cargando horarios...</p>
        ) : viewMode === "list" ? (
          renderPeriodList()
        ) : (
          renderPeriodEditor()
        )}

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
