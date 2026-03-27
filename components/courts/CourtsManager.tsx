"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Grid3x3,
  Lightbulb,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  deleteCourtAction,
  duplicateCourtAction,
  updateCourtListedAction,
} from "@/actions/courts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { ClubScheduleBlocks } from "@/types/club";
import type { CourtRecord } from "@/types/club";

import { CourtFormDialog } from "./CourtFormDialog";
import { CourtAvailabilityDialog } from "./CourtAvailabilityDialog";
import { CourtScheduleDialog } from "./CourtScheduleDialog";

export function CourtsManager({
  clubId,
  initialCourts,
  defaultScheduleBlocks,
}: {
  clubId: string;
  initialCourts: CourtRecord[];
  defaultScheduleBlocks: ClubScheduleBlocks;
}) {
  const router = useRouter();
  const [courts, setCourts] = useState(initialCourts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingCourt, setEditingCourt] = useState<CourtRecord | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleCourt, setScheduleCourt] = useState<CourtRecord | null>(null);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [availabilityCourt, setAvailabilityCourt] = useState<CourtRecord | null>(
    null,
  );

  useEffect(() => {
    setCourts(initialCourts);
  }, [initialCourts]);

  function openCreate() {
    setDialogMode("create");
    setEditingCourt(null);
    setDialogOpen(true);
  }

  function openEdit(court: CourtRecord) {
    setDialogMode("edit");
    setEditingCourt(court);
    setDialogOpen(true);
  }

  function openSchedule(court: CourtRecord) {
    setScheduleCourt(court);
    setScheduleDialogOpen(true);
  }

  function openAvailability(court: CourtRecord) {
    setAvailabilityCourt(court);
    setAvailabilityDialogOpen(true);
  }

  async function handleDuplicate(court: CourtRecord) {
    const res = await duplicateCourtAction(clubId, {
      id: court.id,
      name: court.name,
      type: court.type,
      surface: court.surface,
      lighting: court.lighting,
      listed: court.listed !== false,
    });
    if (res.ok) router.refresh();
    else alert(res.error);
  }

  async function handleDelete(court: CourtRecord) {
    if (
      !window.confirm(
        `¿Eliminar ${court.name}? Se borrarán reservas y horarios asociados.`,
      )
    ) {
      return;
    }
    const res = await deleteCourtAction(clubId, court.id);
    if (res.ok) router.refresh();
    else alert(res.error);
  }

  async function handleListedChange(court: CourtRecord, listed: boolean) {
    const res = await updateCourtListedAction(clubId, court.id, listed);
    if (res.ok) {
      setCourts((prev) =>
        prev.map((c) => (c.id === court.id ? { ...c, listed } : c)),
      );
      router.refresh();
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {courts.length === 0
            ? "Aún no hay canchas. Añade la primera para generar slots reservables."
            : `${courts.length} cancha${courts.length === 1 ? "" : "s"}`}
        </p>
        <Button
          type="button"
          onClick={openCreate}
          className="rounded-lg font-semibold"
        >
          <Plus className="mr-2 size-4" />
          Añadir cancha
        </Button>
      </div>

      {courts.length === 0 ? (
        <div className="border-border bg-muted/20 text-muted-foreground rounded-xl border border-dashed px-6 py-12 text-center text-sm">
          <Grid3x3 className="mx-auto mb-3 size-10 opacity-40" />
          No hay canchas todavía. Usá &quot;Añadir cancha&quot; para crear una y
          definir su horario.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <li
              key={court.id}
              className="border-border bg-card flex min-h-40 flex-col rounded-2xl border p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-foreground text-[26px] leading-none font-semibold">
                  {court.name}
                </h3>
                <Switch
                  checked={court.listed !== false}
                  onCheckedChange={(checked) =>
                    void handleListedChange(court, checked)
                  }
                  aria-label={
                    court.listed === false
                      ? "Cancha oculta en la app; activar para mostrarla"
                      : "Cancha visible en la app; desactivar para ocultarla"
                  }
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                    court.type === "outdoor"
                      ? "border-amber-200 bg-amber-100/80 text-amber-900 dark:border-amber-300/25 dark:bg-amber-400/15 dark:text-amber-200"
                      : "border-slate-200 bg-slate-100/80 text-slate-800 dark:border-slate-300/25 dark:bg-slate-400/15 dark:text-slate-200",
                  )}
                >
                  {court.type === "outdoor" ? (
                    <span className="inline-flex items-center gap-1">
                      ☀ Outdoor
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      ☽ Indoor
                    </span>
                  )}
                </span>
                <span className="border-border bg-background text-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
                  {court.surface}
                </span>
                {court.listed === false ? (
                  <span className="text-muted-foreground border-muted-foreground/30 bg-muted/40 inline-flex items-center rounded-full border border-dashed px-3 py-1 text-xs font-medium">
                    Oculta en la app
                  </span>
                ) : null}
              </div>
              <div className="border-border/80 mt-4 border-t" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                  <Lightbulb className="size-3.5 text-amber-500" />
                  {court.lighting ? "Con iluminación" : "Sin iluminación"}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openSchedule(court)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Configurar horarios"
                    title="Configurar horarios"
                  >
                    <Clock3 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openAvailability(court)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Gestionar disponibilidad"
                    title="Gestionar disponibilidad"
                  >
                    <CalendarDays className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(court)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Editar"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(court)}
                    className="text-destructive/85 hover:text-destructive hover:bg-destructive/10 inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dialogOpen ? (
        <CourtFormDialog
          open={dialogOpen}
          onOpenChange={(nextOpen) => {
            setDialogOpen(nextOpen);
            if (!nextOpen) {
              setEditingCourt(null);
              setDialogMode("create");
            }
          }}
          clubId={clubId}
          mode={dialogMode}
          court={editingCourt}
          defaultScheduleBlocks={defaultScheduleBlocks}
          onSaved={() => {
            setDialogOpen(false);
            setEditingCourt(null);
            setDialogMode("create");
            router.refresh();
          }}
        />
      ) : null}
      {scheduleDialogOpen ? (
        <CourtScheduleDialog
          open={scheduleDialogOpen}
          onOpenChange={(nextOpen) => {
            setScheduleDialogOpen(nextOpen);
            if (!nextOpen) setScheduleCourt(null);
          }}
          clubId={clubId}
          court={scheduleCourt}
          onSaved={() => {
            router.refresh();
          }}
        />
      ) : null}
      {availabilityDialogOpen ? (
        <CourtAvailabilityDialog
          open={availabilityDialogOpen}
          onOpenChange={(nextOpen) => {
            setAvailabilityDialogOpen(nextOpen);
            if (!nextOpen) setAvailabilityCourt(null);
          }}
          clubId={clubId}
          court={availabilityCourt}
          onSaved={() => {
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}
