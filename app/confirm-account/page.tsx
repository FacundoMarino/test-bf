import { Suspense } from "react";

import { ConfirmAccountClient } from "./ConfirmAccountClient";

function ConfirmAccountFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Cuenta confirmada
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Preparando redirección…
        </p>
      </section>
    </main>
  );
}

export default function ConfirmAccountPage() {
  return (
    <Suspense fallback={<ConfirmAccountFallback />}>
      <ConfirmAccountClient />
    </Suspense>
  );
}
