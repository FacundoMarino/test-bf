import "server-only";

import { apiFetch } from "./api";
import type {
  ClubAnalyticsRange,
  ClubAnalyticsResponse,
} from "@/types/club-analytics";

export function normalizeAnalyticsRange(
  raw: string | string[] | undefined,
): ClubAnalyticsRange {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "week" || v === "year") return v;
  return "month";
}

export async function fetchClubAnalytics(
  clubId: string,
  authToken: string,
  range: ClubAnalyticsRange,
) {
  return apiFetch<ClubAnalyticsResponse>(
    `/clubs/${clubId}/analytics?range=${range}`,
    { authToken },
  );
}
