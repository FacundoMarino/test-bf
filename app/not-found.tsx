import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-mono text-4xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground text-center text-sm">
        No encontramos la página que buscás.
      </p>
      <Link
        href="/dashboard"
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
