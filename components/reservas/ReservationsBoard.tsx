"use client";

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import type { EventContentArg, EventInput } from "@fullcalendar/core";
import { Check, Eye, Search, X } from "lucide-react";

import {
  approveClubBookingAction,
  rejectClubBookingAction,
} from "@/actions/reservas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ReservationStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export type ClubReservation = {
  id: string;
  userId: string;
  user: {
    fullName: string | null;
    avatarUrl: string | null;
  };
  court: {
    id: string;
    name: string;
    type: string;
  };
  start: string;
  end: string;
  status: ReservationStatus;
  createdAt: string;
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
};

const STATUS_CLASSNAMES: Record<ReservationStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  REJECTED: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  CANCELLED: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

const COURT_COLOR_PALETTE = [
  { bg: "#dbeafe", border: "#60a5fa", text: "#1e3a8a" },
  { bg: "#ede9fe", border: "#8b5cf6", text: "#4c1d95" },
  { bg: "#dcfce7", border: "#22c55e", text: "#14532d" },
  { bg: "#fef3c7", border: "#f59e0b", text: "#78350f" },
  { bg: "#ffe4e6", border: "#f43f5e", text: "#881337" },
  { bg: "#e0e7ff", border: "#6366f1", text: "#312e81" },
  { bg: "#cffafe", border: "#06b6d4", text: "#164e63" },
  { bg: "#ecfccb", border: "#84cc16", text: "#365314" },
] as const;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
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

