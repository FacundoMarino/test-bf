"use client";

import { useEffect, useState } from "react";
import { CircleDashed, Moon, Sun } from "lucide-react";

import { createCourtAction, updateCourtAction } from "@/actions/courts";
import { ScheduleBlocksEditor } from "@/components/club/ScheduleBlocksEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import type {
  ClubScheduleBlocks,
  CourtRecord,
  DailyScheduleBlocks,
} from "@/types/club";

function validateSchedule(blocks: ClubScheduleBlocks): string | null {
  const groups: (keyof ClubScheduleBlocks)[] = [
    "weekday",
    "saturday",
    "sunday",
  ];
  for (const g of groups) {
    const b = blocks[g];
    if (!b.enabled) continue;
    if (hhmmToMinutes(b.endTime) <= hhmmToMinutes(b.startTime)) {
      return "La hora de fin debe ser posterior a la de inicio";
    }
  }
  return null;
}

function validateDailySchedule(blocks: DailyScheduleBlocks): string | null {
  const groups: (keyof DailyScheduleBlocks)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  for (const g of groups) {
    const b = blocks[g];
    if (!b.enabled) continue;
    if (hhmmToMinutes(b.endTime) <= hhmmToMinutes(b.startTime)) {
      return "La hora de fin debe ser posterior a la de inicio";
    }
  }
  return null;
}

function groupedToDaily(blocks: ClubScheduleBlocks): DailyScheduleBlocks {
  return {
    monday: { ...blocks.weekday },
    tuesday: { ...blocks.weekday },
    wednesday: { ...blocks.weekday },
    thursday: { ...blocks.weekday },
    friday: { ...blocks.weekday },
    saturday: { ...blocks.saturday },
    sunday: { ...blocks.sunday },
  };
}

function dailyToGrouped(blocks: DailyScheduleBlocks): ClubScheduleBlocks {
  return {
    weekday: { ...blocks.monday },
    saturday: { ...blocks.saturday },
    sunday: { ...blocks.sunday },
  };
}

const DAILY_ROWS: Array<{ key: keyof DailyScheduleBlocks; label: string }> = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

type CourtFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: string;
  mode: "create" | "edit";
  court: CourtRecord | null;
  defaultScheduleBlocks: ClubScheduleBlocks;
  onSaved: () => void;
};

