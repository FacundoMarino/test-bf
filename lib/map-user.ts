import type { User } from "@/types";

/** Minimal Supabase `User` fields returned by auth-service `/auth/me`. */
export interface SupabaseUserLike {
  id: string;
  email?: string | null;
  created_at?: string;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
}

export function mapSupabaseUserToUser(u: SupabaseUserLike): User {
  const meta = u.user_metadata ?? undefined;
  const app = u.app_metadata ?? undefined;
  const role: User["role"] =
    meta?.role === "admin" || app?.role === "admin" ? "admin" : "member";

  const fullName =
    meta && typeof meta.full_name === "string" ? meta.full_name : null;
  const email = u.email ?? "";
  const name =
    fullName && fullName.length > 0
      ? fullName
      : email.split("@")[0] || "Usuario";

  const isClub =
    meta?.is_club === true ||
    meta?.isClub === true ||
    app?.is_club === true ||
    app?.isClub === true;

  return {
    id: u.id,
    email,
    name,
    role,
    createdAt: u.created_at ?? new Date().toISOString(),
    ...(isClub ? { isClub: true } : {}),
  };
}
