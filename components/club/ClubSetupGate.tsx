"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "serxus_club_setup_nudge";

export function ClubSetupGate({
  isClubUser,
  hasClub,
}: {
  isClubUser: boolean;
  hasClub: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón explícito client-only
    setHydrated(true);
  }, []);

  if (!hydrated || !isClubUser || hasClub) return null;

  return <ClubSetupDialog />;
}

function ClubSetupDialog() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) !== "1";
    } catch {
      return true;
    }
  });

  function persistDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) persistDismiss();
      }}
    >
      <DialogContent className="max-w-md rounded-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>Configurá tu club</DialogTitle>
          <DialogDescription>
            Completá el perfil de tu club: datos de contacto, horarios,
            servicios e imagen. Podés editarlo cuando quieras desde{" "}
            <strong>Mi club</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-lg sm:w-auto"
            onClick={() => {
              persistDismiss();
              setOpen(false);
            }}
          >
            Más tarde
          </Button>
          <Link
            href={"/dashboard/club" as Route}
            className={cn(
              buttonVariants(),
              "inline-flex w-full justify-center rounded-lg sm:w-auto",
            )}
          >
            Editar mi club
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
