export type ClubDashboardRange = "today" | "week" | "month";

export type ClubDashboardNextBooking = {
  id: string;
  start: string;
  end: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  bookerName: string | null;
  bookerPhone: string | null;
  bookerEmail: string | null;
  priceEUR: number;
};

export type ClubDashboardNextByCourt = {
  courtId: string;
  courtName: string;
  booking: ClubDashboardNextBooking | null;
};

export type ClubDashboardOpenMatchSlot =
  | { empty: true }
  | {
      empty: false;
      profileId: string;
      fullName: string | null;
      avatarUrl: string | null;
      phone: string | null;
      isOrganizer: boolean;
    };

export type ClubDashboardOpenMatch = {
  id: string;
  courtName: string;
  level: number | null;
  start: string;
  end: string;
  maxPlayers: number;
  filledSlots: number;
  freeSlots: number;
  dayLabel: string;
  slots: ClubDashboardOpenMatchSlot[];
};

export type ClubDashboardResponse = {
  range: ClubDashboardRange;
  period: { start: string; end: string };
  comparisonLabel: string;
  metrics: {
    bookings: { value: number; changePercent: number | null };
    revenue: { valueEUR: number; changePercent: number | null };
    occupancy: { valuePercent: number; changePercent: number | null };
  };
  nextReservationByCourt: ClubDashboardNextByCourt[];
  openMatches: ClubDashboardOpenMatch[];
};
