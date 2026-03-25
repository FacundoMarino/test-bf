export type ClubAnalyticsRange = "week" | "month" | "year";

export type ClubAnalyticsResponse = {
  range: ClubAnalyticsRange;
  period: { start: string; end: string };
  comparisonLabel: string;
  summary: {
    revenueEUR: number;
    bookings: number;
    occupancyAvgPercent: number;
    revenueChangePercent: number | null;
    bookingsChangePercent: number | null;
    occupancyChangePercent: number | null;
  };
  revenueByWeekday: Array<{
    weekdayUtc: number;
    labelShort: string;
    amountEUR: number;
  }>;
  occupancyByCourt: Array<{
    courtId: string;
    name: string;
    occupancyPercent: number;
  }>;
  peakHours: Array<{ label: string; occupancyPercent: number }>;
  topPlayers: Array<{
    rank: number;
    userId: string;
    fullName: string | null;
    bookings: number;
    spendEUR: number;
  }>;
};