export function ReservationsBoard({
  clubId,
  initialReservations,
}: {
  clubId: string;
  initialReservations: ClubReservation[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ReservationStatus>("ALL");
  const [mode, setMode] = useState<"list" | "calendar">("calendar");
  const [calendarView, setCalendarView] = useState<
    "timeGridDay" | "timeGridWeek" | "dayGridMonth"
  >("timeGridWeek");
  const [courtFilter, setCourtFilter] = useState("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const courts = useMemo(() => {
    const byId = new Map(
      initialReservations.map((r) => [
        r.court.id,
        { id: r.court.id, name: r.court.name },
      ]),
    );
    return Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [initialReservations]);

  const courtColorById = useMemo(() => {
    const map = new Map<
      string,
      { bg: string; border: string; text: string; label: string }
    >();
    courts.forEach((court, idx) => {
      const color = COURT_COLOR_PALETTE[idx % COURT_COLOR_PALETTE.length];
      map.set(court.id, { ...color, label: court.name });
    });
    return map;
  }, [courts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialReservations.filter((r) => {
      if (status !== "ALL" && r.status !== status) return false;
      if (courtFilter !== "ALL" && r.court.id !== courtFilter) return false;
      if (!q) return true;
      return (
        r.court.name.toLowerCase().includes(q) ||
        (r.user.fullName ?? "sin nombre").toLowerCase().includes(q)
      );
    });
  }, [initialReservations, query, status, courtFilter]);

  const calendarEvents = useMemo<EventInput[]>(() => {
    return filtered.map((r) => {
      const color = courtColorById.get(r.court.id);
      return {
        id: r.id,
        title: r.court.name,
        start: r.start,
        end: r.end,
        backgroundColor: color?.bg ?? "#e5e7eb",
        borderColor: color?.border ?? "#9ca3af",
        textColor: color?.text ?? "#111827",
        extendedProps: {
          userName: r.user.fullName ?? "Sin nombre",
          status: STATUS_LABELS[r.status],
          courtName: r.court.name,
        },
      };
    });
  }, [filtered, courtColorById]);

  const grouped = useMemo(
    () => ({
      ALL: initialReservations.length,
      PENDING: initialReservations.filter((r) => r.status === "PENDING").length,
      CONFIRMED: initialReservations.filter((r) => r.status === "CONFIRMED")
        .length,
      CANCELLED: initialReservations.filter((r) => r.status === "CANCELLED")
        .length,
      REJECTED: initialReservations.filter((r) => r.status === "REJECTED")
        .length,
    }),
    [initialReservations],
  );

  async function onAction(bookingId: string, action: "approve" | "reject") {
    setError(null);
    setBusyId(bookingId);
    const res =
      action === "approve"
        ? await approveClubBookingAction(clubId, bookingId)
        : await rejectClubBookingAction(clubId, bookingId);
    setBusyId(null);
    if (!res.ok) setError(res.error);
  }

  function renderEventContent(arg: EventContentArg) {
    const userName = String(arg.event.extendedProps.userName ?? "");
    const statusLabel = String(arg.event.extendedProps.status ?? "");
    return (
      <div className="fc-event-body leading-tight">
        <div className="truncate text-[11px] font-semibold">
          {arg.timeText} {arg.event.title}
        </div>
        <div className="truncate text-[11px]">{userName}</div>
        <div className="truncate text-[10px] opacity-80">{statusLabel}</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por jugador o cancha..."
            className="h-11 rounded-lg pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={mode === "list" ? "default" : "outline"}
            className="rounded-lg"
            onClick={() => setMode("list")}
          >
            Lista
          </Button>
          <Button
            type="button"
            variant={mode === "calendar" ? "default" : "outline"}
            className="rounded-lg"
            onClick={() => setMode("calendar")}
          >
            Calendario
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["timeGridDay", "Día"],
            ["timeGridWeek", "Semana"],
            ["dayGridMonth", "Mes"],
          ] as const
        ).map(([v, label]) => (
          <Button
            key={v}
            type="button"
            variant={calendarView === v ? "default" : "outline"}
            className="rounded-lg"
            onClick={() => setCalendarView(v)}
          >
            {label}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
          >
            <option value="ALL">Todas las canchas</option>
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["ALL", `Todas (${grouped.ALL})`],
            ["CONFIRMED", `Confirmadas (${grouped.CONFIRMED})`],
            ["PENDING", `Pendientes (${grouped.PENDING})`],
            ["CANCELLED", `Canceladas (${grouped.CANCELLED})`],
            ["REJECTED", `Rechazadas (${grouped.REJECTED})`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              status === value
                ? "bg-primary/15 text-primary border-primary/30"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {mode === "list" ? (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Jugador</th>
                  <th className="px-4 py-3 text-left font-medium">cancha</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium">Hora</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/70">
                    <td className="px-4 py-3 text-xs">{r.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      {r.user.fullName ?? "Sin nombre"}
                    </td>
                    <td className="px-4 py-3">{r.court.name}</td>
                    <td className="px-4 py-3">{fmtDate(r.start)}</td>
                    <td className="px-4 py-3">{`${fmtTime(r.start)}-${fmtTime(r.end)}`}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          STATUS_CLASSNAMES[r.status],
                        )}
                      >
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon-sm" variant="ghost" disabled>
                          <Eye className="size-4" />
                        </Button>
                        {r.status === "PENDING" ? (
                          <>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              disabled={busyId === r.id}
                              onClick={() => void onAction(r.id, "approve")}
                            >
                              <Check className="size-4 text-emerald-600" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              disabled={busyId === r.id}
                              onClick={() => void onAction(r.id, "reject")}
                            >
                              <X className="size-4 text-rose-600" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-muted-foreground px-4 py-8 text-center"
                    >
                      No hay reservas para los filtros seleccionados.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="reservas-calendar border-border bg-card overflow-hidden rounded-xl border p-2 shadow-sm">
          <FullCalendar
            key={calendarView}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            locale={esLocale}
            initialView={calendarView}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{
              today: "Hoy",
            }}
            views={{
              timeGridWeek: {
                dayHeaderFormat: {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                },
              },
              timeGridDay: {
                dayHeaderFormat: {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                },
              },
            }}
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="23:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            expandRows
            nowIndicator
            editable={false}
            selectable={false}
            dayMaxEvents={3}
            eventOverlap
            eventMaxStack={4}
            events={calendarEvents}
            eventContent={renderEventContent}
            height="auto"
          />
        </div>
      )}
    </div>
  );
}
