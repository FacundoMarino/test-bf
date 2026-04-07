"use client";

import { useEffect, useState } from "react";
import { CircleDashed, Moon, Sun } from "lucide-react";

import { createCourtAction, updateCourtAction } from "@/actions/courts";
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
import type { CourtRecord } from "@/types/club";

type CourtFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: string;
  mode: "create" | "edit";
  court: CourtRecord | null;
  onSaved: () => void;
};

export function CourtFormDialog({
  open,
  onOpenChange,
  clubId,
  mode,
  court,
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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
            // No crear horarios por defecto al dar de alta la cancha.
            // Los horarios se configuran explícitamente en "Horarios por períodos".
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
    if (!open) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setName(isEditMode && court ? court.name : "");
      setType(() => {
        if (isEditMode && court) {
          if (court.type === "outdoor") return "outdoor";
          if (court.type === "indoor") return "indoor";
          return "unspecified";
        }
        return "unspecified";
      });
      setSurface(isEditMode && court ? court.surface : "");
      setLighting(isEditMode && court ? court.lighting : true);
      setError(null);
    });
    return () => {
      cancelled = true;
    };
  }, [open, isEditMode, court]);

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
