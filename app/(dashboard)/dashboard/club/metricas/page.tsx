import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ClubMetricsError,
  ClubMetricsView,
} from "@/components/metrics/ClubMetricsView";
import {
  fetchClubAnalytics,
  normalizeAnalyticsRange,
} from "@/lib/club-analytics";
import { getDashboardContext, isClubAccount } from "@/lib/dashboard-context";
import { env } from "@/lib/env";

export default async function ClubMetricasPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string | string[] }>;
}) {
  const ctx = await getDashboardContext();
  if (!ctx) redirect("/login");
  if (!isClubAccount(ctx)) redirect("/dashboard");
  if (!ctx.club) redirect("/dashboard/club");

  const sp = (await searchParams) ?? {};
  const range = normalizeAnalyticsRange(sp.range);

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const res = await fetchClubAnalytics(ctx.club.id, token, range);
  if (res.error || !res.data) {
    return (
      <div className="space-y-6">
        <ClubMetricsError />
      </div>
    );
  }

  return <ClubMetricsView range={range} data={res.data} />;
}
