import { cn } from "@/lib/utils";

export function AuthScreen({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "auth-screen flex min-h-screen flex-col items-center justify-center px-6 py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[440px]">
      <h1 className="text-foreground mb-2 text-center text-[28px] font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground mb-8 text-center text-base leading-snug">
        {subtitle}
      </p>
      <div className="border-border bg-card text-card-foreground rounded-xl border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        {children}
      </div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}
