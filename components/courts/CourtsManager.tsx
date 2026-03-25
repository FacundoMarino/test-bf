"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Grid3x3, Pencil, Plus, Trash2 } from "lucide-react";

import { deleteCourtAction, duplicateCourtAction } from "@/actions/courts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClubScheduleBlocks } from "@/types/club";
import type { CourtRecord } from "@/types/club";

import { CourtFormDialog } from "./CourtFormDialog";

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

  async function handleDuplicate(court: CourtRecord) {
    const res = await duplicateCourtAction(clubId, {
      id: court.id,
      name: court.name,
      type: court.type,
      surface: court.surface,
      lighting: court.lighting,
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
              className="border-border bg-card flex flex-col rounded-xl border p-4 shadow-sm ring-1 ring-foreground/5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-foreground font-semibold">{court.name}</h3>
                <div className="flex gap-1">
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
                    onClick={() => void handleDuplicate(court)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Duplicar cancha"
                    title="Duplicar cancha"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(court)}
                    className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 inline-flex size-8 items-center justify-center rounded-md"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                    court.type === "outdoor"
                      ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
                      : "bg-slate-500/15 text-slate-800 dark:text-slate-200",
                  )}
                >
                  {court.type === "outdoor" ? (
                    <span className="inline-flex items-center gap-0.5">
                      ☀ Outdoor
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5">
                      ☽ Indoor
                    </span>
                  )}
                </span>
                <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs">
                  {court.surface}
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                {court.lighting ? "Con iluminación" : "Sin iluminación"}
              </p>
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
    </div>
  );
}
