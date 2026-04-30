"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, ChevronRight, Clock, MapPin, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ClubDashboardOpenMatch } from "@/types/club-dashboard";

function formatTimeRange(startIso: string, endIso: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const a = new Intl.DateTimeFormat("es", opts).format(new Date(startIso));
  const b = new Intl.DateTimeFormat("es", opts).format(new Date(endIso));
  return `${a} – ${b}`;
}

function initials(fullName: string | null): string {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "?";
}

export function ClubDashboardOpenMatchesSection({
  matches,
}: {
  matches: ClubDashboardOpenMatch[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ClubDashboardOpenMatch | null>(null);

  return (
    <>
      <div className="space-y-2">
        {matches.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No hay partidos con cupos libres.
          </p>
        ) : (
          matches.map((m) => {
            const levelLabel = m.level != null ? `Nivel ${m.level}` : "Partido";
            const dayTone =
              m.dayLabel === "Hoy"
                ? "bg-[#405fd3]/15 text-[#405fd3]"
                : m.dayLabel === "Mañana"
                  ? "bg-[#405fd3]/15 text-[#405fd3]"
                  : "bg-muted text-muted-foreground";
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setActive(m);
                  setOpen(true);
                }}
                className="bg-muted/40 hover:bg-muted/60 flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Users className="text-[#788ce3] mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium">
                      {m.courtName} · {levelLabel}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {formatTimeRange(m.start, m.end)} · {m.filledSlots}/
                      {m.maxPlayers} jugadores
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                  <span className="bg-[#788ce3]/15 text-[#788ce3] rounded-full px-2 py-0.5 text-xs font-medium">
                    {m.freeSlots} libres
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      dayTone,
                    )}
                  >
                    {m.dayLabel}
                  </span>
                  <ChevronRight className="text-muted-foreground size-4" />
                </div>
              </button>
            );
          })
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setActive(null);
        }}
      >
        <DialogContent showCloseButton className="gap-0 p-0 sm:max-w-md">
          {active ? (
            <>
              <DialogHeader className="border-border space-y-4 border-b p-6 pb-4">
                <div className="pr-8">
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Detalle del partido
                  </DialogTitle>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#788ce3] size-4 shrink-0" />
                    <span className="text-foreground font-semibold">
                      {active.courtName}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">
                    {active.level != null
                      ? `Nivel ${active.level}`
                      : "Sin nivel"}
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="text-[#788ce3] size-4" />
                    {formatTimeRange(active.start, active.end)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="text-[#788ce3] size-4" />
                    {active.dayLabel}
                  </span>
                </div>
              </DialogHeader>

              <div className="p-6 pt-4">
                <p className="text-foreground mb-3 text-sm font-semibold">
                  Jugadores ({active.filledSlots}/{active.maxPlayers})
                </p>
                <ul className="space-y-2">
                  {active.slots.map((slot, idx) => (
                    <li
                      key={
                        slot.empty
                          ? `empty-${idx}`
                          : slot.profileId + String(idx)
                      }
                      className="bg-muted/50 rounded-xl px-3 py-3"
                    >
                      {slot.empty ? (
                        <div className="flex items-center gap-3">
                          <span className="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                            ?
                          </span>
                          <p className="text-muted-foreground text-sm italic">
                            Plaza libre
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#788ce3] text-sm font-bold text-white">
                            {slot.avatarUrl ? (
                              <Image
                                src={slot.avatarUrl}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="44px"
                                unoptimized
                              />
                            ) : (
                              initials(slot.fullName)
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-foreground text-sm font-semibold">
                                {slot.fullName?.trim() || "Jugador"}
                              </p>
                              {slot.isOrganizer ? (
                                <span className="bg-[#788ce3]/15 text-[#788ce3] rounded-full px-2 py-0.5 text-xs font-medium">
                                  Organizador
                                </span>
                              ) : null}
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {slot.phone?.trim() || "No informado"}
                            </p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
