"use client";

import { useActionState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { changePasswordAction } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/PasswordField";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "La contraseña actual es obligatoria")
      .min(6, "Mínimo 6 caracteres"),
    newPassword: z
      .string()
      .min(1, "La nueva contraseña es obligatoria")
      .min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const initialState = { error: null as string | null, success: false };

export function ChangePasswordSection() {
  const [state, dispatch, actionPending] = useActionState(
    changePasswordAction,
    initialState,
  );
  const [transitionPending, startTransition] = useTransition();
  const pending = actionPending || transitionPending;

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (state.success) form.reset();
  }, [state.success, form]);

  return (
    <section className="border-border bg-card rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground mb-1 text-lg font-semibold">
        Cambiar contraseña
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Usá el email con el que iniciás sesión. Si la olvidaste, pedí un enlace
        desde “Olvidé mi contraseña” en el login.
      </p>

      <form
        onSubmit={form.handleSubmit((values) => {
          const fd = new FormData();
          fd.set("currentPassword", values.currentPassword);
          fd.set("newPassword", values.newPassword);
          fd.set("confirmPassword", values.confirmPassword);
          startTransition(() => {
            dispatch(fd);
          });
        })}
        className="max-w-md space-y-4"
      >
        {state.error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}
        {state.success ? (
          <Alert>
            <AlertTitle>Listo</AlertTitle>
            <AlertDescription>
              Contraseña actualizada correctamente.
            </AlertDescription>
          </Alert>
        ) : null}

        <PasswordField
          id="currentPassword"
          label="Contraseña actual"
          autoComplete="current-password"
          error={form.formState.errors.currentPassword?.message}
          registration={form.register("currentPassword")}
        />
        <PasswordField
          id="newPassword"
          label="Nueva contraseña"
          autoComplete="new-password"
          error={form.formState.errors.newPassword?.message}
          registration={form.register("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirmar nueva contraseña"
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          registration={form.register("confirmPassword")}
        />

        <Button type="submit" disabled={pending} className="h-11 rounded-xl">
          {pending ? "Guardando…" : "Actualizar contraseña"}
        </Button>
      </form>
    </section>
  );
}
