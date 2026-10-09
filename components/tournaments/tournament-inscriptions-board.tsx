"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Plus, Trash2, Users } from "lucide-react";

import {
  cancelTournamentRegistrationAction,
  createClubTournamentRegistrationAction,
  updateRegistrationPaymentAction,
} from "@/actions/tournaments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  TournamentCategory,
  TournamentPlayFormat,
  TournamentSport,
} from "@/types/tournament";

type Props = {
  clubId: string;
  tournamentId: string;
  sport: TournamentSport;
  playFormat: TournamentPlayFormat;
  categories: TournamentCategory[];
  startsAt: string;
  endsAt: string;
};

type PaymentSide = "player" | "partner";

type FlatRegistration = {
  id: string;
  playerName: string;
  partnerName: string;
  playerEmail: string | null;
  partnerEmail: string | null;
  categoryName: string;
  categoryId: string;
  preferredTimeNotes: string | null;
  createdAt: string;
  playerIsPaid: boolean;
  partnerIsPaid: boolean;
  playerPaymentMethod: string | null;
  partnerPaymentMethod: string | null;
  feeCents: number;
};

const HOUR_OPTIONS = Array.from({ length: 16 }, (_, index) => {
  const hour = String(index + 8).padStart(2, "0");
  return `${hour}:00`;
});

type DayAvailability = {
  any: boolean;
  from: string;
  to: string;
};

