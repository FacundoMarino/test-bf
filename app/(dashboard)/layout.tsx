import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ClubSetupGate } from "@/components/club";
import { DashboardShell, DashboardShellSkeleton } from "@/components/dashboard";
import { AuthProvider } from "@/hooks";
import {
  getDashboardContext,
  isClubAccount,
  isSuperAdminAccount,
} from "@/lib/dashboard-context";

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

  const superAdminUser = isSuperAdminAccount(ctx);
  const clubUser = isClubAccount(ctx) && !superAdminUser;

  return (
    <AuthProvider user={ctx.session.user} isClubAccount={clubUser}>
      <DashboardShell
        showClubNav={clubUser}
        showSuperAdminNav={superAdminUser}
        preContent={
          <ClubSetupGate
            isClubUser={clubUser}
            hasClub={ctx.club !== null}
            userId={ctx.session.user.id}
          />
        }
      >
        {children}
      </DashboardShell>
    </AuthProvider>
  );
}
