"use client";

import { useActionState, useTransition } from "react";
import type { Route } from "next";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordAction } from "@/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormShell, AuthScreen } from "./AuthScreen";

const initialActionState = { error: null as string | null, success: false };

export function ForgotPasswordForm() {
  const [state, dispatch, actionPending] = useActionState(
    forgotPasswordAction,
    initialActionState,
  );
  const [transitionPending, startTransition] = useTransition();
  const pending = actionPending || transitionPending;

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <AuthScreen>
      <AuthFormShell
        title="Recuperar contraseña"
        subtitle="Introduce tu email y te enviaremos un enlace para restablecer tu contraseña"
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
        {state.success ? (
          <Alert>
            <AlertTitle>Correo enviado</AlertTitle>
            <AlertDescription>
              Si existe una cuenta con ese email, recibirás un enlace para
              restablecer tu contraseña.
            </AlertDescription>
          </Alert>
        ) : (
          <form
            onSubmit={form.handleSubmit((values) => {
              const fd = new FormData();
              fd.set("email", values.email);
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

            <Button
              type="submit"
              disabled={pending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-[52px] w-full rounded-xl text-[17px] font-semibold shadow-sm transition-opacity duration-150 disabled:opacity-70"
            >
              {pending ? "Enviando…" : "Enviar enlace"}
            </Button>
          </form>
        )}
      </AuthFormShell>
    </AuthScreen>
  );
}
