import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <main className="auth-screen flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[440px] text-center">
        <h1 className="text-foreground mb-2 text-[28px] font-bold tracking-tight">
          Restablecer contraseña
        </h1>
        <p className="text-muted-foreground text-base">
          Preparando formulario…
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
