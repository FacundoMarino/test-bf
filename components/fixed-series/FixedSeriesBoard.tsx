"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getCourtSchedulesAction } from "@/actions/courts";
import {
  cancelFixedSeriesAction,
  createFixedSeriesAction,
} from "@/actions/fixed-series";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CourtScheduleRow } from "@/lib/court-schedule-map";
import {
  DAY_LABELS,
  addMinutes,
  alignDateToDayOfWeek,
  normalizeDateYmd,
  buildFixedSeriesStartTimeOptions,
  buildNonEmptyDaySections,
  formatDatePill,
  groupFixedSeriesByDay,
  initialFixedSeriesForm,
  parseHmToMinutes,
  parseYmd,
  scheduleActiveInRange,
  toHm,
  validateSeriesDateRange,
  validateSubmitBasics,
  type FixedSeriesFormState,
} from "@/lib/fixed-series/fixed-series-board-utils";
import type { FixedSeriesView } from "@/lib/turnos-fijos/aggregate-fixed-series";

type CourtOption = { id: string; name: string };

export function FixedSeriesBoard({
  clubId,
  courts,
  initialSeries,
}: {
  clubId: string;
  courts: CourtOption[];
  initialSeries: FixedSeriesView[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingSeries, setEditingSeries] = useState<FixedSeriesView | null>(
    null,
  );
  const [deleteConfirmSeries, setDeleteConfirmSeries] =
    useState<FixedSeriesView | null>(null);
  const [isDeletingSeries, setIsDeletingSeries] = useState(false);
  const [form, setForm] = useState<FixedSeriesFormState>(() =>
    initialFixedSeriesForm(courts[0]?.id ?? ""),
  );
  const [scheduleRows, setScheduleRows] = useState<CourtScheduleRow[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  const grouped = useMemo(
    () => groupFixedSeriesByDay(initialSeries),
    [initialSeries],
  );

  const sections = useMemo(() => buildNonEmptyDaySections(grouped), [grouped]);

  const total = initialSeries.length;

  const rangeStart = useMemo(
    () => parseYmd(form.startDate) ?? new Date(),
    [form.startDate],
  );

  const rangeEnd = useMemo(() => {
    const parsedEnd = parseYmd(form.endDate);
    return (
      parsedEnd ??
      new Date(
        rangeStart.getFullYear() + 10,
        rangeStart.getMonth(),
        rangeStart.getDate(),
      )
    );
  }, [form.endDate, rangeStart]);

  const schedulesForCourt = useMemo(
    () => (form.courtId ? scheduleRows : []),
    [form.courtId, scheduleRows],
  );

  const activeSchedules = useMemo(
    () =>
      schedulesForCourt.filter((row) =>
        scheduleActiveInRange(row, rangeStart, rangeEnd),
      ),
    [rangeStart, rangeEnd, schedulesForCourt],
  );

  const dayOptions = useMemo(() => {
    const set = new Set<number>();
    for (const row of activeSchedules) set.add(row.dayOfWeek);
    return [...set].sort((a, b) => a - b);
  }, [activeSchedules]);

  const effectiveDayOfWeek = useMemo(() => {
    if (!dayOptions.length) return form.dayOfWeek;
    return dayOptions.includes(form.dayOfWeek) ? form.dayOfWeek : dayOptions[0];
  }, [dayOptions, form.dayOfWeek]);

  const startTimeOptions = useMemo(
    () =>
      buildFixedSeriesStartTimeOptions(
        activeSchedules,
        effectiveDayOfWeek,
        form.durationMinutes,
      ),
    [activeSchedules, effectiveDayOfWeek, form.durationMinutes],
  );

  const effectiveStartTime = useMemo(() => {
    if (!startTimeOptions.length) return form.startTime;
    const selected = parseHmToMinutes(form.startTime);
    return startTimeOptions.includes(selected)
      ? form.startTime
      : toHm(startTimeOptions[0]);
  }, [form.startTime, startTimeOptions]);

  const selectedDaySchedules = useMemo(
    () => schedulesForCourt.filter((s) => s.dayOfWeek === effectiveDayOfWeek),
    [effectiveDayOfWeek, schedulesForCourt],
  );

  const startDateMin = useMemo(() => {
    const values = selectedDaySchedules
      .map((s) => s.periodStart)
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    return values.length ? values.sort()[0] : undefined;
  }, [selectedDaySchedules]);

  const startDateMax = useMemo(() => {
    const openEnd = selectedDaySchedules.some((s) => !s.periodEnd);
    if (openEnd) return undefined;
    const values = selectedDaySchedules
      .map((s) => s.periodEnd)
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    return values.length ? values.sort()[values.length - 1] : undefined;
  }, [selectedDaySchedules]);

  useEffect(() => {
    if (!form.courtId) return;

    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setSchedulesLoading(true);
      try {
        const res = await getCourtSchedulesAction(clubId, form.courtId);
        if (cancelled) return;
        if (!res.ok) {
          toast.error(res.error);
          setScheduleRows([]);
          return;
        }
        setScheduleRows(res.rows);
      } finally {
        if (!cancelled) setSchedulesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clubId, form.courtId]);

  const handleDialogOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setEditingSeries(null);
  }, []);

  const handleCancelClick = useCallback(() => {
    setOpen(false);
    setEditingSeries(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingSeries(null);
    setForm(initialFixedSeriesForm(courts[0]?.id ?? ""));
    setOpen(true);
  }, [courts]);

  const handleOpenEdit = useCallback((item: FixedSeriesView) => {
    setEditingSeries(item);
    setForm({
      guestName: item.guestName,
      guestPhone: item.guestPhone ?? "",
      courtId: item.courtId,
      dayOfWeek: item.dayOfWeek,
      startTime: toHm(item.startTimeMinutes),
      durationMinutes: item.durationMinutes,
      startDate: item.startDate.slice(0, 10),
      endDate: item.endDate?.slice(0, 10) ?? "",
      notes: item.notes ?? "",
    });
    setOpen(true);
  }, []);

  const handleCourtChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const courtId = e.target.value;
    setForm((p) => ({ ...p, courtId }));
  }, []);

  const handleDayOfWeekChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const nextDow = Number(e.target.value);
      setForm((p) => ({
        ...p,
        dayOfWeek: nextDow,
        startDate: alignDateToDayOfWeek(p.startDate, nextDow),
      }));
    },
    [],
  );

  const handleStartTimeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const minutes = Number(e.target.value);
      setForm((p) => ({ ...p, startTime: toHm(minutes) }));
    },
    [],
  );

  const handleDurationChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({
        ...p,
        durationMinutes: Number(e.target.value || "0"),
      }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const basicsError = validateSubmitBasics({
      guestName: form.guestName,
      courtId: form.courtId,
      startDate: form.startDate,
      durationMinutes: form.durationMinutes,
      dayOptions,
      startTimeOptions,
      effectiveDayOfWeek,
      effectiveStartHm: effectiveStartTime,
    });
    if (basicsError) {
      toast.error(basicsError);
      return;
    }

    const alignedStartDate = alignDateToDayOfWeek(
      form.startDate,
      effectiveDayOfWeek,
    );
    const endDateYmd = form.endDate.trim()
      ? normalizeDateYmd(form.endDate)
      : "";

    const dateErr = validateSeriesDateRange(alignedStartDate, endDateYmd);
    if (dateErr) {
      toast.error(dateErr);
      return;
    }

    startTransition(async () => {
      if (editingSeries) {
        const cancelled = await cancelFixedSeriesAction({
          clubId,
          seriesId: editingSeries.id,
          bookingIds: editingSeries.bookingIds,
        });
        if (!cancelled.ok) {
          toast.error(cancelled.error);
          return;
        }
      }

      const res = await createFixedSeriesAction({
        clubId,
        courtId: form.courtId,
        dayOfWeek: effectiveDayOfWeek,
        startDate: alignedStartDate,
        endDate: endDateYmd || undefined,
        startTimeMinutes: parseHmToMinutes(effectiveStartTime),
        durationMinutes: form.durationMinutes,
        guestName: form.guestName.trim(),
        guestPhone: form.guestPhone.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      setOpen(false);
      setEditingSeries(null);
      toast.success(
        editingSeries ? "Turno fijo actualizado" : "Turno fijo creado",
      );
      window.location.reload();
    });
  }, [
    clubId,
    dayOptions,
    editingSeries,
    effectiveDayOfWeek,
    effectiveStartTime,
    form.courtId,
    form.durationMinutes,
    form.endDate,
    form.guestName,
    form.guestPhone,
    form.notes,
    form.startDate,
    startTimeOptions,
  ]);

  const handleRemoveSeries = useCallback(
    (item: FixedSeriesView) => {
      setDeleteConfirmSeries(item);
    },
    [],
  );

  const handleConfirmRemoveSeries = useCallback(() => {
    if (!deleteConfirmSeries || isDeletingSeries) return;
    setIsDeletingSeries(true);
    void (async () => {
      const res = await cancelFixedSeriesAction({
        clubId,
        seriesId: deleteConfirmSeries.id,
        bookingIds: deleteConfirmSeries.bookingIds,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Turno fijo eliminado");
      window.location.reload();
    })().finally(() => {
      setIsDeletingSeries(false);
    });
  }, [clubId, deleteConfirmSeries, isDeletingSeries]);

  const closeDeleteConfirm = useCallback(() => {
    if (isDeletingSeries) return;
    setDeleteConfirmSeries(null);
  }, [isDeletingSeries]);

  const submitDisabled =
    isPending ||
    schedulesLoading ||
    dayOptions.length === 0 ||
    startTimeOptions.length === 0;

  const submitLabel = isPending
    ? "Guardando..."
    : editingSeries
      ? "Guardar cambios"
      : "Crear turno fijo";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Turnos fijos</h1>
          <p className="text-muted-foreground text-sm">
            Reservas recurrentes semanales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground rounded-md border px-2 py-1 text-xs">
            {total} turnos
          </span>
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="font-semibold"
          >
            <Plus className="mr-2 size-4" />
            Nuevo turno fijo
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map(({ dayLabel, rows }) => (
          <section key={dayLabel} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="text-muted-foreground size-4" />
              <span>{dayLabel}</span>
              <span className="text-muted-foreground text-xs">
                ({rows.length})
              </span>
            </div>

            <ul className="space-y-3">
              {rows.map((row) => {
                const end = addMinutes(
                  row.startTimeMinutes,
                  row.durationMinutes,
                );
                return (
                  <li
                    key={row.id}
                    className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-18px_rgba(12,36,84,0.7)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="font-semibold">{row.guestName}</p>
                        {row.guestPhone ? (
                          <p className="text-muted-foreground text-xs">
                            {row.guestPhone}
                          </p>
                        ) : null}
                        <p className="text-sm font-medium">
                          {toHm(row.startTimeMinutes)} - {toHm(end)}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="size-3.5" />
                          {row.courtName}
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="rounded-full border px-2 py-0.5">
                            Desde {formatDatePill(row.startDate)}
                          </span>
                          <span className="rounded-full border px-2 py-0.5">
                            {row.endDate
                              ? `Hasta ${formatDatePill(row.endDate)}`
                              : "Indefinido"}
                          </span>
                        </div>
                        {row.notes ? (
                          <p className="text-muted-foreground rounded-md bg-muted/40 px-2 py-1 text-xs">
                            {row.notes}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground hover:bg-[#DFFE2F] inline-flex size-8 items-center justify-center rounded-md transition-colors"
                          title="Editar"
                          onClick={() => handleOpenEdit(row)}
                          disabled={isDeletingSeries}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="text-destructive hover:bg-[#DFFE2F] inline-flex size-8 items-center justify-center rounded-md transition-colors"
                          title="Eliminar"
                          onClick={() => handleRemoveSeries(row)}
                          disabled={isDeletingSeries}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSeries ? "Editar turno fijo" : "Nuevo turno fijo"}
            </DialogTitle>
            <DialogDescription>
              Reserva semanal recurrente para una cancha.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nombre del jugador</Label>
              <Input
                value={form.guestName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, guestName: e.target.value }))
                }
                placeholder="Ej: Nicolas Ramirez"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Telefono</Label>
              <Input
                value={form.guestPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, guestPhone: e.target.value }))
                }
                placeholder="+54 9 ..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Cancha</Label>
              <select
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={form.courtId}
                onChange={handleCourtChange}
              >
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Dia de la semana</Label>
              <select
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={effectiveDayOfWeek}
                disabled={schedulesLoading || dayOptions.length === 0}
                onChange={handleDayOfWeekChange}
              >
                {dayOptions.map((i) => (
                  <option key={i} value={i}>
                    {DAY_LABELS[i]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Hora de inicio</Label>
              <select
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={parseHmToMinutes(effectiveStartTime)}
                disabled={schedulesLoading || startTimeOptions.length === 0}
                onChange={handleStartTimeChange}
              >
                {startTimeOptions.map((m) => (
                  <option key={m} value={m}>
                    {toHm(m)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Duracion (minutos)</Label>
              <Input
                type="number"
                min={15}
                max={360}
                value={form.durationMinutes}
                onChange={handleDurationChange}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Desde</Label>
              <Input
                type="date"
                value={form.startDate}
                min={startDateMin}
                max={startDateMax}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hasta (opcional)</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notas (opcional)</Label>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Ej: Pago mensual por transferencia"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCancelClick}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmSeries != null}
        onOpenChange={(next) => {
          if (!next) closeDeleteConfirm();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar turno fijo</DialogTitle>
            <DialogDescription>
              ¿Eliminar este turno fijo y todas sus ocurrencias futuras?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteConfirm}
              disabled={isDeletingSeries}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRemoveSeries}
              disabled={isDeletingSeries}
            >
              {isDeletingSeries ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
