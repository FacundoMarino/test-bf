"use client";

import { useEffect } from "react";

export default function LoginError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-lg font-medium">Algo salió mal</h2>
      <p className="text-muted-foreground max-w-sm text-center text-sm">
        No pudimos cargar el inicio de sesión. Probá de nuevo.
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
