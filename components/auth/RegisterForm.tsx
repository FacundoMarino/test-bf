"use client";

import { useActionState, useTransition } from "react";
import type { Route } from "next";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerAction } from "@/actions/auth";
import { registerSchema, type RegisterFormValues } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormShell, AuthScreen } from "./AuthScreen";
import { PasswordField } from "./PasswordField";

const initialActionState = { error: null as string | null };

export function RegisterForm() {
  const [state, dispatch, actionPending] = useActionState(
    registerAction,
    initialActionState,
  );
  const [transitionPending, startTransition] = useTransition();
  const pending = actionPending || transitionPending;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <AuthScreen>
      <AuthFormShell
        title="Crear cuenta"
        subtitle="Registrate como club para gestionar tu espacio en Puntoo."
        footer={
          <p className="text-muted-foreground text-center text-base">
            ¿Ya tenés cuenta?{" "}
            <Link
              href={"/login" as Route}
              className="text-primary font-semibold hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        }
      >
        <form
          onSubmit={form.handleSubmit((values) => {
            const fd = new FormData();
            fd.set("fullName", values.fullName ?? "");
            fd.set("email", values.email);
            fd.set("confirmEmail", values.confirmEmail);
            fd.set("password", values.password);
            fd.set("confirmPassword", values.confirmPassword);
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

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre del club</Label>
            <Input
              id="fullName"
              autoComplete="organization"
              placeholder="Nombre completo o del club"
              aria-invalid={!!form.formState.errors.fullName}
              className="h-[52px] rounded-xl border-border shadow-sm"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName ? (
              <p className="text-destructive text-xs">
                {form.formState.errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="club@ejemplo.com"
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

          <div className="space-y-2">
            <Label htmlFor="confirmEmail">Confirmar email</Label>
            <Input
              id="confirmEmail"
              type="email"
              autoComplete="email"
              placeholder="Repetí tu email"
              aria-invalid={!!form.formState.errors.confirmEmail}
              className="h-[52px] rounded-xl border-border shadow-sm"
              onPaste={(event) => event.preventDefault()}
              {...form.register("confirmEmail")}
            />
            {form.formState.errors.confirmEmail ? (
              <p className="text-destructive text-xs">
                {form.formState.errors.confirmEmail.message}
              </p>
            ) : null}
          </div>

          <PasswordField
            id="password"
            label="Contraseña"
            autoComplete="new-password"
            placeholder="Mín. 6 caracteres"
            error={form.formState.errors.password?.message}
            registration={form.register("password")}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirmar contraseña"
            autoComplete="new-password"
            placeholder="Repetí la contraseña"
            error={form.formState.errors.confirmPassword?.message}
            registration={form.register("confirmPassword")}
          />

          <Button
            type="submit"
            disabled={pending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-[52px] w-full rounded-xl text-[17px] font-semibold shadow-sm transition-opacity duration-150 disabled:opacity-70"
          >
            {pending ? "Registrando…" : "Registrarme"}
          </Button>
        </form>
      </AuthFormShell>
    </AuthScreen>
  );
}
