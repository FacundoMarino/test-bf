"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const REDIRECT_SECONDS = 5;
const DEFAULT_APP_TARGET = "exp://127.0.0.1:8081/--/login";
const DEFAULT_BACKOFFICE_TARGET = "/login";

type ClientType = "app" | "backoffice";

function isAllowedAppTarget(value: string): boolean {
  return /^(exp|serxus|https?):\/\//.test(value);
}

function resolveRedirectTarget(
  client: ClientType,
  rawTarget: string | null,
): string {
  const target = rawTarget?.trim() ?? "";
  if (client === "app") {
    return isAllowedAppTarget(target) ? target : DEFAULT_APP_TARGET;
  }
  return target.startsWith("/") ? target : DEFAULT_BACKOFFICE_TARGET;
}

export function ConfirmAccountClient() {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const searchParams = useSearchParams();

  const { client, target } = useMemo(() => {
    const clientParam = searchParams.get("client");
    const clientResolved: ClientType =
      clientParam === "app" ? "app" : "backoffice";
    return {
      client: clientResolved,
      target: resolveRedirectTarget(clientResolved, searchParams.get("target")),
    };
  }, [searchParams]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    window.location.href = target;
  }, [secondsLeft, target]);

  const title =
    client === "app"
      ? "Cuenta confirmada"
      : "Cuenta confirmada para backoffice";
  const description =
    client === "app"
      ? "Tu cuenta ya fue confirmada. Te llevamos a la app para iniciar sesión."
      : "Tu cuenta ya fue confirmada. Te redirigimos al acceso del backoffice.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        <p className="mt-3 text-sm text-neutral-600">{description}</p>

        <div className="mt-6 rounded-xl bg-neutral-100 px-4 py-3">
          <p className="text-sm text-neutral-700">
            Redirigiendo en{" "}
            <span className="font-semibold text-neutral-900">
              {secondsLeft}
            </span>{" "}
            segundos...
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = target;
          }}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Ir ahora
        </button>
      </section>
    </main>
  );
}
