import { redirect } from "next/navigation";

import {
  assignAdminClubUserRoleAction,
  listAdminClubUsersByQueryAction,
} from "@/actions/admin-users";
import {
  getDashboardContext,
  isSuperAdminAccount,
} from "@/lib/dashboard-context";

type Props = {
  searchParams?: Promise<{
    q?: string | string[];
    clubId?: string | string[];
    role?: string | string[];
    page?: string | string[];
  }>;
};

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminUsuariosPage({ searchParams }: Props) {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isSuperAdminAccount(ctx)) redirect("/dashboard");

  const sp = (await searchParams) ?? {};
  const q = firstParam(sp.q)?.trim() ?? "";
  const clubId = firstParam(sp.clubId)?.trim() ?? "";
  const roleRaw = firstParam(sp.role)?.trim();
  const role =
    roleRaw === "ADMINISTRADOR" || roleRaw === "RESERVAS" ? roleRaw : undefined;
  const page = Math.max(1, Number(firstParam(sp.page) ?? "1") || 1);

  const res = await listAdminClubUsersByQueryAction({
    q: q || undefined,
    clubId: clubId || undefined,
    role,
    page,
    limit: 20,
  });

  const hrefWith = (next: {
    q?: string;
    clubId?: string;
    role?: "ADMINISTRADOR" | "RESERVAS" | "";
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const nextQ = next.q ?? q;
    const nextClub = next.clubId ?? clubId;
    const nextRole = next.role ?? role ?? "";
    const nextPage = next.page ?? page;
    if (nextQ) params.set("q", nextQ);
    if (nextClub) params.set("clubId", nextClub);
    if (nextRole) params.set("role", nextRole);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return `/dashboard/admin/usuarios${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Usuarios de clubes
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Asigná club y rol operativo para cada usuario del panel.
        </p>
      </div>
      <form
        method="GET"
        className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o email"
          className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
        />
        <select
          name="clubId"
          defaultValue={clubId}
          className="border-input bg-background h-10 rounded-lg border px-2.5 text-sm"
        >
          <option value="">Todos los clubes</option>
          {res.ok
            ? res.clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))
            : null}
        </select>
        <select
          name="role"
          defaultValue={role ?? ""}
          className="border-input bg-background h-10 rounded-lg border px-2.5 text-sm"
        >
          <option value="">Todos los roles</option>
          <option value="ADMINISTRADOR">ADMINISTRADOR</option>
          <option value="RESERVAS">RESERVAS</option>
        </select>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#788ce3] px-4 text-sm font-semibold text-white hover:bg-[#405fd3]"
        >
          Filtrar
        </button>
      </form>

      {!res.ok ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {res.error}
        </div>
      ) : res.users.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No hay usuarios para configurar.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-muted-foreground text-xs">
            Mostrando {res.users.length} de {res.meta.total} usuarios
            {res.meta.totalPages > 1
              ? ` · página ${res.meta.page} de ${res.meta.totalPages}`
              : ""}
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Usuario</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Club actual
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Rol actual
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Asignar</th>
                </tr>
              </thead>
              <tbody>
                {res.users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {user.email}
                      </div>
                      <div className="text-muted-foreground mt-1 text-[11px]">
                        {user.isClub ? "Cuenta club" : "Cuenta general"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.membership?.clubName ?? "Sin club"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.membership?.role ?? "Sin rol"}
                    </td>
                    <td className="px-4 py-3">
                      <form
                        action={async (formData) => {
                          "use server";
                          const clubId = String(
                            formData.get("clubId") ?? "",
                          ).trim();
                          const roleRaw = String(
                            formData.get("role") ?? "",
                          ).trim();
                          const role =
                            roleRaw === "ADMINISTRADOR" ||
                            roleRaw === "RESERVAS"
                              ? roleRaw
                              : null;
                          if (!clubId || !role) return;
                          await assignAdminClubUserRoleAction({
                            userId: user.id,
                            clubId,
                            role,
                          });
                        }}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <select
                          name="clubId"
                          defaultValue={user.membership?.clubId ?? ""}
                          className="border-input bg-background h-9 min-w-48 rounded-lg border px-2.5 text-xs"
                          required
                        >
                          <option value="" disabled>
                            Seleccionar club
                          </option>
                          {res.clubs.map((club) => (
                            <option key={club.id} value={club.id}>
                              {club.name}
                              {club.approvalStatus !== "APPROVED"
                                ? ` (${club.approvalStatus})`
                                : ""}
                            </option>
                          ))}
                        </select>
                        <select
                          name="role"
                          defaultValue={user.membership?.role ?? "RESERVAS"}
                          className="border-input bg-background h-9 rounded-lg border px-2.5 text-xs"
                        >
                          <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                          <option value="RESERVAS">RESERVAS</option>
                        </select>
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#788ce3] px-3 text-xs font-semibold text-white hover:bg-[#405fd3]"
                        >
                          Guardar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3">
            <a
              href={hrefWith({ page: Math.max(1, res.meta.page - 1) })}
              className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-medium ${
                res.meta.page <= 1
                  ? "pointer-events-none bg-muted text-muted-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Anterior
            </a>
            <a
              href={hrefWith({ page: res.meta.page + 1 })}
              className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-medium ${
                res.meta.page >= res.meta.totalPages
                  ? "pointer-events-none bg-muted text-muted-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Siguiente
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
