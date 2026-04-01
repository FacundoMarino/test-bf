export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

export type ClubReservation = {
  id: string;
  userId: string;
  user: {
    fullName: string | null;
    avatarUrl: string | null;
    phone?: string | null;
    /** Nivel del perfil del usuario que reservó (1–7). */
    level?: number | null;
    email?: string | null;
  };
  /** Fallback cuando backend envía email fuera de `user`. */
  userEmail?: string | null;
  court: {
    id: string;
    name: string;
    type: string;
  };
  start: string;
  end: string;
  status: ReservationStatus;
  createdAt: string;
  isMatch?: boolean;
  title?: string | null;
  maxPlayers?: number | null;
  level?: number | null;
  visibility?: string | null;
  participants?: Array<{
    profileId: string;
    fullName: string | null;
    avatarUrl: string | null;
    level?: number | null;
  }>;
};
