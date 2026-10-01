import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import { TournamentEditor } from "@/components/tournaments/tournament-editor";
import { apiFetch } from "@/lib/api";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { env } from "@/lib/env";

export default async function NewTournamentPage() {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const courtsRes = await apiFetch<{
    data: Array<{ id: string; name: string }>;
  }>(`/clubs/${ctx.club.id}/courts?limit=500`, {
    authToken: token,
    cache: "no-store",
  });

  const courtsBase = courtsRes.error ? [] : courtsRes.data.data;
  const courts = await Promise.all(
    courtsBase.map(async (court) => {
      const schedulesRes = await apiFetch<
        Array<{
          dayOfWeek: number;
          startTimeMinutes: number;
          endTimeMinutes: number;
          periodStart?: string | null;
          periodEnd?: string | null;
        }>
      >(`/clubs/${ctx.club!.id}/courts/${court.id}/schedules`, {
        authToken: token,
        cache: "no-store",
      });

      return {
        ...court,
        schedules: schedulesRes.error ? [] : schedulesRes.data,
      };
    }),
  );

  return (
    <div className="w-full">
      <TournamentEditor
        clubId={ctx.club.id}
        ownClubName={ctx.club.name}
        courts={courts}
      />
    </div>
  );
}
