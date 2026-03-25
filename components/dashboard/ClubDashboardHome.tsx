import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, ChartNoAxesCombined, Euro } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  ClubDashboardRange,
  ClubDashboardResponse,
} from "@/types/club-dashboard";

const RANGE_TABS: { key: ClubDashboardRange; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Próxima semana" },
  { key: "month", label: "Próximo mes" },
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  CONFIRMED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

function formatPeriodSubtitle(
  range: ClubDashboardRange,
  periodStartIso: string,
): string {
  const d = new Date(periodStartIso);
  const longDate = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);

  if (range === "today") {
    return `Resumen del día — ${longDate}`;
  }
  if (range === "week") {
    return `Próximos 7 días — desde ${longDate}`;
  }
  return `Próximos 30 días — desde ${longDate}`;
}

function formatTimeRange(startIso: string, endIso: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };
  const a = new Intl.DateTimeFormat("es", opts).format(new Date(startIso));
  const b = new Intl.DateTimeFormat("es", opts).format(new Date(endIso));
  return `${a} – ${b}`;
}

function TrendLine({ pct, label }: { pct: number | null; label: string }) {
  if (pct === null) {
    return (
      <span className="text-muted-foreground text-xs font-normal">
        Sin comparación
      </span>
    );
  }
  const up = pct >= 0;
  return (
    <span
      className={cn(
        "text-xs font-medium",
        up
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
      )}
    >
      {up ? "+" : ""}
      {pct}% {label}
    </span>
  );
}

function MetricCard({
  title,
  value,
  changePercent,
  comparisonLabel,
  icon: Icon,
}: {
  title: string;
  value: string;
  changePercent: number | null;
  comparisonLabel: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="border-border/80 shadow-sm transition-shadow duration-150 ease-out hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground size-4 shrink-0 opacity-70" />
      </CardHeader>
      <CardContent>
        <p className="font-mono text-2xl font-semibold tracking-tight">
          {value}
        </p>
        <p className="mt-1">
          <TrendLine pct={changePercent} label={comparisonLabel} />
        </p>
      </CardContent>
    </Card>
  );
}

export function ClubDashboardHome({
  range,
  data,
}: {
  range: ClubDashboardRange;
  data: ClubDashboardResponse;
}) {
  const cmp = data.comparisonLabel;
  const eurFmt = new Intl.NumberFormat("es", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm capitalize">
            {formatPeriodSubtitle(range, data.period.start)}
          </p>
        </div>
        <div className="bg-muted/60 flex flex-wrap gap-1 rounded-lg p-1 ring-1 ring-foreground/5">
          {RANGE_TABS.map((t) => {
            const active = t.key === range;
            const href = (
              t.key === "today" ? "/dashboard" : `/dashboard?range=${t.key}`
            ) as Route;
            return (
              <Link
                key={t.key}
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Reservas"
          value={String(data.metrics.bookings.value)}
          changePercent={data.metrics.bookings.changePercent}
          comparisonLabel={cmp}
          icon={CalendarDays}
        />
        <MetricCard
          title="Ingresos estimados"
          value={eurFmt.format(data.metrics.revenue.valueEUR)}
          changePercent={data.metrics.revenue.changePercent}
          comparisonLabel={cmp}
          icon={Euro}
        />
        <MetricCard
          title="Ocupación de canchas"
          value={`${data.metrics.occupancy.valuePercent}%`}
          changePercent={data.metrics.occupancy.changePercent}
          comparisonLabel={cmp}
          icon={ChartNoAxesCombined}
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Últimas reservas
          </CardTitle>
          <p className="text-muted-foreground text-sm font-normal">
            En el periodo seleccionado, las más recientes primero.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {data.recentBookings.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No hay reservas en este periodo.
            </p>
          ) : (
            <ul className="divide-border divide-y">
              {data.recentBookings.map((b) => {
                const name = b.user.fullName?.trim() || "Usuario sin nombre";
                const detail = `${b.court.name} · ${formatTimeRange(b.start, b.end)}`;
                return (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {detail}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                        STATUS_CLASS[b.status] ?? "",
                      )}
                    >
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function ClubDashboardError() {
  return (
    <div className="border-destructive/40 bg-destructive/5 rounded-xl border p-6">
      <p className="text-destructive text-sm font-medium">
        No se pudieron cargar las métricas del club.
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Reintentá en unos segundos o comprobá que el servicio de API esté en
        marcha.
      </p>
    </div>
  );
}
