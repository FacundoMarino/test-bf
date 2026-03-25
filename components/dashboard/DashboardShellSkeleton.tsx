export function DashboardShellSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-screen w-full">
        <aside className="border-border bg-sidebar hidden w-56 border-r md:block" />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col pt-14 md:pt-0">
          <header className="border-border flex h-14 items-center justify-end border-b px-4 md:px-6">
            <div className="bg-muted size-9 animate-pulse rounded-full" />
          </header>
          <main className="flex-1 space-y-6 p-4 md:p-6">
            <div className="bg-muted h-8 max-w-md animate-pulse rounded-lg" />
            <div className="bg-muted h-40 animate-pulse rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-muted h-28 animate-pulse rounded-xl" />
              <div className="bg-muted h-28 animate-pulse rounded-xl" />
              <div className="bg-muted h-28 animate-pulse rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
