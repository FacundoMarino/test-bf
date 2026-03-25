import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import type { UserSession } from "@/types";

import { apiFetch } from "./api";
import { env } from "./env";
import { mapSupabaseUserToUser, type SupabaseUserLike } from "./map-user";

interface MeResponse {
  user: SupabaseUserLike;
}

async function readSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await apiFetch<MeResponse>("/auth/me", { authToken: token });
  if (result.error) return null;

  return {
    user: mapSupabaseUserToUser(result.data.user),
  };
}

export const getSession = cache(readSession);
