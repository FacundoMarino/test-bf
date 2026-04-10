"use client";

import { useActionState, useTransition } from "react";
import type { Route } from "next";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginAction } from "@/actions/auth";
import { loginSchema, type LoginFormValues } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormShell, AuthScreen } from "./AuthScreen";
import { PasswordField } from "./PasswordField";

const initialActionState = { error: null as string | null };

export function LoginForm({
  callbackUrl,
  justRegistered,
}: {
  callbackUrl: string;
  justRegistered?: boolean;
}) {
  const [state, dispatch, actionPending] = useActionState(
    loginAction,
    initialActionState,
  );
  const [transitionPending, startTransition] = useTransition();
  const pending = actionPending || transitionPending;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthScreen>
      <AuthFormShell
        title="Iniciar sesión"
        subtitle="Introduce tu email y contraseña para entrar"
        footer={
          <p className="text-muted-foreground text-center text-base">
            ¿No tenés cuenta?{" "}
            <Link
              /* typedRoutes: ruta estática válida; el tipo aún no la infiere en todos los casos */
              href={"/register" as Route}
              className="text-primary font-semibold hover:underline"
            >
              Registrate
            </Link>
          </p>
        }
      >
        <form
          onSubmit={form.handleSubmit((values) => {
            const fd = new FormData();
            fd.set("email", values.email);
            fd.set("password", values.password);
            fd.set("callbackUrl", callbackUrl);
            startTransition(() => {
              dispatch(fd);
            });
          })}
          className="space-y-4"
        >
          {justRegistered ? (
            <Alert>
              <AlertTitle>Listo</AlertTitle>
              <AlertDescription>
                Verifica tu correo y completa los datos de tu club, para que el
                equipo de Puntoo pueda activar tu cuenta.
              </AlertDescription>
            </Alert>
          ) : null}
          {state.error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              aria-invalid={!!form.formState.errors.email}
              className="h-[52px] rounded-xl border-border shadow-sm"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-destructive text-xs">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <PasswordField
            id="password"
            label="Contraseña"
            autoComplete="current-password"
            error={form.formState.errors.password?.message}
            registration={form.register("password")}
          />

          <Button
            type="submit"
            disabled={pending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-[52px] w-full rounded-xl text-[17px] font-semibold shadow-sm transition-opacity duration-150 disabled:opacity-70"
          >
            {pending ? "Ingresando…" : "Entrar"}
          </Button>
        </form>
      </AuthFormShell>
    </AuthScreen>
  );
}
