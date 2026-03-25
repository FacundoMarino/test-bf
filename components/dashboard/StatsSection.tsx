import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function StatSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="bg-muted h-8 w-16 animate-pulse rounded font-mono" />
      </CardContent>
    </Card>
  );
}

export function StatsSectionSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
    </div>
  );
}

export async function StatsSection() {
  await new Promise((r) => setTimeout(r, 600));

  const stats = [
    { label: "Activos", value: "—" },
    { label: "Pendientes", value: "—" },
    { label: "Completados", value: "—" },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="border-border/80 shadow-sm transition-shadow duration-150 ease-out hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {s.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tracking-tight">
              {s.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
