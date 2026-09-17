import type { User } from "@/types";

export type ClubStaffRole = "ADMINISTRADOR" | "RESERVAS";

export function resolveClubRole(
  user: User,
  fallbackRole?: ClubStaffRole | null,
) {
  if (user.clubRole === "ADMINISTRADOR" || user.clubRole === "RESERVAS") {
    return user.clubRole;
  }
  if (fallbackRole === "ADMINISTRADOR" || fallbackRole === "RESERVAS") {
    return fallbackRole;
  }
  return "ADMINISTRADOR" as const;
}

export function canViewMetrics(role: ClubStaffRole) {
  return role === "ADMINISTRADOR";
}

export function canViewRevenue(role: ClubStaffRole) {
  return role === "ADMINISTRADOR";
}
