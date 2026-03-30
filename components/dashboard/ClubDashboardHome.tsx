import type { LucideIcon } from "lucide-react";
import { CalendarDays, ChartNoAxesCombined, DollarSign } from "lucide-react";

import { ClubDashboardNextReservationsSection } from "@/components/dashboard/ClubDashboardNextReservationsSection";
import { ClubDashboardOpenMatchesSection } from "@/components/dashboard/ClubDashboardOpenMatchesSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClubDashboardResponse } from "@/types/club-dashboard";

function formatPeriodSubtitle(periodStartIso: string): string {
  const d = new Date(periodStartIso);
  const longDate = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
  return `Resumen del día — ${longDate}`;
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
        <span className="bg-teal-500/15 text-teal-700 dark:text-teal-300 flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </span>
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

export function ClubDashboardHome({ data }: { data: ClubDashboardResponse }) {
  const cmp = data.comparisonLabel;
  const eurFmt = new Intl.NumberFormat("es", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm capitalize">
          {formatPeriodSubtitle(data.period.start)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Reservas hoy"
          value={String(data.metrics.bookings.value)}
          changePercent={data.metrics.bookings.changePercent}
          comparisonLabel={cmp}
          icon={CalendarDays}
        />
        <MetricCard
          title="Ingresos hoy"
          value={eurFmt.format(data.metrics.revenue.valueEUR)}
          changePercent={data.metrics.revenue.changePercent}
          comparisonLabel={cmp}
          icon={DollarSign}
        />
        <MetricCard
          title="Ocupación hoy"
          value={`${data.metrics.occupancy.valuePercent}%`}
          changePercent={data.metrics.occupancy.changePercent}
          comparisonLabel={cmp}
          icon={ChartNoAxesCombined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Próxima reserva por cancha
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ClubDashboardNextReservationsSection
              rows={data.nextReservationByCourt}
            />
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base font-semibold">
                Partidos abiertos
              </CardTitle>
              <span className="bg-muted text-foreground inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold">
                {data.openMatches.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ClubDashboardOpenMatchesSection matches={data.openMatches} />
          </CardContent>
        </Card>
      </div>
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
