import { redirect } from "next/navigation";

import {
  createCityAction,
  deleteCityAction,
  listAdminCitiesAction,
} from "@/actions/admin-cities";
import {
  getDashboardContext,
  isSuperAdminAccount,
} from "@/lib/dashboard-context";

export default async function AdminCitiesPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isSuperAdminAccount(ctx)) redirect("/dashboard");

  const res = await listAdminCitiesAction();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Ciudades
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Catálogo usado en el perfil del jugador (app) y en el perfil del club
          (backoffice).
        </p>
      </div>

      <form
        action={async (formData) => {
          "use server";
          const name = String(formData.get("name") ?? "").trim();
          if (!name) return;
          await createCityAction(name);
        }}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-1.5">
          <label htmlFor="city-name" className="text-sm font-medium">
            Nueva ciudad
          </label>
          <input
            id="city-name"
            name="name"
            type="text"
            required
            maxLength={120}
            placeholder="Ej: Sastre"
            className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#788ce3] px-5 text-sm font-semibold text-white hover:bg-[#405fd3]"
        >
          Agregar
        </button>
      </form>

      {!res.ok ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {res.error}
        </div>
      ) : res.data.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No hay ciudades cargadas.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Ciudad</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {res.data.map((city) => (
                <tr key={city.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{city.name}</td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await deleteCityAction(city.id);
                      }}
                      className="flex justify-end"
                    >
                      <button
                        type="submit"
                        className="inline-flex rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        Quitar
                      </button>
                    </form>
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
