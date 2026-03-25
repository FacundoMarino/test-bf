import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ClubSetupGate } from "@/components/club";
import { DashboardShell, DashboardShellSkeleton } from "@/components/dashboard";
import { AuthProvider } from "@/hooks";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <DashboardSessionLayout>{children}</DashboardSessionLayout>
    </Suspense>
  );
}

async function DashboardSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");

  const clubUser = isClubAccount(ctx);

  return (
    <AuthProvider user={ctx.session.user} isClubAccount={clubUser}>
      <DashboardShell
        showClubNav={clubUser}
        preContent={
          <ClubSetupGate isClubUser={clubUser} hasClub={ctx.club !== null} />
        }
      >
        {children}
      </DashboardShell>
    </AuthProvider>
  );
}
