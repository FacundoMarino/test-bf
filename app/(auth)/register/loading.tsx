export default function RegisterLoading() {
  return (
    <div className="auth-screen flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[440px]">
        <div className="bg-muted mx-auto mb-2 h-9 w-48 animate-pulse rounded-lg" />
        <div className="bg-muted mx-auto mb-8 h-5 w-full max-w-sm animate-pulse rounded-md" />
        <div className="border-border bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <div className="bg-muted h-[52px] animate-pulse rounded-xl" />
          <div className="bg-muted h-[52px] animate-pulse rounded-xl" />
          <div className="bg-muted h-[52px] animate-pulse rounded-xl" />
          <div className="bg-muted h-[52px] animate-pulse rounded-xl" />
          <div className="bg-muted mt-2 h-[52px] animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
