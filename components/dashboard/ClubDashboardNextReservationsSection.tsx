"use client";

import { useState } from "react";
import { ChevronRight, Clock, Mail, MapPin, Phone, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ClubDashboardNextByCourt } from "@/types/club-dashboard";

function formatTimeRange(startIso: string, endIso: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const a = new Intl.DateTimeFormat("es", opts).format(new Date(startIso));
  const b = new Intl.DateTimeFormat("es", opts).format(new Date(endIso));
  return `${a} – ${b}`;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  CONFIRMED: "bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white",
  REJECTED: "bg-red-500/15 text-red-800 dark:text-red-200",
  CANCELLED: "bg-muted text-muted-foreground",
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className="text-foreground text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function ClubDashboardNextReservationsSection({
  rows,
}: {
  rows: ClubDashboardNextByCourt[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ClubDashboardNextByCourt | null>(null);

  const eurFmt = new Intl.NumberFormat("es", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const booking = active?.booking;

  return (
    <>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No hay canchas configuradas.
          </p>
        ) : (
          rows.map((row) => {
            const hasBooking = row.booking != null;
            return (
              <button
                key={row.courtId}
                type="button"
                disabled={!hasBooking}
                onClick={() => {
                  if (!hasBooking) return;
                  setActive(row);
                  setOpen(true);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                  hasBooking
                    ? "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                    : "bg-muted/40 cursor-default opacity-90",
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <MapPin className="text-teal-600 dark:text-teal-400 mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium">
                      {row.courtName}
                    </p>
                    {row.booking ? (
                      <p className="text-muted-foreground truncate text-xs">
                        {row.booking.bookerName?.trim() || "Reserva"}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-xs">
                        Sin reservas hoy
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {row.booking ? (
                    <>
                      <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                        <Clock className="size-3.5" />
                        {formatTimeRange(row.booking.start, row.booking.end)}
                      </span>
                      <ChevronRight className="text-muted-foreground size-4" />
                    </>
                  ) : (
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                      Libre
                    </span>
                  )}
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
          {booking && active ? (
            <>
              <DialogHeader className="border-border space-y-4 border-b p-6 pb-4">
                <div className="flex items-start justify-between gap-3 pr-8">
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Detalle de reserva
                  </DialogTitle>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-teal-600 dark:text-teal-400 size-4" />
                    <span className="text-foreground font-semibold">
                      {active.courtName}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      STATUS_CLASS[booking.status] ?? STATUS_CLASS.PENDING,
                    )}
                  >
                    {STATUS_LABEL[booking.status] ?? booking.status}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-4 p-6">
                <DetailRow
                  icon={User}
                  label="Jugador"
                  value={booking.bookerName?.trim() || "Sin nombre"}
                />
                <DetailRow
                  icon={Phone}
                  label="Teléfono"
                  value={booking.bookerPhone?.trim() || "No informado"}
                />
                <DetailRow
                  icon={Mail}
                  label="Email"
                  value={booking.bookerEmail?.trim() || "No informado"}
                />
              </div>

              <div className="border-border grid grid-cols-2 gap-4 border-t px-6 py-4">
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Horario
                  </p>
                  <p className="text-foreground mt-1 text-sm font-bold">
                    {formatTimeRange(booking.start, booking.end)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs font-medium">
                    Precio
                  </p>
                  <p className="text-foreground mt-1 text-sm font-bold">
                    {eurFmt.format(booking.priceEUR)}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
