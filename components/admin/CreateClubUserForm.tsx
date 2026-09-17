"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";

import {
  createAdminClubUserAction,
  type AdminAssignableClub,
} from "@/actions/admin-users";

type Props = {
  clubs: AdminAssignableClub[];
};

type CreatedCredentials = {
  email: string;
  name: string;
  clubName: string;
  role: "ADMINISTRADOR" | "RESERVAS";
  temporaryPassword: string;
};

export function CreateClubUserForm({ clubs }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedCredentials | null>(null);
  const [copied, setCopied] = useState<"password" | "both" | null>(null);

  const approvedClubs = useMemo(
    () => clubs.filter((club) => club.approvalStatus === "APPROVED"),
    [clubs],
  );
  const clubOptions = approvedClubs.length > 0 ? approvedClubs : clubs;

  async function copyText(value: string, kind: "password" | "both") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div>
        <h2 className="text-foreground text-base font-semibold">
          Crear usuario de club
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Se genera una contraseña temporal para que se la pases al usuario.
        </p>
      </div>

      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);
          const fullName = String(formData.get("fullName") ?? "").trim();
          const email = String(formData.get("email") ?? "").trim();
          const clubId = String(formData.get("clubId") ?? "").trim();
          const roleRaw = String(formData.get("role") ?? "").trim();
          const role =
            roleRaw === "ADMINISTRADOR" || roleRaw === "RESERVAS"
              ? roleRaw
              : null;

          if (!fullName || !email || !clubId || !role) {
            setError("Completá nombre, email, club y rol.");
            return;
          }

          setError(null);
          startTransition(async () => {
            const res = await createAdminClubUserAction({
              fullName,
              email,
              clubId,
              role,
            });
            if (!res.ok) {
              setError(res.error);
              setCreated(null);
              return;
            }
            setCreated({
              email: res.user.email,
              name: res.user.name,
              clubName: res.membership.clubName,
              role: res.membership.role,
              temporaryPassword: res.temporaryPassword,
            });
            form.reset();
          });
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor="create-fullName" className="text-sm font-medium">
            Nombre
          </label>
          <input
            id="create-fullName"
            name="fullName"
            required
            minLength={2}
            placeholder="Nombre y apellido"
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="create-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="create-email"
            name="email"
            type="email"
            required
            placeholder="usuario@club.com"
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="create-clubId" className="text-sm font-medium">
            Club
          </label>
          <select
            id="create-clubId"
            name="clubId"
            required
            defaultValue=""
            className="border-input bg-background h-10 w-full rounded-lg border px-2.5 text-sm"
          >
            <option value="" disabled>
              Seleccionar club
            </option>
            {clubOptions.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
                {club.approvalStatus !== "APPROVED"
                  ? ` (${club.approvalStatus})`
                  : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="create-role" className="text-sm font-medium">
            Rol / perfil
          </label>
          <select
            id="create-role"
            name="role"
            required
            defaultValue="RESERVAS"
            className="border-input bg-background h-10 w-full rounded-lg border px-2.5 text-sm"
          >
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            <option value="RESERVAS">RESERVAS</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending || clubOptions.length === 0}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#788ce3] px-4 text-sm font-semibold text-white hover:bg-[#405fd3] disabled:opacity-60"
          >
            {pending ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {created ? (
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
          <p className="font-medium">
            Usuario creado: {created.name} ({created.email}) · {created.clubName}{" "}
            · {created.role}
          </p>
          <p className="text-emerald-900/80">
            Guardá o copiá la contraseña ahora; no se vuelve a mostrar.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="bg-background/80 border-border flex-1 rounded-md border px-3 py-2 font-mono text-sm tracking-wide text-foreground">
              {created.temporaryPassword}
            </code>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  void copyText(created.temporaryPassword, "password")
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
              >
                {copied === "password" ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied === "password" ? "Copiada" : "Copiar contraseña"}
              </button>
              <button
                type="button"
                onClick={() =>
                  void copyText(
                    `Email: ${created.email}\nContraseña: ${created.temporaryPassword}`,
                    "both",
                  )
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
              >
                {copied === "both" ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied === "both" ? "Copiado" : "Copiar email + pass"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