export function CourtFormDialog({
  open,
  onOpenChange,
  clubId,
  mode,
  court,
  defaultScheduleBlocks,
  onSaved,
}: CourtFormDialogProps) {
  const isEditMode = mode === "edit" && Boolean(court);
  const [name, setName] = useState(isEditMode && court ? court.name : "");
  const [type, setType] = useState<"indoor" | "outdoor" | "unspecified">(() => {
    if (isEditMode && court) {
      if (court.type === "outdoor") return "outdoor";
      if (court.type === "indoor") return "indoor";
      return "unspecified";
    }
    return "unspecified";
  });
  const [surface, setSurface] = useState(
    isEditMode && court ? court.surface : "",
  );
  const [lighting, setLighting] = useState(
    isEditMode && court ? court.lighting : true,
  );
  const [schedule, setSchedule] = useState<ClubScheduleBlocks>(
    defaultScheduleBlocks,
  );
  const [scheduleMode, setScheduleMode] = useState<"grouped" | "daily">(
    "grouped",
  );
  const [dailySchedule, setDailySchedule] = useState<DailyScheduleBlocks>(
    groupedToDaily(defaultScheduleBlocks),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isEditMode) {
      const msg =
        scheduleMode === "daily"
          ? validateDailySchedule(dailySchedule)
          : validateSchedule(schedule);
      if (msg) {
        setError(msg);
        return;
      }
    }
    if (!surface.trim()) {
      setError("La superficie es obligatoria.");
      return;
    }
    setPending(true);
    const res =
      mode === "create"
        ? await createCourtAction(clubId, {
            name: name.trim(),
            type,
            surface: surface.trim(),
            lighting,
            schedule,
            schedulesPayload:
              scheduleMode === "daily"
                ? dailyBlocksToCourtSchedulePayload(dailySchedule)
                : undefined,
          })
        : court
          ? await updateCourtAction(clubId, court.id, {
              name: name.trim(),
              type,
              surface: surface.trim(),
              lighting,
              updateSchedules: false,
            })
          : { ok: false as const, error: "cancha no válida" };
    setPending(false);
    if (res.ok) {
      onOpenChange(false);
      onSaved();
    } else {
      setError(res.error);
    }
  }
  useEffect(() => {
    if (!open || mode !== "create") return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setSchedule(defaultScheduleBlocks);
      setDailySchedule(groupedToDaily(defaultScheduleBlocks));
      setScheduleMode("grouped");
    });
    return () => {
      cancelled = true;
    };
  }, [open, mode, defaultScheduleBlocks]);

  return (
    <Dialog
      open={open}
      disablePointerDismissal={false}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        key={`${mode}-${court?.id ?? "new"}`}
        className="border-border bg-card max-h-[min(90vh,720px)] overflow-y-auto rounded-xl sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nueva cancha" : "Editar cancha"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="court-name">Nombre (opcional)</Label>
            <Input
              id="court-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: cancha 7"
              className="h-11 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">Tipo (opcional)</span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setType("outdoor")}
                className={`border-border flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === "outdoor"
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "hover:bg-muted/80"
                }`}
              >
                <Sun className="size-4" />
                Outdoor
              </button>
              <button
                type="button"
                onClick={() => setType("indoor")}
                className={`border-border flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === "indoor"
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "hover:bg-muted/80"
                }`}
              >
                <Moon className="size-4" />
                Indoor
              </button>
              <button
                type="button"
                onClick={() => setType("unspecified")}
                className={`border-border flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  type === "unspecified"
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "hover:bg-muted/80"
                }`}
              >
                <CircleDashed className="size-4" />
                Sin especificar
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="court-surface">Superficie</Label>
            <Input
              id="court-surface"
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              placeholder="Ej: Cristal, Muro"
              className="h-11 rounded-lg"
              required
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 px-3 py-2">
            <span className="text-sm font-medium">Iluminación</span>
            <Switch checked={lighting} onCheckedChange={setLighting} />
          </div>

          {mode === "create" ? (
            <div className="space-y-2">
              <span className="text-sm font-semibold">
                Horario de la cancha
              </span>
              <p className="text-muted-foreground text-xs"></p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSchedule(dailyToGrouped(dailySchedule));
                    setScheduleMode("grouped");
                  }}
                  className={`border-border rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    scheduleMode === "grouped"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "hover:bg-muted/80"
                  }`}
                >
                  Lunes a viernes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDailySchedule(groupedToDaily(schedule));
                    setScheduleMode("daily");
                  }}
                  className={`border-border rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    scheduleMode === "daily"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "hover:bg-muted/80"
                  }`}
                >
                  Configurar por día
                </button>
              </div>
              <>
                {scheduleMode === "grouped" ? (
                  <ScheduleBlocksEditor
                    value={schedule}
                    onChange={setSchedule}
                    slotDurationOptions={COURT_SLOT_DURATION_OPTIONS}
                    idPrefix="court"
                  />
                ) : (
                  <div className="space-y-4">
                    {DAILY_ROWS.map(({ key, label }) => {
                      const block = dailySchedule[key];
                      const knownSlot = COURT_SLOT_DURATION_OPTIONS.some(
                        (o) => o.minutes === block.slotDurationMinutes,
                      );
                      return (
                        <div
                          key={key}
                          className="border-border/80 space-y-3 rounded-lg border px-4 py-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-sm font-medium">{label}</span>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`court-${key}-enabled`}
                                className="text-muted-foreground cursor-pointer text-xs font-normal"
                              >
                                Abre
                              </Label>
                              <Switch
                                id={`court-${key}-enabled`}
                                checked={block.enabled}
                                onCheckedChange={(checked) =>
                                  setDailySchedule({
                                    ...dailySchedule,
                                    [key]: {
                                      ...block,
                                      enabled: checked,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
                            <div className="space-y-1.5">
                              <Label
                                className="text-xs"
                                htmlFor={`court-${key}-start`}
                              >
                                Inicio
                              </Label>
                              <Input
                                id={`court-${key}-start`}
                                type="time"
                                value={block.startTime}
                                disabled={!block.enabled}
                                onChange={(e) =>
                                  setDailySchedule({
                                    ...dailySchedule,
                                    [key]: {
                                      ...block,
                                      startTime: e.target.value,
                                    },
                                  })
                                }
                                className="h-10 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                className="text-xs"
                                htmlFor={`court-${key}-end`}
                              >
                                Fin
                              </Label>
                              <Input
                                id={`court-${key}-end`}
                                type="time"
                                value={block.endTime}
                                disabled={!block.enabled}
                                onChange={(e) =>
                                  setDailySchedule({
                                    ...dailySchedule,
                                    [key]: {
                                      ...block,
                                      endTime: e.target.value,
                                    },
                                  })
                                }
                                className="h-10 rounded-lg"
                              />
                            </div>
                            <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                              <Label
                                className="text-xs"
                                htmlFor={`court-${key}-slot`}
                              >
                                Duración del slot
                              </Label>
                              <select
                                id={`court-${key}-slot`}
                                value={block.slotDurationMinutes}
                                disabled={!block.enabled}
                                onChange={(e) =>
                                  setDailySchedule({
                                    ...dailySchedule,
                                    [key]: {
                                      ...block,
                                      slotDurationMinutes: Number.parseInt(
                                        e.target.value,
                                        10,
                                      ),
                                    },
                                  })
                                }
                                className="border-input bg-background h-10 w-full max-w-xs rounded-lg border px-3 text-sm shadow-sm disabled:cursor-not-allowed"
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            </div>
          ) : null}

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="rounded-lg font-semibold"
            >
              {pending ? "Guardando…" : "Guardar cancha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
