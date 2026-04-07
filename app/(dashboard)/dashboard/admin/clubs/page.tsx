import { redirect } from "next/navigation";

import {
  approveClubAction,
  listAdminPendingClubsAction,
  rejectClubAction,
} from "@/actions/admin-clubs";
import {
  getDashboardContext,
  isSuperAdminAccount,
} from "@/lib/dashboard-context";

export default async function AdminClubsApprovalPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isSuperAdminAccount(ctx)) redirect("/dashboard");

  const res = await listAdminPendingClubsAction();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Aprobacion de clubes
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Los clubes nuevos se crean en estado pendiente hasta ser habilitados.
        </p>
      </div>

      {!res.ok ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {res.error}
        </div>
      ) : res.data.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No hay clubes pendientes.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Club</th>
                <th className="px-4 py-3 text-left font-semibold">Direccion</th>
                <th className="px-4 py-3 text-left font-semibold">Contacto</th>
                <th className="px-4 py-3 text-left font-semibold">Creado</th>
                <th className="px-4 py-3 text-right font-semibold">Accion</th>
              </tr>
            </thead>
            <tbody>
              {res.data.map((club) => (
                <tr key={club.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{club.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {club.address}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {club.email ?? club.web ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(club.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form
                        action={async () => {
                          "use server";
                          await rejectClubAction(club.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                        >
                          Rechazar
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await approveClubAction(club.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Aprobar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