const WEEKDAYS_ES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function tournamentDaysBetween(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  const days: Array<{ key: string; label: string }> = [];
  const cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
  );
  const last = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()),
  );
  while (cursor <= last) {
    const key = cursor.toISOString().slice(0, 10);
    days.push({
      key,
      label: `${WEEKDAYS_ES[cursor.getUTCDay()]} ${cursor.getUTCDate()}`,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function buildPreferredTimeNotes(params: {
  days: Array<{ key: string; label: string }>;
  selectedDays: string[];
  dayAvailability: Record<string, DayAvailability>;
  notes: string;
}) {
  const lines = params.days
    .filter((day) => params.selectedDays.includes(day.key))
    .map((day) => {
      const availability = params.dayAvailability[day.key];
      if (!availability) return null;
      if (availability.any) return `${day.label}: En cualquier horario`;
      if (!availability.from || !availability.to) return null;
      return `${day.label}: ${availability.from} a ${availability.to}`;
    })
    .filter(Boolean) as string[];
  const notes = params.notes.trim();
  if (notes) lines.push(`Notas: ${notes}`);
  return lines.join("\n");
}

function flatten(categories: TournamentCategory[]): FlatRegistration[] {
  const items: FlatRegistration[] = [];
  for (const category of categories) {
    for (const reg of category.registrations) {
      const legacyBothPaid = reg.isPaid === true;
      items.push({
        id: reg.id,
        playerName: reg.playerProfile.fullName ?? "Jugador",
        partnerName: reg.partnerName,
        playerEmail: reg.playerProfile.email,
        partnerEmail: reg.partnerEmail,
        categoryName: category.name,
        categoryId: category.id,
        preferredTimeNotes: reg.preferredTimeNotes,
        createdAt: reg.createdAt,
        playerIsPaid: reg.playerIsPaid ?? legacyBothPaid,
        partnerIsPaid: reg.partnerIsPaid ?? legacyBothPaid,
        playerPaymentMethod:
          reg.playerPaymentMethod ??
          (legacyBothPaid ? reg.paymentMethod : null),
        partnerPaymentMethod:
          reg.partnerPaymentMethod ??
          (legacyBothPaid ? reg.paymentMethod : null),
        feeCents: category.registrationFeeCents,
      });
    }
  }
  return items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function formatCurrency(cents: number) {
  return `$${cents.toLocaleString("es-AR")}`;
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

const emptyForm = {
  categoryId: "",
  player1Name: "",
  player1Contact: "",
  player2Name: "",
  player2Contact: "",
  notes: "",
};

type PaymentOverride = {
  isPaid: boolean;
  method: string | null;
};

export function TournamentInscriptionsBoard({
  clubId,
  tournamentId,
  sport,
  playFormat,
  categories,
  startsAt,
  endsAt,
}: Props) {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayAvailability, setDayAvailability] = useState<
    Record<string, DayAvailability>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FlatRegistration | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const isSingles = sport === "TENNIS" && playFormat === "SINGLES";

  const allRegistrations = useMemo(() => flatten(categories), [categories]);
  const days = useMemo(
    () => tournamentDaysBetween(startsAt, endsAt),
    [startsAt, endsAt],
  );

  const [paymentOverrides, setPaymentOverrides] = useState<
    Record<string, PaymentOverride>
  >({});

  const overrideKey = (id: string, side: PaymentSide) => `${id}:${side}`;

  const getSidePaid = (reg: FlatRegistration, side: PaymentSide) => {
    const override = paymentOverrides[overrideKey(reg.id, side)];
    if (override) return override.isPaid;
    return side === "player" ? reg.playerIsPaid : reg.partnerIsPaid;
  };

  const getSideMethod = (reg: FlatRegistration, side: PaymentSide) => {
    const override = paymentOverrides[overrideKey(reg.id, side)];
    if (override) return override.method;
    return side === "player"
      ? reg.playerPaymentMethod
      : reg.partnerPaymentMethod;
  };

  const persistPayment = (
    id: string,
    side: PaymentSide,
    isPaid: boolean,
    paymentMethod: string | null,
  ) => {
    startTransition(async () => {
      await updateRegistrationPaymentAction(clubId, tournamentId, id, {
        side,
        isPaid,
        paymentMethod,
      });
    });
  };

  const togglePaid = (id: string, side: PaymentSide) => {
    const reg = allRegistrations.find((r) => r.id === id);
    if (!reg) return;
    const current = getSidePaid(reg, side);
    const newPaid = !current;
    const method = newPaid ? (getSideMethod(reg, side) ?? null) : null;
    setPaymentOverrides((prev) => ({
      ...prev,
      [overrideKey(id, side)]: { isPaid: newPaid, method },
    }));
    persistPayment(id, side, newPaid, method);
  };

  const changeMethod = (id: string, side: PaymentSide, method: string) => {
    const reg = allRegistrations.find((r) => r.id === id);
    if (!reg) return;
    const value = method === "Método" ? null : method;
    const isPaid = getSidePaid(reg, side);
    setPaymentOverrides((prev) => ({
      ...prev,
      [overrideKey(id, side)]: { isPaid, method: value },
    }));
    persistPayment(id, side, isPaid, value);
  };

  const filtered = useMemo(() => {
    if (filterCategory === "all") return allRegistrations;
    return allRegistrations.filter((r) => r.categoryId === filterCategory);
  }, [allRegistrations, filterCategory]);

  const stats = useMemo(() => {
    const pairs = filtered.length;
    const playersTotal = pairs * (isSingles ? 1 : 2);
    let playersPaid = 0;
    let cashCents = 0;
    let transferCents = 0;

    for (const reg of filtered) {
      const sides: PaymentSide[] = isSingles
        ? ["player"]
        : ["player", "partner"];
      for (const side of sides) {
        const override = paymentOverrides[`${reg.id}:${side}`];
        const isPaid =
          override?.isPaid ??
          (side === "player" ? reg.playerIsPaid : reg.partnerIsPaid);
        if (!isPaid) continue;
        playersPaid += 1;
        const method =
          override?.method ??
          (side === "player"
            ? reg.playerPaymentMethod
            : reg.partnerPaymentMethod);
        if (method === "Efectivo") cashCents += reg.feeCents;
        else if (method === "Transferencia") transferCents += reg.feeCents;
      }
    }

    return {
      pairs,
      playersPaid,
      playersTotal,
      cashCents,
      transferCents,
      revenueCents: cashCents + transferCents,
    };
  }, [filtered, isSingles, paymentOverrides]);

  const openDialog = () => {
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });
    setSelectedDays([]);
    setDayAvailability({});
    setFormError(null);
    setDialogOpen(true);
  };

  const toggleDay = (key: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(key)) {
        setDayAvailability((slots) => {
          const next = { ...slots };
          delete next[key];
          return next;
        });
        return prev.filter((d) => d !== key);
      }
      setDayAvailability((slots) => ({
        ...slots,
        [key]: slots[key] ?? { any: false, from: "09:00", to: "18:00" },
      }));
      return [...prev, key];
    });
  };

  const patchDayAvailability = (
    dayKey: string,
    patch: Partial<DayAvailability>,
  ) => {
    setDayAvailability((prev) => {
      const current = prev[dayKey] ?? {
        any: false,
        from: "09:00",
        to: "18:00",
      };
      return {
        ...prev,
        [dayKey]: { ...current, ...patch },
      };
    });
  };

  const submitPair = () => {
    setFormError(null);
    if (!form.categoryId) {
      setFormError("Seleccioná una categoría.");
      return;
    }
    if (!form.player1Contact.trim()) {
      setFormError("Indicá el mail o teléfono del jugador 1.");
      return;
    }
    if (!isSingles) {
      if (!form.player2Name.trim()) {
        setFormError("Indicá el nombre del jugador 2.");
        return;
      }
      if (!form.player2Contact.trim()) {
        setFormError("Indicá el mail o teléfono del jugador 2.");
        return;
      }
    }

    const invalidRange = selectedDays.some((dayKey) => {
      const availability = dayAvailability[dayKey];
      if (!availability) return true;
      if (availability.any) return false;
      return (
        !availability.from ||
        !availability.to ||
        availability.from >= availability.to
      );
    });
    if (selectedDays.length > 0 && invalidRange) {
      setFormError("Completá un rango válido para cada día seleccionado.");
      return;
    }

    const preferredTimeNotes = buildPreferredTimeNotes({
      days,
      selectedDays,
      dayAvailability,
      notes: form.notes,
    });

    startTransition(async () => {
      const result = await createClubTournamentRegistrationAction(
        clubId,
        tournamentId,
        form.categoryId,
        {
          playerContact: form.player1Contact.trim(),
          playerName: form.player1Name.trim() || undefined,
          partnerName: isSingles ? undefined : form.player2Name.trim(),
          partnerContact: isSingles ? undefined : form.player2Contact.trim(),
          preferredTimeNotes: preferredTimeNotes || undefined,
        },
      );
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      setDialogOpen(false);
      router.refresh();
    });
  };

  const selectedDayRows = days.filter((day) => selectedDays.includes(day.key));

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await cancelTournamentRegistrationAction(
        clubId,
        tournamentId,
        deleteTarget.categoryId,
        deleteTarget.id,
      );
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    });
  };

  const renderPlayerPayment = (
    reg: FlatRegistration,
    side: PaymentSide,
    fullName: string,
  ) => {
    const paid = getSidePaid(reg, side);
    const method = getSideMethod(reg, side);
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="shrink-0 cursor-pointer"
          onClick={() => togglePaid(reg.id, side)}
          aria-label={
            paid
              ? `Marcar a ${fullName} como no pagado`
              : `Marcar a ${fullName} como pagado`
          }
        >
          {paid ? (
            <CheckCircle2 className="size-5 text-primary" />
          ) : (
            <Circle className="size-5 text-muted-foreground/30" />
          )}
        </button>
        <select
          className="border-input bg-background h-8 w-30 shrink-0 rounded-lg border px-2 text-xs"
          value={method ?? "Método"}
          onChange={(e) => changeMethod(reg.id, side, e.target.value)}
        >
          <option>Método</option>
          <option>Efectivo</option>
          <option>Transferencia</option>
        </select>
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {firstName(fullName)} · {formatCurrency(reg.feeCents)}
        </span>
      </div>
    );
  };

  return (
    <section className="space-y-3 p-4">
      <div className="rounded-xl border border-border/80 border-l-4 border-l-primary bg-card px-5 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="border-input bg-background h-10 min-w-48 rounded-lg border px-3 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="inline-flex items-center gap-2 rounded-full border border-border border-l-4 border-l-sky-400 bg-background px-4 py-2 text-sm text-muted-foreground">
            <Users className="size-4 text-muted-foreground" />
            {isSingles ? "Inscriptos:" : "Inscriptas:"}{" "}
            <strong className="font-semibold text-foreground">
              {stats.pairs}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border border-l-4 border-l-lime-400 bg-background px-4 py-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            Jugadores pagos:{" "}
            <strong className="font-semibold text-foreground">
              {stats.playersPaid}/{stats.playersTotal}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border border-l-4 border-l-cyan-400 bg-background px-4 py-2 text-sm text-muted-foreground">
            Efectivo:{" "}
            <strong className="font-semibold text-foreground">
              {formatCurrency(stats.cashCents)}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border border-l-4 border-l-violet-400 bg-background px-4 py-2 text-sm text-muted-foreground">
            Transferencias:{" "}
            <strong className="font-semibold text-foreground">
              {formatCurrency(stats.transferCents)}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border border-l-4 border-l-primary bg-background px-4 py-2 text-sm text-muted-foreground">
            $ Recaudado:{" "}
            <strong className="font-semibold text-foreground">
              {formatCurrency(stats.revenueCents)}
            </strong>
          </span>
          <div className="ml-auto">
            <Button type="button" onClick={openDialog} disabled={isPending}>
              <Plus className="size-4" />
              {isSingles ? "Agregar jugador" : "Agregar pareja"}
            </Button>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs font-medium text-muted-foreground">
                <th className="py-3 pl-5 pr-3 font-medium">
                  {isSingles ? "Jugador" : "Pareja"}
                </th>
                <th className="px-3 py-3 font-medium">Mails</th>
                <th className="px-3 py-3 font-medium">Categoría</th>
                <th className="px-3 py-3 font-medium">$ Precio</th>
                <th className="px-3 py-3 font-medium">Preferencia</th>
                <th className="px-3 py-3 font-medium">Inscripción</th>
                <th className="py-3 pl-3 pr-5 font-medium">Pago por jugador</th>
                <th
                  className="w-12 py-3 pr-5 font-medium"
                  aria-label="Acciones"
                />
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-b border-border/40 last:border-b-0"
                >
                  <td className="py-4 pl-5 pr-3 align-top">
                    <p className="text-sm font-semibold leading-snug text-foreground">
                      {reg.playerName}
                    </p>
                    {!isSingles ? (
                      <p className="text-sm leading-snug text-muted-foreground">
                        {reg.partnerName}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-4 align-top">
                    <p className="truncate text-xs leading-relaxed text-muted-foreground">
                      {reg.playerEmail ?? "—"}
                    </p>
                    {!isSingles ? (
                      <p className="truncate text-xs leading-relaxed text-muted-foreground">
                        {reg.partnerEmail ?? "—"}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-4 align-middle text-sm text-foreground">
                    {reg.categoryName}
                  </td>
                  <td className="px-3 py-4 align-middle text-sm font-medium text-foreground">
                    {formatCurrency(reg.feeCents)}
                  </td>
                  <td className="px-3 py-4 align-middle text-xs leading-snug whitespace-pre-line text-muted-foreground">
                    {reg.preferredTimeNotes || "—"}
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <span className="text-xs text-muted-foreground">
                      {reg.createdAt.slice(0, 10)}
                    </span>
                  </td>
                  <td className="space-y-2 py-4 pl-3 pr-3 align-middle">
                    {renderPlayerPayment(reg, "player", reg.playerName)}
                    {!isSingles
                      ? renderPlayerPayment(reg, "partner", reg.partnerName)
                      : null}
                  </td>
                  <td className="py-4 pr-5 align-middle">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteTarget(reg);
                      }}
                      disabled={isPending}
                      className="text-muted-foreground/70 rounded-md p-1.5 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={
                        isSingles
                          ? `Eliminar jugador ${reg.playerName}`
                          : `Eliminar pareja ${reg.playerName} / ${reg.partnerName}`
                      }
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
          No hay inscripciones todavía.
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isSingles ? "Agregar jugador" : "Agregar pareja"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <select
                className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-muted-foreground rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-xs leading-relaxed">
              {isSingles
                ? "El jugador debe tener cuenta en Puntoo. El mail o teléfono tiene que coincidir con su usuario; el nombre lo cargás vos."
                : "Ambos jugadores deben tener cuenta en Puntoo. El mail o teléfono tiene que coincidir con su usuario; el nombre lo cargás vos."}
            </p>

            <div className="space-y-3 rounded-lg border border-border/70 p-3">
              <p className="text-sm font-semibold text-foreground">Jugador 1</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nombre</Label>
                  <Input
                    value={form.player1Name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        player1Name: e.target.value,
                      }))
                    }
                    placeholder="Ej: Nicolás Ramírez"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mail o teléfono</Label>
                  <Input
                    value={form.player1Contact}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        player1Contact: e.target.value,
                      }))
                    }
                    placeholder="mail@ejemplo.com o +54 9..."
                  />
                </div>
              </div>
            </div>

            {!isSingles ? (
              <div className="space-y-3 rounded-lg border border-border/70 p-3">
                <p className="text-sm font-semibold text-foreground">
                  Jugador 2
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Nombre</Label>
                    <Input
                      value={form.player2Name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          player2Name: e.target.value,
                        }))
                      }
                      placeholder="Ej: Martín Sosa"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mail o teléfono</Label>
                    <Input
                      value={form.player2Contact}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          player2Contact: e.target.value,
                        }))
                      }
                      placeholder="mail@ejemplo.com o +54 9..."
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label>Disponibilidad</Label>
              <p className="text-muted-foreground text-xs">
                Activá cada día y elegí un rango horario.
              </p>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => {
                  const active = selectedDays.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              {selectedDayRows.length ? (
                <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3">
                  {selectedDayRows.map((day) => (
                    <div key={day.key} className="space-y-2">
                      <span className="text-xs font-semibold text-foreground">
                        {day.label}
                      </span>
                      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground">
                            Desde
                          </Label>
                          <select
                            className="border-input bg-background h-9 w-full rounded-lg border px-2 text-sm"
                            value={dayAvailability[day.key]?.from ?? "09:00"}
                            disabled={dayAvailability[day.key]?.any === true}
                            onChange={(event) =>
                              patchDayAvailability(day.key, {
                                from: event.target.value,
                              })
                            }
                          >
                            {HOUR_OPTIONS.map((hour) => (
                              <option
                                key={`${day.key}-from-${hour}`}
                                value={hour}
                              >
                                {hour}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground">
                            Hasta
                          </Label>
                          <select
                            className="border-input bg-background h-9 w-full rounded-lg border px-2 text-sm"
                            value={dayAvailability[day.key]?.to ?? "18:00"}
                            disabled={dayAvailability[day.key]?.any === true}
                            onChange={(event) =>
                              patchDayAvailability(day.key, {
                                to: event.target.value,
                              })
                            }
                          >
                            {HOUR_OPTIONS.map((hour) => (
                              <option
                                key={`${day.key}-to-${hour}`}
                                value={hour}
                              >
                                {hour}
                              </option>
                            ))}
                          </select>
                        </div>
                        <label className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={dayAvailability[day.key]?.any === true}
                            onChange={(event) =>
                              patchDayAvailability(day.key, {
                                any: event.target.checked,
                              })
                            }
                          />
                          En cualquier horario
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Notas</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Detalle a considerar para el fixture"
                rows={3}
              />
            </div>

            {formError ? (
              <p className="text-sm text-rose-600">{formError}</p>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={submitPair} disabled={isPending}>
                {isSingles ? "Guardar jugador" : "Guardar pareja"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isSingles ? "Eliminar jugador" : "Eliminar pareja"}
            </DialogTitle>
          </DialogHeader>
          {deleteTarget ? (
            <p className="text-sm text-muted-foreground">
              ¿Eliminar la inscripción de{" "}
              <strong className="font-medium text-foreground">
                {isSingles
                  ? deleteTarget.playerName
                  : `${deleteTarget.playerName} / ${deleteTarget.partnerName}`}
              </strong>{" "}
              en {deleteTarget.categoryName}? Si ya estaba sorteada, se quitará
              de las zonas y de los partidos pendientes.
            </p>
          ) : null}
          {deleteError ? (
            <p className="text-sm text-rose-600">{deleteError}</p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending
                ? "Eliminando..."
                : isSingles
                  ? "Eliminar jugador"
                  : "Eliminar pareja"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
