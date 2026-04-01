import { redirect } from "next/navigation";

import { ClubProfileForm } from "@/components/club";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";

export default async function ClubConfigPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Configuración del club
        </h1>
      </div>
      <ClubProfileForm initialClub={ctx.club} initialProfile={ctx.profile} />
    </div>
  );
}
