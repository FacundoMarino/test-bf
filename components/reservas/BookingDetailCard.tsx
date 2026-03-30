"use client";

import Image from "next/image";
import { CircleHelp, Lock, Mail, Phone, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ClubReservation,
  ReservationStatus,
} from "@/types/club-reservation";

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function initial(name: string | null | undefined): string {
  const t = (name ?? "?").trim();
  return t ? t.charAt(0).toUpperCase() : "?";
}

const STATUS_DETAIL: Record<ReservationStatus, string> = {
  PENDING: "Pendiente de confirmación",
  CONFIRMED: "Confirmada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
};

function bookingEndIsInFuture(endIso: string): boolean {
  return new Date(endIso).getTime() > Date.now();
}

function courtTypeLabel(t: string) {
  if (t === "indoor") return "Interior";
  if (t === "outdoor") return "Exterior";
  if (t === "unspecified") return "Sin especificar";
  return t;
}

function LevelDots({ level }: { level: number }) {
  const filled = Math.min(7, Math.max(0, level));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-2 rounded-full",
            i < filled ? "bg-sky-500" : "bg-slate-200 dark:bg-slate-600",
          )}
        />
      ))}
      <span className="text-muted-foreground ml-1 text-sm">{filled}/7</span>
    </div>
  );
}

