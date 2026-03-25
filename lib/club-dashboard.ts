import "server-only";

import { apiFetch } from "./api";
import type {
  ClubDashboardRange,
  ClubDashboardResponse,
} from "@/types/club-dashboard";

export function normalizeDashboardRange(
  raw: string | string[] | undefined,
): ClubDashboardRange {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "week" || v === "month") return v;
  return "today";
}

export async function fetchClubDashboard(
  clubId: string,
  authToken: string,
  range: ClubDashboardRange,
) {
  return apiFetch<ClubDashboardResponse>(
    `/clubs/${clubId}/dashboard?range=${range}`,
    { authToken },
  );
}
