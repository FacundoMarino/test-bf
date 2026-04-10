"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  User,
  Users,
  X,
} from "lucide-react";

import {
  approveClubBookingAction,
  cancelClubBookingAction,
  createManualCourtBookingAction,
  listCourtDaySlotsAction,
  refreshClubReservationsAction,
  rejectClubBookingAction,
} from "@/actions/reservas";
import { BookingDetailCard } from "@/components/reservas/BookingDetailCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  bookingBlocksCalendarSlot,
  isTentativePublicOpenMatch,
  matchParticipantsCount,
} from "@/lib/club-reservation-utils";
import { cn } from "@/lib/utils";
import type {
  ClubReservation,
  ReservationStatus,
} from "@/types/club-reservation";

export type { ClubReservation } from "@/types/club-reservation";

export type ClubCourtOption = {
  id: string;
  name: string;
  type: string;
  surface: string;
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

function courtTypeTag(type: string): string {
  if (type === "outdoor") return "Outdoor";
  if (type === "indoor") return "Indoor";
  return "";
}

function courtSelectLine(c: ClubCourtOption): string {
  const title = c.name.trim() || "Sin nombre";
  const tag = courtTypeTag(c.type);
  return tag ? `${title} ${tag} — ${c.surface}` : `${title} — ${c.surface}`;
}

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameLocalDay(a: Date, b: Date): boolean {
  return formatLocalYmd(a) === formatLocalYmd(b);
}

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

function fmtTimeUtc(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function intervalsOverlapMs(
  a0: number,
  a1: number,
  b0: number,
  b1: number,
): boolean {
  return a0 < b1 && a1 > b0;
}

/** Vista calendario: lunes = primer columna */
function MiniMonthCalendar({
  viewMonth,
  onViewMonthChange,
  selectedDate,
  onSelectDate,
  markedDays,
}: {
  viewMonth: Date;
  onViewMonthChange: (d: Date) => void;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  markedDays: Set<string>;
}) {
  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  const first = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Mon=0
  const today = startOfLocalDay(new Date());

  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);

  const title = viewMonth.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border-border bg-card rounded-xl border p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-lg"
          onClick={() => onViewMonthChange(new Date(y, m - 1, 1))}
          aria-label="Mes anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-foreground flex-1 text-center text-sm font-semibold capitalize">
          {title}
        </span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-8 items-center justify-center rounded-lg"
          onClick={() => onViewMonthChange(new Date(y, m + 1, 1))}
          aria-label="Mes siguiente"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center">
        {["L", "M", "X", "J", "V", "S", "D"].map((w) => (
          <div
            key={w}
            className="text-muted-foreground pb-1 text-[10px] font-medium"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`e-${idx}`} className="aspect-square" />;
          }
          const cellDate = new Date(y, m, day);
          const ymd = formatLocalYmd(cellDate);
          const isSelected = sameLocalDay(cellDate, selectedDate);
          const isToday = sameLocalDay(cellDate, today);
          const hasMark = markedDays.has(ymd);

          return (
            <button
              key={ymd}
              type="button"
              onClick={() => onSelectDate(cellDate)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted",
                isToday && !isSelected && "ring-primary/40 ring-2",
              )}
            >
              {day}
              {hasMark && !isSelected ? (
                <span className="bg-primary absolute bottom-1 size-1 rounded-full" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReservationsBoard({
  clubId,
  initialCourts,
  initialReservations,
}: {
  clubId: string;
  initialCourts: ClubCourtOption[];
  initialReservations: ClubReservation[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ReservationStatus>("ALL");
  const [mode, setMode] = useState<"list" | "calendar">("calendar");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [cancelBusyId, setCancelBusyId] = useState<string | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfLocalDay(new Date()),
  );
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfLocalDay(new Date()),
  );
  const [courtId, setCourtId] = useState<string>(
    () => initialCourts[0]?.id ?? "",
  );
  const [listCourtId, setListCourtId] = useState<string>("ALL");
  const validCourtId = useMemo(() => {
    if (initialCourts.length === 0) return "";
    if (initialCourts.some((c) => c.id === courtId)) return courtId;
    return initialCourts[0]!.id;
  }, [initialCourts, courtId]);

  const [daySlots, setDaySlots] = useState<
    Array<{ start: string; end: string; isAvailable: boolean }>
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualBusy, setManualBusy] = useState(false);
  const [manualSlot, setManualSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [manualPlayers, setManualPlayers] = useState<
    Array<{ name: string; phone: string }>
  >([{ name: "", phone: "" }]);
  const [manualNotes, setManualNotes] = useState("");
  /** Lista recién traída del API (p. ej. tras reserva manual); evita ver datos cacheados sin manualGuests. */
  const [hotReservations, setHotReservations] = useState<
    ClubReservation[] | null
  >(null);

  const initialBookingIdsKey = useMemo(
    () => [...initialReservations.map((r) => r.id)].sort().join(","),
    [initialReservations],
  );

  const hotBookingIdsKey = useMemo(
    () =>
      hotReservations
        ? [...hotReservations.map((r) => r.id)].sort().join(",")
        : null,
    [hotReservations],
  );

  const boardReservations = useMemo(() => {
    if (!hotReservations) return initialReservations;
    // Si el servidor ya cambió el set base, ignoramos el cache local.
    if (hotBookingIdsKey !== initialBookingIdsKey) return initialReservations;
    return hotReservations;
  }, [
    hotReservations,
    hotBookingIdsKey,
    initialReservations,
    initialBookingIdsKey,
  ]);

  const loadSlots = useCallback(async () => {
    if (!validCourtId || !clubId) {
      setDaySlots([]);
      return;
    }
    setLoadingSlots(true);
    setSlotsError(null);
    const ymd = formatLocalYmd(selectedDate);
    const res = await listCourtDaySlotsAction(clubId, validCourtId, ymd);
    setLoadingSlots(false);
    if (!res.ok) {
      setSlotsError(res.error);
      setDaySlots([]);
      return;
    }
    const seen = new Set<string>();
    const unique = res.slots.filter((s) => {
      const k = `${s.start}\0${s.end}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    setDaySlots(unique);
  }, [clubId, validCourtId, selectedDate]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      void loadSlots();
    });
  }, [loadSlots]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        router.refresh();
        void loadSlots();
      }
    };
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        void loadSlots();
      }
    };

    handleVisibility();
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router, loadSlots]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return boardReservations.filter((r) => {
      if (status !== "ALL" && r.status !== status) return false;
      if (listCourtId !== "ALL" && r.court.id !== listCourtId) return false;
      if (!q) return true;
      return (
        r.court.name.toLowerCase().includes(q) ||
        (r.user.fullName ?? "sin nombre").toLowerCase().includes(q)
      );
    });
  }, [boardReservations, query, status, listCourtId]);

  const grouped = useMemo(
    () => ({
      ALL: boardReservations.length,
      PENDING: boardReservations.filter((r) => r.status === "PENDING").length,
      CONFIRMED: boardReservations.filter((r) => r.status === "CONFIRMED")
        .length,
      CANCELLED: boardReservations.filter((r) => r.status === "CANCELLED")
        .length,
      REJECTED: boardReservations.filter((r) => r.status === "REJECTED").length,
    }),
    [boardReservations],
  );

  const markedDays = useMemo(() => {
    const s = new Set<string>();
    for (const r of boardReservations) {
      if (r.court.id !== validCourtId) continue;
      s.add(formatLocalYmd(new Date(r.start)));
    }
    return s;
  }, [boardReservations, validCourtId]);

  const bookingsForCourtDay = useMemo(() => {
    return boardReservations.filter(
      (r) =>
        r.court.id === validCourtId &&
        sameLocalDay(new Date(r.start), selectedDate),
    );
  }, [boardReservations, validCourtId, selectedDate]);

  const slotRows = useMemo(() => {
    return daySlots.map((slot) => {
      const s0 = new Date(slot.start).getTime();
      const s1 = new Date(slot.end).getTime();
      const overlapping = bookingsForCourtDay.filter(
        (r) =>
          (r.status === "PENDING" || r.status === "CONFIRMED") &&
          intervalsOverlapMs(
            s0,
            s1,
            new Date(r.start).getTime(),
            new Date(r.end).getTime(),
          ),
      );
      const blockingBooking =
        overlapping.find((r) => bookingBlocksCalendarSlot(r)) ?? null;
      const tentativeBooking =
        overlapping.find((r) => isTentativePublicOpenMatch(r)) ?? null;

      if (blockingBooking) {
        return {
          start: slot.start,
          end: slot.end,
          kind: "reserved" as const,
          booking: blockingBooking,
        };
      }
      if (tentativeBooking && slot.isAvailable) {
        return {
          start: slot.start,
          end: slot.end,
          kind: "tentativeOpen" as const,
          booking: tentativeBooking,
        };
      }
      if (!slot.isAvailable) {
        return {
          start: slot.start,
          end: slot.end,
          kind: "closed" as const,
          booking: null,
        };
      }
      return {
        start: slot.start,
        end: slot.end,
        kind: "available" as const,
        booking: null,
      };
    });
  }, [daySlots, bookingsForCourtDay]);

  const dayStats = useMemo(() => {
    const disponibles = slotRows.filter(
      (r) => r.kind === "available" || r.kind === "tentativeOpen",
    ).length;
    const reservados = slotRows.filter((r) => r.kind === "reserved").length;
    const tentativosAbiertos = slotRows.filter(
      (r) => r.kind === "tentativeOpen",
    ).length;
    const cancelados = bookingsForCourtDay.filter(
      (r) => r.status === "CANCELLED",
    ).length;
    return { disponibles, reservados, cancelados, tentativosAbiertos };
  }, [slotRows, bookingsForCourtDay]);

  async function onAction(bookingId: string, action: "approve" | "reject") {
    setError(null);
    setBusyId(bookingId);
    const res =
      action === "approve"
        ? await approveClubBookingAction(clubId, bookingId)
        : await rejectClubBookingAction(clubId, bookingId);
    setBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
    void loadSlots();
  }

  async function handleCancelBooking(bookingId: string) {
    setError(null);
    setCancelBusyId(bookingId);
    const res = await cancelClubBookingAction(clubId, bookingId);
    setCancelBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setExpandedBookingId(null);
    router.refresh();
    void loadSlots();
  }

  function openManualReservation(slot: { start: string; end: string }) {
    setError(null);
    setManualSlot(slot);
    setManualPlayers([{ name: "", phone: "" }]);
    setManualNotes("");
    setManualModalOpen(true);
  }

  async function handleConfirmManualReservation() {
    if (!manualSlot || !validCourtId) return;
    const guests = manualPlayers
      .map((p) => ({
        name: p.name.trim(),
        phone: p.phone.trim(),
      }))
      .filter((p) => p.name.length > 0);
    if (guests.length === 0) {
      setError("Agregá al menos un jugador con nombre.");
      return;
    }
    setError(null);
    setManualBusy(true);
    const res = await createManualCourtBookingAction(
      clubId,
      validCourtId,
      manualSlot.start,
      guests,
      manualNotes.trim() || undefined,
    );
    setManualBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const fresh = await refreshClubReservationsAction(clubId);
    if (fresh.ok) {
      setHotReservations(fresh.reservations);
    }
    setManualModalOpen(false);
    setManualSlot(null);
    router.refresh();
    void loadSlots();
  }

  const selectedCourt = initialCourts.find((c) => c.id === validCourtId);
  const courtSelectLabel = selectedCourt
    ? courtSelectLine(selectedCourt)
    : "Seleccioná una cancha";

  const longDateLabel = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

      {mode === "list" ? (
        <div className="flex items-center gap-2">
          <label className="text-muted-foreground text-xs font-medium">
            Cancha
          </label>
          <select
            value={listCourtId}
            onChange={(e) => setListCourtId(e.target.value)}
            className="border-input bg-background text-foreground focus-visible:ring-ring h-9 min-w-[240px] rounded-lg border px-2.5 text-sm shadow-sm outline-none focus-visible:ring-2"
          >
            <option value="ALL">Todas</option>
            {initialCourts.map((c) => (
              <option key={c.id} value={c.id}>
                {courtSelectLine(c)}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {mode === "list" ? (
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
      ) : null}

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
                  <tr key={r.id} className="border-border/70 border-t">
                    <td className="px-4 py-3 text-xs">{r.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      {r.user.fullName ?? "Sin nombre"}
                    </td>
                    <td className="px-4 py-3">
                      {r.court.name.trim() || "Sin nombre"}
                    </td>
                    <td className="px-4 py-3">{fmtDate(r.start)}</td>
                    <td className="px-4 py-3">{`${fmtTime(r.start)}-${fmtTime(r.end)}`}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            STATUS_CLASSNAMES[r.status],
                          )}
                        >
                          {STATUS_LABELS[r.status]}
                        </span>
                        {isTentativePublicOpenMatch(r) ? (
                          <span className="text-amber-800 dark:text-amber-200 text-xs font-semibold">
                            Turno libre (partido abierto)
                          </span>
                        ) : null}
                      </div>
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="lg:w-72 shrink-0 space-y-4">
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Cancha
              </label>
              {initialCourts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No hay canchas.{" "}
                  <Link
                    href="/dashboard/club/pistas"
                    className="text-primary font-medium underline-offset-2 hover:underline"
                  >
                    Crear en Pistas
                  </Link>
                </p>
              ) : (
                <select
                  value={validCourtId}
                  onChange={(e) => {
                    setExpandedBookingId(null);
                    setCourtId(e.target.value);
                  }}
                  className="border-input bg-background text-foreground focus-visible:ring-ring h-11 w-full rounded-xl border px-3 text-sm font-medium shadow-sm outline-none focus-visible:ring-2"
                >
                  {initialCourts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {courtSelectLine(c)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <MiniMonthCalendar
              viewMonth={viewMonth}
              onViewMonthChange={setViewMonth}
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setExpandedBookingId(null);
                setSelectedDate(d);
                setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
              }}
              markedDays={markedDays}
            />

            <div className="border-border bg-muted/20 space-y-2 rounded-xl border px-3 py-3 text-xs">
              <p className="text-muted-foreground font-semibold tracking-wide uppercase">
                Leyenda
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-muted-foreground">Disponible</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-sky-500" />
                  <span className="text-muted-foreground">Reservado</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="text-muted-foreground">
                    Partido abierto pendiente (turno libre)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-rose-400" />
                  <span className="text-muted-foreground">Cancelado</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-slate-400" />
                  <span className="text-muted-foreground">Día cerrado</span>
                </li>
              </ul>
            </div>
          </aside>

          <section className="border-border bg-card min-h-[420px] flex-1 rounded-2xl border p-5 shadow-sm">
            {initialCourts.length === 0 ? null : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-foreground text-lg font-semibold capitalize">
                    {longDateLabel}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    <span className="text-emerald-600 font-medium dark:text-emerald-400">
                      {dayStats.disponibles} disponibles
                    </span>
                    <span className="mx-2">·</span>
                    <span className="text-sky-600 font-medium dark:text-sky-400">
                      {dayStats.reservados} reservados
                    </span>
                    {dayStats.tentativosAbiertos > 0 ? (
                      <>
                        <span className="mx-2">·</span>
                        <span className="text-amber-700 font-medium dark:text-amber-300">
                          {dayStats.tentativosAbiertos}{" "}
                          {dayStats.tentativosAbiertos === 1
                            ? "partido abierto pendiente"
                            : "partidos abiertos pendientes"}
                        </span>
                      </>
                    ) : null}
                    <span className="mx-2">·</span>
                    <span className="text-rose-600 font-medium dark:text-rose-400">
                      {dayStats.cancelados} cancelados
                    </span>
                  </p>
                </div>

                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  {courtSelectLabel}
                </p>

                {slotsError ? (
                  <p className="text-destructive mt-4 text-sm">{slotsError}</p>
                ) : loadingSlots ? (
                  <p className="text-muted-foreground mt-10 text-center text-sm">
                    Cargando turnos…
                  </p>
                ) : slotRows.length === 0 ? (
                  <p className="text-muted-foreground mt-10 text-center text-sm">
                    No hay franjas para este día en esta cancha.
                  </p>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {slotRows.map((row, rowIndex) => {
                      const rangeLabel = `${fmtTimeUtc(row.start)} – ${fmtTimeUtc(row.end)}`;
                      const isAvail = row.kind === "available";
                      const isRes = row.kind === "reserved";
                      const isTent =
                        row.kind === "tentativeOpen" && row.booking != null;
                      const isClosed = row.kind === "closed";
                      const tentBooking = isTent ? row.booking : null;
                      const maxP = tentBooking?.maxPlayers ?? 4;
                      const filledP = tentBooking
                        ? matchParticipantsCount(tentBooking)
                        : 0;

                      const isExpanded =
                        (isRes || isTent) &&
                        row.booking &&
                        expandedBookingId === row.booking.id;

                      const interactiveHeader = isAvail || isRes || isTent;

                      return (
                        <li
                          key={`${validCourtId}-${formatLocalYmd(selectedDate)}-${rowIndex}-${row.kind}`}
                          className={cn(
                            "overflow-hidden rounded-xl border",
                            isAvail &&
                              "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/25",
                            isRes &&
                              "border-sky-200/80 bg-sky-50/50 dark:border-sky-900/30 dark:bg-sky-950/25",
                            isTent &&
                              "border-amber-200/90 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30",
                            isClosed &&
                              "border-border bg-muted/30 text-muted-foreground",
                          )}
                        >
                          <div
                            role={interactiveHeader ? "button" : undefined}
                            tabIndex={interactiveHeader ? 0 : undefined}
                            className={cn(
                              "flex items-stretch",
                              isAvail &&
                                "cursor-pointer hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40",
                              isRes &&
                                "cursor-pointer hover:bg-sky-100/40 dark:hover:bg-sky-950/40",
                              isTent &&
                                "cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-950/35",
                            )}
                            onClick={() => {
                              if (isAvail) {
                                openManualReservation({
                                  start: row.start,
                                  end: row.end,
                                });
                                return;
                              }
                              if ((isRes || isTent) && row.booking) {
                                setExpandedBookingId((prev) =>
                                  prev === row.booking!.id
                                    ? null
                                    : row.booking!.id,
                                );
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                isAvail &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                openManualReservation({
                                  start: row.start,
                                  end: row.end,
                                });
                                return;
                              }
                              if (
                                !(isRes || isTent) ||
                                !row.booking ||
                                (e.key !== "Enter" && e.key !== " ")
                              ) {
                                return;
                              }
                              e.preventDefault();
                              setExpandedBookingId((prev) =>
                                prev === row.booking!.id
                                  ? null
                                  : row.booking!.id,
                              );
                            }}
                          >
                            <div
                              className={cn(
                                "w-1.5 shrink-0",
                                isAvail && "bg-emerald-500",
                                isRes && "bg-sky-500",
                                isTent && "bg-amber-500",
                                isClosed && "bg-slate-400",
                              )}
                            />
                            <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3">
                              <div className="min-w-0">
                                <p className="text-foreground font-semibold">
                                  {rangeLabel}
                                </p>
                                {isAvail ? (
                                  <p className="text-muted-foreground mt-0.5 text-sm">
                                    Disponible
                                  </p>
                                ) : null}
                                {isRes && row.booking ? (
                                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-sky-700 dark:text-sky-300">
                                    <User className="size-3.5 shrink-0 opacity-80" />
                                    <span className="truncate font-medium">
                                      {row.booking.user.fullName ??
                                        "Sin nombre"}
                                    </span>
                                  </p>
                                ) : null}
                                {isTent && tentBooking ? (
                                  <div className="mt-0.5 space-y-0.5">
                                    <p className="inline-flex flex-wrap items-center gap-1.5 text-sm font-medium text-amber-800 dark:text-amber-200">
                                      <Users className="size-3.5 shrink-0 opacity-90" />
                                      <span>
                                        Partido pendiente · {filledP}/{maxP}{" "}
                                        jugadores
                                      </span>
                                    </p>
                                    <p className="text-muted-foreground max-w-[min(100%,420px)] text-xs font-medium leading-snug">
                                      Hay un partido esperando en este horario;
                                      el turno sigue libre para otra reserva
                                      hasta completar el cupo.
                                    </p>
                                  </div>
                                ) : null}
                                {isClosed ? (
                                  <p className="mt-0.5 text-sm">
                                    No disponible
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                {isAvail ? (
                                  <button
                                    type="button"
                                    className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openManualReservation({
                                        start: row.start,
                                        end: row.end,
                                      });
                                    }}
                                  >
                                    Libre
                                  </button>
                                ) : null}
                                {isTent ? (
                                  <>
                                    <span className="inline-flex rounded-full bg-amber-200/90 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
                                      Pendiente
                                    </span>
                                    <button
                                      type="button"
                                      className="inline-flex rounded-full border-2 border-emerald-500/70 bg-transparent px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openManualReservation({
                                          start: row.start,
                                          end: row.end,
                                        });
                                      }}
                                    >
                                      Libre
                                    </button>
                                    <ChevronDown
                                      className={cn(
                                        "size-4 shrink-0 text-amber-800 transition-transform dark:text-amber-200",
                                        isExpanded && "rotate-180",
                                      )}
                                      aria-hidden
                                    />
                                  </>
                                ) : null}
                                {isRes && row.booking ? (
                                  <>
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => e.stopPropagation()}
                                    >
                                      {row.booking.status === "PENDING" ? (
                                        <DropdownMenu>
                                          <DropdownMenuTrigger
                                            className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800 outline-none hover:bg-sky-200/80 dark:bg-sky-900/50 dark:text-sky-100 dark:hover:bg-sky-900/70"
                                            disabled={busyId === row.booking.id}
                                          >
                                            Reservado
                                            <ChevronDown className="size-3.5 opacity-70" />
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                              onClick={() =>
                                                void onAction(
                                                  row.booking!.id,
                                                  "approve",
                                                )
                                              }
                                            >
                                              Confirmar reserva
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              variant="destructive"
                                              onClick={() =>
                                                void onAction(
                                                  row.booking!.id,
                                                  "reject",
                                                )
                                              }
                                            >
                                              Rechazar
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-900/50 dark:text-sky-100">
                                          Reservado
                                        </span>
                                      )}
                                    </div>
                                    <ChevronDown
                                      className={cn(
                                        "size-4 shrink-0 text-sky-700 transition-transform dark:text-sky-300",
                                        isExpanded && "rotate-180",
                                      )}
                                      aria-hidden
                                    />
                                  </>
                                ) : null}
                                {isClosed ? (
                                  <span className="inline-flex rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                    Cerrado
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {(isRes || isTent) && row.booking && isExpanded ? (
                            <BookingDetailCard
                              booking={row.booking}
                              cancelling={cancelBusyId === row.booking.id}
                              onCancel={() =>
                                void handleCancelBooking(row.booking!.id)
                              }
                            />
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>
        </div>
      )}

      <Dialog
        open={manualModalOpen}
        onOpenChange={(nextOpen) => {
          setManualModalOpen(nextOpen);
          if (!nextOpen) setManualSlot(null);
        }}
      >
        <DialogContent className="sm:max-w-[640px] rounded-2xl p-0 overflow-hidden">
          <div className="p-5 sm:p-6">
            <DialogTitle className="text-base font-semibold">
              Agendar reserva manual
            </DialogTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
              {manualSlot ? ` - ${fmtTimeUtc(manualSlot.start)}` : ""}
              {selectedCourt ? ` - ${selectedCourt.name}` : ""}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Los datos de los jugadores se guardan para identificar la reserva.
            </p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-semibold">Jugadores</p>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                onClick={() =>
                  setManualPlayers((prev) => [...prev, { name: "", phone: "" }])
                }
              >
                + Agregar
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {manualPlayers.map((player, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-muted/20 p-3"
                >
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    Jugador {idx + 1}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Nombre *
                      </label>
                      <Input
                        value={player.name}
                        onChange={(e) =>
                          setManualPlayers((prev) =>
                            prev.map((p, pIdx) =>
                              pIdx === idx ? { ...p, name: e.target.value } : p,
                            ),
                          )
                        }
                        placeholder="Nombre"
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Teléfono
                      </label>
                      <Input
                        value={player.phone}
                        onChange={(e) =>
                          setManualPlayers((prev) =>
                            prev.map((p, pIdx) =>
                              pIdx === idx
                                ? { ...p, phone: e.target.value }
                                : p,
                            ),
                          )
                        }
                        placeholder="+34"
                        className="h-10 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium">
                Notas (opcional)
              </label>
              <Textarea
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="Ej: Reserva por teléfono, pagó en efectivo..."
                className="min-h-[86px] rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border bg-background px-5 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => setManualModalOpen(false)}
              disabled={manualBusy}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="rounded-lg"
              onClick={() => void handleConfirmManualReservation()}
              disabled={
                manualBusy ||
                !manualSlot ||
                !manualPlayers.some((p) => p.name.trim().length > 0)
              }
            >
              {manualBusy ? "Confirmando..." : "Confirmar reserva"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
