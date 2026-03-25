export type ClubDashboardRange = "today" | "week" | "month";

export type ClubDashboardResponse = {
  range: ClubDashboardRange;
  period: { start: string; end: string };
  comparisonLabel: string;
  metrics: {
    bookings: { value: number; changePercent: number | null };
    revenue: { valueEUR: number; changePercent: number | null };
    occupancy: { valuePercent: number; changePercent: number | null };
  };
  recentBookings: Array<{
    id: string;
    userId: string;
    user: { fullName: string | null; avatarUrl: string | null };
    court: { id: string; name: string };
    start: string;
    end: string;
    status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  }>;
};
