import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={["bg-muted h-3 animate-pulse rounded", className ?? ""].join(
        " ",
      )}
    />
  );
}

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={["bg-muted h-2.5 animate-pulse rounded", className ?? ""].join(
        " ",
      )}
    />
  );
}

function SkeletonCard({ title }: { title: string }) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <SkeletonLine className="h-7 w-24" />
          <SkeletonLine className="h-3 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ClubMetricsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SkeletonLine className="h-6 w-32" />
          <SkeletonLine className="h-3 mt-2 w-64" />
        </div>
        <div className="bg-muted/60 rounded-lg p-1 ring-1 ring-foreground/5 h-10 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonCard title="Ingresos" />
        <SkeletonCard title="Reservas" />
        <SkeletonCard title="Ocupación media" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Ingresos por día
            </CardTitle>
            <SkeletonLine className="h-3 mt-2 w-80" />
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonBar className="w-full" />
            <SkeletonBar className="w-3/4" />
            <SkeletonBar className="w-2/3" />
            <SkeletonBar className="w-1/2" />
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Ocupación por cancha
            </CardTitle>
            <SkeletonLine className="h-3 mt-2 w-72" />
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <SkeletonLine className="h-3 w-40" />
              <SkeletonBar className="w-full" />
            </div>
            <div className="space-y-2">
              <SkeletonLine className="h-3 w-40" />
              <SkeletonBar className="w-4/5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Horas más concurridas
            </CardTitle>
            <SkeletonLine className="h-3 mt-2 w-72" />
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <SkeletonBar className="w-full" />
            <SkeletonBar className="w-2/3" />
            <SkeletonBar className="w-3/4" />
            <SkeletonBar className="w-1/2" />
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Jugadores frecuentes
            </CardTitle>
            <SkeletonLine className="h-3 mt-2 w-72" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              <SkeletonLine className="h-3 w-72" />
              <SkeletonLine className="h-3 w-80" />
              <SkeletonLine className="h-3 w-64" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
