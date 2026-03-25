"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border-destructive/30 bg-card flex flex-col items-start gap-3 rounded-xl border p-6">
      <h2 className="text-base font-medium">No pudimos cargar esta sección</h2>
      <p className="text-muted-foreground text-sm">
        Probá de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ease-out"
      >
        Reintentar
      </button>
    </div>
  );
}
