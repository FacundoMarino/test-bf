import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  Euro,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  ClubAnalyticsRange,
  ClubAnalyticsResponse,
} from "@/types/club-analytics";

const RANGE_TABS: { key: ClubAnalyticsRange; label: string; href: Route }[] = [
  {
    key: "week",
    label: "Semana",
    href: "/dashboard/club/metricas?range=week" as Route,
  },
  {
    key: "month",
    label: "Mes",
    href: "/dashboard/club/metricas?range=month" as Route,
  },
  {
    key: "year",
    label: "Año",
    href: "/dashboard/club/metricas?range=year" as Route,
  },
];

function summarySuffix(range: ClubAnalyticsRange): string {
  if (range === "week") return "en la semana";
  if (range === "year") return "en el año";
  return "en el mes";
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
        up ? "text-[#788ce3]" : "text-red-600 dark:text-red-400",
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

function barTone(pct: number): string {
  if (pct >= 70) return "bg-[#788ce3]";
  if (pct >= 45) return "bg-[#405fd3]";
  return "bg-muted-foreground/40";
}

export function ClubMetricsView({
  range,
  data,
}: {
  range: ClubAnalyticsRange;
  data: ClubAnalyticsResponse;
}) {
  const eurFmt = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });
  const suf = summarySuffix(range);
  const maxWeekRev = Math.max(
    1,
    ...data.revenueByWeekday.map((d) => d.amountEUR),
  );
  const maxPeak = Math.max(1, ...data.peakHours.map((p) => p.occupancyPercent));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Métricas
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rendimiento del club según el periodo seleccionado
          </p>
        </div>
        <div className="bg-muted/60 flex flex-wrap gap-1 rounded-lg p-1 ring-1 ring-foreground/5">
          {RANGE_TABS.map((t) => {
            const active = t.key === range;
            const href = (
              t.key === "month" ? "/dashboard/club/metricas" : t.href
            ) as Route;
            return (
              <Link
                key={t.key}
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-primary ring-primary/30 shadow-sm ring-2"
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
          title={`Ingresos ${suf}`}
          value={eurFmt.format(data.summary.revenueEUR)}
          changePercent={data.summary.revenueChangePercent}
          comparisonLabel={data.comparisonLabel}
          icon={Euro}
        />
        <MetricCard
          title={`Reservas ${suf}`}
          value={String(data.summary.bookings)}
          changePercent={data.summary.bookingsChangePercent}
          comparisonLabel={data.comparisonLabel}
          icon={CalendarDays}
        />
        <MetricCard
          title="Ocupación media (canchas)"
          value={`${data.summary.occupancyAvgPercent}%`}
          changePercent={data.summary.occupancyChangePercent}
          comparisonLabel={data.comparisonLabel}
          icon={ChartNoAxesCombined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="text-muted-foreground size-4" />
              Ingresos por día de la semana
            </CardTitle>
            <p className="text-muted-foreground text-sm font-normal">
              Suma de ingresos del periodo, por día ({suf}).
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {data.revenueByWeekday.every((d) => d.amountEUR === 0) ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Sin ingresos en este periodo.
              </p>
            ) : (
              data.revenueByWeekday.map((d) => (
                <div key={d.weekdayUtc} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      {d.labelShort}
                    </span>
                    <span className="font-mono text-foreground">
                      {eurFmt.format(d.amountEUR)}
                    </span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-[width]"
                      style={{
                        width: `${Math.min(100, (d.amountEUR / maxWeekRev) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Ocupación por cancha
            </CardTitle>
            <p className="text-muted-foreground text-sm font-normal">
              Reservas de cada cancha sobre el total de turnos del período.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {data.occupancyByCourt.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Aún no hay canchas configuradas.
              </p>
            ) : (
              data.occupancyByCourt.map((c) => (
                <div key={c.courtId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">
                      {c.name}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {c.occupancyPercent}%
                    </span>
                  </div>
                  <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width]",
                        barTone(c.occupancyPercent),
                      )}
                      style={{ width: `${Math.min(100, c.occupancyPercent)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Horas más concurridas
            </CardTitle>
            <p className="text-muted-foreground text-sm font-normal">
              Reservas por franja horaria sobre el total de turnos del período.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {data.peakHours.map((p) => (
              <div key={p.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-mono">{p.occupancyPercent}%</span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      barTone(p.occupancyPercent),
                    )}
                    style={{
                      width: `${Math.min(100, (p.occupancyPercent / maxPeak) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Jugadores frecuentes
            </CardTitle>
            <p className="text-muted-foreground text-sm font-normal">
              Por gasto estimado (reservas confirmadas en el periodo).
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            {data.topPlayers.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Sin datos en este periodo.
              </p>
            ) : (
              <ul className="divide-border divide-y">
                {data.topPlayers.map((p) => (
                  <li
                    key={p.userId}
                    className="flex flex-wrap items-baseline justify-between gap-2 py-3 first:pt-0"
                  >
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="text-muted-foreground w-6 shrink-0 font-mono text-sm">
                        {p.rank}.
                      </span>
                      <span className="text-foreground truncate font-medium">
                        {p.fullName?.trim() || "Usuario sin nombre"}
                      </span>
                    </div>
                    <div className="text-muted-foreground shrink-0 text-right text-sm">
                      <span className="font-mono text-foreground">
                        {eurFmt.format(p.spendEUR)}
                      </span>
                      <span className="text-xs">
                        {" "}
                        · {p.bookings}{" "}
                        {p.bookings === 1 ? "reserva" : "reservas"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ClubMetricsError() {
  return (
    <div className="border-destructive/40 bg-destructive/5 mx-auto max-w-6xl rounded-xl border p-6">
      <p className="text-destructive text-sm font-medium">
        No se pudieron cargar las métricas.
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Comprobá la API o reintentá en unos segundos.
      </p>
    </div>
  );
}
