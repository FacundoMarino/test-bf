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
  const roleList = Array.isArray(app?.roles)
    ? app.roles.filter((r): r is string => typeof r === "string")
    : [];
  const roleFromMeta =
    meta?.role === "super_admin" || meta?.role === "admin"
      ? meta.role
      : undefined;
  const roleFromAppSingle =
    app?.role === "super_admin" || app?.role === "admin" ? app.role : undefined;
  const role: User["role"] = roleList.includes("super_admin")
    ? "super_admin"
    : roleFromMeta === "super_admin" || roleFromAppSingle === "super_admin"
      ? "super_admin"
      : roleList.includes("admin") ||
          roleFromMeta === "admin" ||
          roleFromAppSingle === "admin"
        ? "admin"
        : "member";

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
