"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Circle, Users } from "lucide-react";

import { updateRegistrationPaymentAction } from "@/actions/tournaments";
import type { TournamentCategory } from "@/types/tournament";

type Props = {
  clubId: string;
  tournamentId: string;
  categories: TournamentCategory[];
};

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
  isPaid: boolean;
  paymentMethod: string | null;
  feeCents: number;
};

function flatten(categories: TournamentCategory[]): FlatRegistration[] {
  const items: FlatRegistration[] = [];
  for (const category of categories) {
    for (const reg of category.registrations) {
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
        isPaid: reg.isPaid,
        paymentMethod: reg.paymentMethod,
        feeCents: category.registrationFeeCents,
      });
    }
  }
  return items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function formatCurrency(cents: number) {
  return `$${(cents).toLocaleString("es-AR")}`;
}

export function TournamentInscriptionsBoard({ clubId, tournamentId, categories }: Props) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [isPending, startTransition] = useTransition();

  const allRegistrations = useMemo(() => flatten(categories), [categories]);

  const [paidOverrides, setPaidOverrides] = useState<Record<string, boolean>>({});
  const [methodOverrides, setMethodOverrides] = useState<Record<string, string | null>>({});

  const getIsPaid = (reg: FlatRegistration) =>
    paidOverrides[reg.id] ?? reg.isPaid;

  const getPaymentMethod = (reg: FlatRegistration) =>
    methodOverrides[reg.id] !== undefined ? methodOverrides[reg.id] : reg.paymentMethod;

  const persistPayment = (id: string, isPaid: boolean, paymentMethod: string | null) => {
    startTransition(async () => {
      await updateRegistrationPaymentAction(clubId, tournamentId, id, {
        isPaid,
        paymentMethod,
      });
    });
  };

  const togglePaid = (id: string) => {
    const reg = allRegistrations.find((r) => r.id === id);
    if (!reg) return;
    const current = getIsPaid(reg);
    const newPaid = !current;
    const method = newPaid ? (getPaymentMethod(reg) ?? null) : null;
    setPaidOverrides((prev) => ({ ...prev, [id]: newPaid }));
    persistPayment(id, newPaid, method);
  };

  const changeMethod = (id: string, method: string) => {
    const reg = allRegistrations.find((r) => r.id === id);
    if (!reg) return;
    const value = method === "Método" ? null : method;
    setMethodOverrides((prev) => ({ ...prev, [id]: value }));
    persistPayment(id, getIsPaid(reg), value);
  };

  const filtered = useMemo(() => {
    if (filterCategory === "all") return allRegistrations;
    return allRegistrations.filter((r) => r.categoryId === filterCategory);
  }, [allRegistrations, filterCategory]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const paid = filtered.filter((r) => getIsPaid(r)).length;
    const revenue = filtered
      .filter((r) => getIsPaid(r))
      .reduce((acc, r) => acc + r.feeCents, 0);
    return { total, paid, revenue };
  }, [filtered, paidOverrides]);

  return (
    <section className="space-y-3 p-4">
      {/* Filter bar */}
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
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <Users className="size-4 text-muted-foreground" />
            Inscriptas: <strong className="font-semibold text-foreground">{stats.total}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            Pagadas: <strong className="font-semibold text-foreground">{stats.paid}</strong>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <span className="font-semibold text-muted-foreground">$</span>
            Recaudado: <strong className="font-semibold text-foreground">{formatCurrency(stats.revenue)}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      {filtered.length ? (
        <div className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs font-medium text-muted-foreground">
                <th className="py-3 pl-5 pr-3 font-medium">Pareja</th>
                <th className="px-3 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Mails
                  </span>
                </th>
                <th className="px-3 py-3 font-medium">Categoría</th>
                <th className="px-3 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Preferencia
                  </span>
                </th>
                <th className="px-3 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    Inscripción
                  </span>
                </th>
                <th className="py-3 pl-3 pr-5 font-medium">Pago</th>
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
                    <p className="text-sm leading-snug text-muted-foreground">
                      {reg.partnerName}
                    </p>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <p className="truncate text-xs leading-relaxed text-muted-foreground">
                      {reg.playerEmail ?? "—"}
                    </p>
                    <p className="truncate text-xs leading-relaxed text-muted-foreground">
                      {reg.partnerEmail ?? "—"}
                    </p>
                  </td>
                  <td className="px-3 py-4 align-middle text-sm text-foreground">
                    {reg.categoryName}
                  </td>
                  <td className="px-3 py-4 align-middle text-xs leading-snug text-muted-foreground">
                    {reg.preferredTimeNotes || "—"}
                  </td>
                  <td className="px-3 py-4 align-middle">
                    <span className="text-xs text-muted-foreground">
                      {reg.createdAt.slice(0, 10)}
                    </span>
                  </td>
                  <td className="py-4 pl-3 pr-5 align-middle">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="shrink-0 cursor-pointer"
                        onClick={() => togglePaid(reg.id)}
                        aria-label={getIsPaid(reg) ? "Marcar como no pagado" : "Marcar como pagado"}
                      >
                        {getIsPaid(reg) ? (
                          <CheckCircle2 className="size-5 text-primary" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground/30" />
                        )}
                      </button>
                      <select
                        className="border-input bg-background h-8 flex-1 rounded-lg border px-2 text-xs"
                        value={getPaymentMethod(reg) ?? "Método"}
                        onChange={(e) => changeMethod(reg.id, e.target.value)}
                      >
                        <option>Método</option>
                        <option>Efectivo</option>
                        <option>Transferencia</option>
                      </select>
                    </div>
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
    </section>
  );
}
