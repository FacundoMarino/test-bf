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

function normalizeLevel(raw: number | null | undefined): number | null {
  if (typeof raw !== "number" || Number.isNaN(raw)) return null;
  return Math.min(7, Math.max(1, Math.round(raw)));
}

const STATUS_DETAIL: Record<ReservationStatus, string> = {
  PENDING: "Pendiente de confirmación",
  CONFIRMED: "Confirmada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
};

function courtTypeLabel(t: string) {
  if (t === "indoor") return "Interior";
  if (t === "outdoor") return "Exterior";
  if (t === "unspecified") return "Sin especificar";
  return t;
}

function LevelDots({
  level,
  invert = false,
}: {
  level: number;
  invert?: boolean;
}) {
  const normalized = normalizeLevel(level) ?? 7;
  const filled = invert ? 8 - normalized : normalized;
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
      <span className="text-muted-foreground ml-1 text-sm">{normalized}/7</span>
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
  const manualGuestRows =
    !booking.isMatch && booking.manualGuests?.length
      ? booking.manualGuests
          .map((g) => ({
            name: (g.name ?? "").trim(),
            phone: (g.phone ?? "").trim() || null,
          }))
          .filter((g) => g.name.length > 0)
      : [];
  const isManualGuestBooking = manualGuestRows.length > 0;

  const displayName = booking.user.fullName ?? "Sin nombre";
  const phone = booking.user.phone?.trim() || null;
  const email = booking.user.email?.trim() || booking.userEmail?.trim() || null;
  const bookerLevel = normalizeLevel(booking.user.level);
  const isMatch = booking.isMatch === true;
  const max = booking.maxPlayers ?? 4;
  const matchLevel = normalizeLevel(booking.level) ?? 1;
  const visibility = booking.visibility ?? "public";
  const participants = booking.participants ?? [];
  const organizerParticipant = participants.find(
    (p) => p.profileId === booking.userId,
  );
  const otherParticipants = participants.filter(
    (p) => p.profileId !== booking.userId,
  );
  const ordered = [
    {
      profileId: booking.userId,
      fullName: booking.user.fullName,
      avatarUrl: booking.user.avatarUrl,
      level: bookerLevel,
    },
    ...(organizerParticipant
      ? [
          {
            ...organizerParticipant,
            level: normalizeLevel(organizerParticipant.level),
          },
        ]
      : []),
    ...otherParticipants.map((p) => ({
      ...p,
      level: normalizeLevel(p.level),
    })),
  ].filter(
    (p, index, arr) =>
      arr.findIndex((x) => x.profileId === p.profileId) === index,
  );

  const slots: Array<{
    key: string;
    empty?: boolean;
    name?: string | null;
    avatarUrl?: string | null;
    organizer?: boolean;
    level?: number | null;
  }> = [];

  for (let i = 0; i < max; i++) {
    const p = ordered[i];
    if (p) {
      slots.push({
        key: p.profileId,
        name: p.fullName,
        avatarUrl: p.avatarUrl,
        organizer: p.profileId === booking.userId,
        level: normalizeLevel(p.level),
      });
    } else {
      slots.push({ key: `empty-${i}`, empty: true });
    }
  }

  const filledCount = slots.filter((s) => !s.empty).length;
  const freeCount = max - filledCount;

  /** Reserva de cancha sin partido: jugadores manual / o contactos con teléfono en perfil. */
  const courtBookingPlayersList = (() => {
    if (isMatch) return [];
    if (isManualGuestBooking) {
      return manualGuestRows.map((g, i) => ({
        key: `manual-${i}`,
        fullName: g.name,
        avatarUrl: null as string | null,
        phone: g.phone,
      }));
    }
    const out: Array<{
      key: string;
      fullName: string | null;
      avatarUrl: string | null;
      phone: string;
    }> = [];
    const seen = new Set<string>();
    const add = (
      profileId: string,
      fullName: string | null,
      avatarUrl: string | null,
      rawPhone: string | null | undefined,
    ) => {
      const tel = rawPhone?.trim();
      if (!tel || seen.has(profileId)) return;
      seen.add(profileId);
      out.push({ key: profileId, fullName, avatarUrl, phone: tel });
    };
    add(booking.userId, booking.user.fullName, booking.user.avatarUrl, phone);
    for (const p of participants) {
      add(p.profileId, p.fullName, p.avatarUrl, p.phone);
    }
    return out;
  })();

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
                {!isManualGuestBooking && booking.user.avatarUrl ? (
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
                {isManualGuestBooking ? (
                  <p className="text-muted-foreground text-xs font-medium">
                    Datos cargados en la reserva manual
                  </p>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-foreground font-medium">
                      {phone ?? "—"}
                    </span>
                  </div>
                  {!isManualGuestBooking ? (
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
                  ) : null}
                </div>
                {(isMatch && matchLevel != null) ||
                (!isMatch && !isManualGuestBooking && bookerLevel != null) ? (
                  <div className="pt-1">
                    <p className="text-muted-foreground mb-1.5 text-xs font-semibold uppercase tracking-wide">
                      {isMatch ? "Nivel del partido" : "Nivel del jugador"}
                    </p>
                    <LevelDots
                      level={isMatch ? matchLevel : (bookerLevel ?? 1)}
                      invert={!isMatch}
                    />
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
                  {isMatch ? (
                    <Lock className="size-4 text-sky-600 dark:text-sky-400" />
                  ) : isManualGuestBooking ? (
                    <Lock className="size-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <User className="text-muted-foreground size-4" />
                  )}
                  {isMatch
                    ? visibility === "private"
                      ? "Partido privado"
                      : "Partido abierto"
                    : isManualGuestBooking
                      ? "Reserva manual"
                      : "Reserva de cancha"}
                </dd>
              </div>
              {booking.manualClubNotes?.trim() ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs font-medium">
                    Notas del club
                  </dt>
                  <dd className="text-foreground mt-0.5 text-sm font-medium whitespace-pre-wrap">
                    {booking.manualClubNotes.trim()}
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
                      <span className="text-muted-foreground text-xs">
                        {s.level != null ? `(${s.level}/7)` : ""}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ) : null}

          {!isMatch && courtBookingPlayersList.length > 0 ? (
            <div className="border-border space-y-3 border-t pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-foreground inline-flex items-center gap-2 font-semibold">
                  <Users className="size-4 text-sky-600 dark:text-sky-400" />
                  Jugadores ({courtBookingPlayersList.length})
                </span>
              </div>
              <ul className="space-y-2">
                {courtBookingPlayersList.map((c) => (
                  <li key={c.key} className="flex items-center gap-3 text-sm">
                    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-xs font-bold text-white">
                      {c.avatarUrl ? (
                        <Image
                          src={c.avatarUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="36px"
                          unoptimized
                        />
                      ) : (
                        initial(c.fullName)
                      )}
                    </span>
                    <span className="text-foreground font-medium">
                      {c.fullName?.trim() || "Jugador"}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </span>
                  </li>
                ))}
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
                disabled={cancelling}
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
