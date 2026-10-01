import { redirect } from "next/navigation";

import {
  approveClubAction,
  getPaymentSettingsAction,
  listAdminPendingClubsAction,
  rejectClubAction,
  updatePaymentSettingsAction,
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
  const paymentSettingsRes = await getPaymentSettingsAction();

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

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold">
          Configuración global de comisión (TelePagos)
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Este porcentaje se suma al total del jugador y luego se envía por cashout
          a la cuenta de Puntoo.
        </p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-4"
          action={async (formData) => {
            "use server";
            const commissionPercent = Number(
              String(formData.get("commissionPercent") ?? "0"),
            );
            const puntooCvu = String(formData.get("puntooCvu") ?? "").trim();
            const puntooCuit = String(formData.get("puntooCuit") ?? "").trim();
            const puntooAlias = String(formData.get("puntooAlias") ?? "").trim();
            await updatePaymentSettingsAction({
              commissionPercent,
              puntooCvu,
              puntooCuit,
              puntooAlias,
            });
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium">Comisión (%)</label>
            <input
              name="commissionPercent"
              type="number"
              min={0}
              max={100}
              step={0.01}
              defaultValue={
                paymentSettingsRes.ok && paymentSettingsRes.data
                  ? paymentSettingsRes.data.commissionPercent
                  : 0
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">CVU Puntoo</label>
            <input
              name="puntooCvu"
              defaultValue={
                paymentSettingsRes.ok && paymentSettingsRes.data
                  ? paymentSettingsRes.data.puntooCvu
                  : ""
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">CUIT Puntoo</label>
            <input
              name="puntooCuit"
              defaultValue={
                paymentSettingsRes.ok && paymentSettingsRes.data
                  ? paymentSettingsRes.data.puntooCuit
                  : ""
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Alias Puntoo (opcional)</label>
            <input
              name="puntooAlias"
              defaultValue={
                paymentSettingsRes.ok && paymentSettingsRes.data
                  ? (paymentSettingsRes.data.puntooAlias ?? "")
                  : ""
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            />
          </div>
          <div className="md:col-span-4">
            <button
              type="submit"
              className="inline-flex rounded-lg bg-[#788ce3] px-3 py-2 text-xs font-semibold text-white hover:bg-[#405fd3]"
            >
              Guardar configuración de comisión
            </button>
          </div>
        </form>
      </section>

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
                          className="inline-flex rounded-lg bg-[#788ce3] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#405fd3]"
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