export function BookingDetailCard({
  booking,
  onCancel,
  cancelling,
}: {
  booking: ClubReservation;
  onCancel: () => void;
  cancelling: boolean;
}) {
  const displayName = booking.user.fullName ?? "Sin nombre";
  const phone = booking.user.phone?.trim() || null;
  const email = booking.user.email?.trim() || null;
  const bookerLevel = booking.user.level ?? null;
  const isMatch = booking.isMatch === true;
  const max = booking.maxPlayers ?? 4;
  const matchLevel = booking.level ?? 1;
  const visibility = booking.visibility ?? "public";
  const participants = booking.participants ?? [];

  const ordered = [...participants].sort((a, b) => {
    if (a.profileId === booking.userId) return -1;
    if (b.profileId === booking.userId) return 1;
    return 0;
  });

  const slots: Array<{
    key: string;
    empty?: boolean;
    name?: string | null;
    avatarUrl?: string | null;
    organizer?: boolean;
  }> = [];

  for (let i = 0; i < max; i++) {
    const p = ordered[i];
    if (p) {
      slots.push({
        key: p.profileId,
        name: p.fullName,
        avatarUrl: p.avatarUrl,
        organizer: p.profileId === booking.userId,
      });
    } else {
      slots.push({ key: `empty-${i}`, empty: true });
    }
  }

  const filledCount = slots.filter((s) => !s.empty).length;
  const freeCount = max - filledCount;

  const rangeLabel = `${fmtTime(booking.start)} – ${fmtTime(booking.end)}`;

  return (
    <div className="border-border bg-sky-50/40 dark:bg-sky-950/20 border-t">
      <div className="space-y-0 px-4 py-4 sm:px-6">
        <div className="space-y-5 pt-1">
          {/* Quién reservó */}
          <div>
            <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wide">
              Reservado por
            </p>
            <div className="flex flex-wrap items-start gap-4">
              <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-lg font-bold text-white">
                {booking.user.avatarUrl ? (
                  <Image
                    src={booking.user.avatarUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                    unoptimized
                  />
                ) : (
                  initial(displayName)
                )}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-foreground text-lg font-bold">
                  {displayName}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-foreground font-medium">
                      {phone ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="text-muted-foreground size-4 shrink-0" />
                    <span
                      className={cn(
                        "font-medium",
                        email ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {email ?? "—"}
                    </span>
                  </div>
                </div>
                {!isMatch && bookerLevel != null ? (
                  <div className="pt-1">
                    <p className="text-muted-foreground mb-1.5 text-xs font-semibold uppercase tracking-wide">
                      Nivel del jugador
                    </p>
                    <LevelDots level={bookerLevel} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-border border-t pt-5">
            <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wide">
              Detalle de la reserva
            </p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs font-medium">
                  Cancha
                </dt>
                <dd className="text-foreground mt-0.5 text-sm font-semibold">
                  {booking.court.name.trim() || "Sin nombre"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium">
                  Tipo de cancha
                </dt>
                <dd className="text-foreground mt-0.5 text-sm font-semibold">
                  {courtTypeLabel(booking.court.type)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground text-xs font-medium">
                  Horario
                </dt>
                <dd className="text-foreground mt-0.5 text-sm font-semibold capitalize">
                  {fmtDate(booking.start)} · {rangeLabel}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium">
                  Estado
                </dt>
                <dd className="mt-1">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      booking.status === "CONFIRMED" &&
                        "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
                      booking.status === "PENDING" &&
                        "bg-amber-500/15 text-amber-800 dark:text-amber-200",
                      booking.status === "CANCELLED" &&
                        "bg-slate-500/15 text-slate-700 dark:text-slate-200",
                      booking.status === "REJECTED" &&
                        "bg-rose-500/15 text-rose-800 dark:text-rose-200",
                    )}
                  >
                    {STATUS_DETAIL[booking.status]}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium">
                  Tipo de reserva
                </dt>
                <dd className="text-foreground mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold">
                  <User className="text-muted-foreground size-4" />
                  {isMatch ? "Partido" : "Reserva de pista"}
                </dd>
              </div>
              {isMatch ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs font-medium">
                    Visibilidad
                  </dt>
                  <dd className="text-foreground mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold">
                    <Lock className="size-4 text-sky-600 dark:text-sky-400" />
                    {visibility === "private"
                      ? "Partido privado"
                      : "Partido abierto"}
                  </dd>
                </div>
              ) : null}
              {isMatch && booking.title ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs font-medium">
                    Título del partido
                  </dt>
                  <dd className="text-foreground mt-0.5 text-sm font-semibold">
                    {booking.title}
                  </dd>
                </div>
              ) : null}
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground text-xs font-medium">
                  Reservado el
                </dt>
                <dd className="text-foreground mt-0.5 text-sm font-medium">
                  {fmtDateTime(booking.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          {isMatch ? (
            <div className="border-t border-slate-200/80 pt-5 dark:border-slate-700/80">
              <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
                Nivel del partido
              </p>
              <LevelDots level={matchLevel} />
            </div>
          ) : null}

          {isMatch ? (
            <div className="border-border space-y-3 border-t pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-foreground inline-flex items-center gap-2 font-semibold">
                  <Users className="size-4 text-sky-600 dark:text-sky-400" />
                  Jugadores
                </span>
                <span className="text-muted-foreground text-sm">
                  {filledCount}/{max}{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ({freeCount}{" "}
                    {freeCount === 1 ? "plaza libre" : "plazas libres"})
                  </span>
                </span>
              </div>
              <ul className="space-y-2">
                {slots.map((s) =>
                  s.empty ? (
                    <li
                      key={s.key}
                      className="text-muted-foreground flex items-center gap-3 text-sm italic"
                    >
                      <span className="border-muted-foreground/40 flex size-9 items-center justify-center rounded-full border border-dashed">
                        <CircleHelp className="size-4 opacity-60" />
                      </span>
                      Plaza libre
                    </li>
                  ) : (
                    <li key={s.key} className="flex items-center gap-3 text-sm">
                      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-xs font-bold text-white">
                        {s.avatarUrl ? (
                          <Image
                            src={s.avatarUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="36px"
                            unoptimized
                          />
                        ) : (
                          initial(s.name)
                        )}
                      </span>
                      <span className="text-foreground font-medium">
                        {s.name ?? "Jugador"}
                      </span>
                      {s.organizer ? (
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                          Organizador
                        </span>
                      ) : null}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ) : null}

          <div className="border-border flex flex-wrap gap-3 border-t pt-4">
            {(booking.status === "PENDING" ||
              booking.status === "CONFIRMED") && (
              <Button
                type="button"
                variant="destructive"
                className="rounded-lg font-semibold"
                disabled={cancelling || !bookingEndIsInFuture(booking.end)}
                title={
                  !bookingEndIsInFuture(booking.end)
                    ? "No se pueden cancelar reservas ya finalizadas"
                    : undefined
                }
                onClick={onCancel}
              >
                Cancelar reserva
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
