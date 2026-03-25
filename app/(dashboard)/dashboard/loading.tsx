export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="border-border bg-card rounded-xl border p-6 ring-1 ring-foreground/5">
        <div className="bg-muted mb-2 h-7 w-64 max-w-full animate-pulse rounded-md" />
        <div className="bg-muted h-4 w-full max-w-lg animate-pulse rounded-md" />
      </div>
      <div>
        <div className="bg-muted mb-4 h-3 w-24 animate-pulse rounded" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-muted h-28 animate-pulse rounded-xl" />
          <div className="bg-muted h-28 animate-pulse rounded-xl" />
          <div className="bg-muted h-28 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
