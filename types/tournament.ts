export type TournamentModality = "MALE" | "FEMALE" | "MIXED";
export type TournamentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED";

export type TournamentCategoryStatus =
  | "INSCRIPTIONS"
  | "COMPLETE"
  | "CANCELLED";
export type TournamentVenueMode = "OWN_CLUB" | "MULTI_CLUB";

export type TournamentRegistration = {
  id: string;
  partnerName: string;
  partnerEmail: string | null;
  preferredTimeNotes: string | null;
  status: "ACTIVE" | "CANCELLED";
  isPaid: boolean;
  paymentMethod: string | null;
  playerIsPaid: boolean;
  partnerIsPaid: boolean;
  playerPaymentMethod: string | null;
  partnerPaymentMethod: string | null;
  createdAt: string;
  playerProfile: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
};

export type TournamentZoneEntry = {
  id: string;
  seed: number;
  isBye: boolean;
  registration: TournamentRegistration | null;
};

export type TournamentMatchSetScore = {
  home: number;
  away: number;
  tiebreakHome?: number;
  tiebreakAway?: number;
};

export type TournamentMatchSetScores = {
  sets: TournamentMatchSetScore[];
  superTieBreak?: { home: number; away: number };
  woSide?: number;
};

export type TournamentMatch = {
  id: string;
  categoryId: string;
  phase: "GROUP" | "KNOCKOUT";
  roundNumber: number;
  orderInRound: number;
  status: "PENDING" | "SCHEDULED" | "FINISHED";
  homeGames: number | null;
  awayGames: number | null;
  setScores: TournamentMatchSetScores | null;
  winnerRegistrationId: string | null;
  isNoShow: boolean;
  noShowSide: number | null;
  homeRegistrationId?: string | null;
  awayRegistrationId?: string | null;
  matchDate: string | null;
  startTimeMinutes: number | null;
  court: { id: string; name: string } | null;
  courtBlock: {
    id: string;
    isExternal: boolean;
    externalClubName: string | null;
    externalCourtName: string | null;
    court: { id: string; name: string } | null;
  } | null;
  homeRegistration: TournamentRegistration | null;
  awayRegistration: TournamentRegistration | null;
  homeSlotManual?: boolean;
  homeSlotBye?: boolean;
  homeSlotKey?: string | null;
  awaySlotManual?: boolean;
  awaySlotBye?: boolean;
  awaySlotKey?: string | null;
};

export type TournamentZone = {
  id: string;
  name: string;
  order: number;
  entries: TournamentZoneEntry[];
  matches: TournamentMatch[];
};

export type TournamentCategory = {
  id: string;
  name: string;
  level: number;
  modality: TournamentModality;
  maxPairs: number;
  minPairs: number | null;
  groupCount: number;
  groupTeamsPerZone: number;
  groupSets: number;
  groupSuperTieBreak: boolean;
  groupQualifiers: number;
  groupPointsWin: number;
  groupPointsLoss: number;
  groupPointsNoShow: number;
  groupTieBreakRules: string;
  groupMatchDurationMin: number;
  knockoutFirstRoundMatches: number;
  knockoutSets: number;
  knockoutSuperTieBreak: boolean;
  knockoutMatchDurationMin: number;
  registrationFeeCents: number;
  status: TournamentCategoryStatus;
  occupiedPairs: number;
  availablePairs: number;
  registrations: TournamentRegistration[];
  zones: TournamentZone[];
};

export type TournamentCourtBlock = {
  id: string;
  isExternal: boolean;
  externalClubName: string | null;
  externalCourtName: string | null;
  date: string;
  startTimeMinutes: number;
  endTimeMinutes: number;
  court: { id: string; name: string } | null;
};

export type TournamentRecord = {
  id: string;
  clubId: string;
  name: string;
  format: "TORNEO";
  description: string | null;
  venueMode: TournamentVenueMode;
  participantClubNames: string[];
  venue: string | null;
  startsAt: string;
  endsAt: string;
  registrationStartsAt: string;
  registrationEndsAt: string;
  groupStartsAt: string | null;
  groupEndsAt: string | null;
  knockoutStartsAt: string | null;
  knockoutEndsAt: string | null;
  status: TournamentStatus;
  categories: TournamentCategory[];
  courtBlocks: TournamentCourtBlock[];
  matches: TournamentMatch[];
};

export type TournamentStandingRow = {
  registrationId: string;
  pairLabel: string;
  played: number;
  won: number;
  lost: number;
  noShow: number;
  setsFor: number;
  setsAgainst: number;
  setDiff: number;
  gamesFor: number;
  gamesAgainst: number;
  gameDiff: number;
  points: number;
  qualifies: boolean;
};

export type TournamentZoneStanding = {
  zoneId: string;
  zoneName: string;
  order: number;
  rows: TournamentStandingRow[];
};

export type TournamentCategoryStandings = {
  categoryId: string;
  groupQualifiers: number;
  groupPointsWin: number;
  groupPointsLoss: number;
  groupPointsNoShow: number;
  zones: TournamentZoneStanding[];
};
