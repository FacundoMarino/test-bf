import { redirect } from "next/navigation";

import { ClubProfileForm } from "@/components/club";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";

export default async function ClubConfigPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  const approvalStatus = ctx.club?.approvalStatus ?? null;
  const showApprovalNotice =
    approvalStatus === "PENDING" || approvalStatus === "REJECTED";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Configuración del club
        </h1>
      </div>
      {showApprovalNotice ? (
        <div
          className={
            approvalStatus === "REJECTED"
              ? "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              : "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          }
        >
          {approvalStatus === "REJECTED"
            ? "Tu club fue rechazado por un Administrador. Revisa los datos y guarda cambios para volver a enviarlo."
            : "Tu club está pendiente de aprobación por un Administrador. Podés editar la información mientras tanto."}
        </div>
      ) : null}
      <ClubProfileForm initialClub={ctx.club} initialProfile={ctx.profile} />
    </div>
  );
}
