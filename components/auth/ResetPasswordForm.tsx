"use client";

import {
  useActionState,
  useEffect,
  useSyncExternalStore,
  useTransition,
} from "react";
import type { Route } from "next";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPasswordAction } from "@/actions/auth";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthFormShell, AuthScreen } from "./AuthScreen";
import { PasswordField } from "./PasswordField";

const initialActionState = { error: null as string | null };

type RecoveryCredentials = {
  accessToken: string | null;
  refreshToken: string | null;
  tokenHash: string | null;
  errorMessage: string | null;
};

function readParams(): URLSearchParams {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const fromHash = new URLSearchParams(hash);
  const fromQuery = new URLSearchParams(window.location.search);

  // Prefer hash (implicit flow); fall back to query (token_hash / PKCE leftovers).
  const merged = new URLSearchParams(fromQuery);
  fromHash.forEach((value, key) => {
    merged.set(key, value);
  });
  return merged;
}

function parseRecoveryCredentials(): RecoveryCredentials {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      refreshToken: null,
      tokenHash: null,
      errorMessage: null,
    };
  }

  const params = readParams();
  const error = params.get("error");
  const errorDescription = params.get("error_description");
  if (error) {
    return {
      accessToken: null,
      refreshToken: null,
      tokenHash: null,
      errorMessage:
        errorDescription?.replace(/\+/g, " ") ||
        "El enlace de recuperación no es válido o expiró.",
    };
  }

  const type = params.get("type");
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const tokenHash = params.get("token_hash") ?? params.get("token");

  if (accessToken && (type === "recovery" || !type)) {
    return {
      accessToken,
      refreshToken,
      tokenHash: null,
      errorMessage: null,
    };
  }

  if (tokenHash && (type === "recovery" || !type)) {
    return {
      accessToken: null,
      refreshToken: null,
      tokenHash,
      errorMessage: null,
    };
  }

  return {
    accessToken: null,
    refreshToken: null,
    tokenHash: null,
    errorMessage: null,
  };
}

/** Persist credentials so clearing the URL does not drop them. */
let cachedRecovery: RecoveryCredentials | undefined;

function getRecoveryCredentials(): RecoveryCredentials {
  if (cachedRecovery !== undefined) return cachedRecovery;
  cachedRecovery = parseRecoveryCredentials();
  return cachedRecovery;
}

const EMPTY_RECOVERY: RecoveryCredentials = {
  accessToken: null,
  refreshToken: null,
  tokenHash: null,
  errorMessage: null,
};

const emptySubscribe = () => () => {};
const getServerClientSnapshot = () => false;
const getClientClientSnapshot = () => true;
const getServerRecoverySnapshot = () => EMPTY_RECOVERY;

export function ResetPasswordForm() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientClientSnapshot,
    getServerClientSnapshot,
  );
  const recovery = useSyncExternalStore(
    emptySubscribe,
    getRecoveryCredentials,
    getServerRecoverySnapshot,
  );

  const hasCredentials = Boolean(recovery.accessToken || recovery.tokenHash);

  const [state, dispatch, actionPending] = useActionState(
    resetPasswordAction,
    initialActionState,
  );
  const [transitionPending, startTransition] = useTransition();
  const pending = actionPending || transitionPending;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!hasCredentials) return;
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }, [hasCredentials]);

  if (!isClient) {
    return (
      <AuthScreen>
        <AuthFormShell
          title="Restablecer contraseña"
          subtitle="Validando tu enlace de recuperación…"
        >
          <p className="text-muted-foreground text-center text-sm">
            Un momento…
          </p>
        </AuthFormShell>
      </AuthScreen>
    );
  }

  if (!hasCredentials) {
    return (
      <AuthScreen>
        <AuthFormShell
          title="Restablecer contraseña"
          subtitle="No pudimos validar tu enlace de recuperación."
          footer={
            <p className="text-muted-foreground text-center text-base">
              <Link
                href={"/forgot-password" as Route}
                className="text-primary font-semibold hover:underline"
              >
                Solicitar un nuevo enlace
              </Link>
            </p>
          }
        >
          <Alert variant="destructive">
            <AlertTitle>Enlace inválido</AlertTitle>
            <AlertDescription>
              {recovery.errorMessage ??
                "Enlace de recuperación inválido o expirado. Pedí uno nuevo desde olvidé mi contraseña (con el mismo email con el que iniciás sesión)."}
            </AlertDescription>
          </Alert>
        </AuthFormShell>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <AuthFormShell
        title="Nueva contraseña"
        subtitle="Elegí una contraseña segura para tu cuenta de club"
        footer={
          <p className="text-muted-foreground text-center text-base">
            <Link
              href={"/login" as Route}
              className="text-primary font-semibold hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </p>
        }
      >
        <form
          onSubmit={form.handleSubmit((values) => {
            const fd = new FormData();
            if (recovery.accessToken) {
              fd.set("accessToken", recovery.accessToken);
            }
            if (recovery.refreshToken) {
              fd.set("refreshToken", recovery.refreshToken);
            }
            if (recovery.tokenHash) {
              fd.set("tokenHash", recovery.tokenHash);
            }
            fd.set("password", values.password);
            startTransition(() => {
              dispatch(fd);
            });
          })}
          className="space-y-4"
        >
          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          <PasswordField
            id="password"
            label="Nueva contraseña"
            autoComplete="new-password"
            error={form.formState.errors.password?.message}
            registration={form.register("password")}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirmar contraseña"
            autoComplete="new-password"
            error={form.formState.errors.confirmPassword?.message}
            registration={form.register("confirmPassword")}
          />

          <Button
            type="submit"
            disabled={pending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-[52px] w-full rounded-xl text-[17px] font-semibold shadow-sm transition-opacity duration-150 disabled:opacity-70"
          >
            {pending ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </form>
      </AuthFormShell>
    </AuthScreen>
  );
}
