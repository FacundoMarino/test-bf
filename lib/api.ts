import "server-only";

import { env } from "./env";

export type ApiSuccess<T> = { data: T; error: null };
export type ApiFailure = {
  data: null;
  error: { message: string; status: number };
};
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

function normalizeApiMessage(body: unknown): string {
  if (body !== null && typeof body === "object" && "message" in body) {
    const raw = (body as { message: unknown }).message;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw)) {
      return raw.filter((s): s is string => typeof s === "string").join(", ");
    }
  }
  return "Ocurrió un error inesperado";
}

/**
 * Server-only fetch to auth-service. Pass `authToken` for Bearer routes (e.g. /auth/me).
 * Browser cookies are not forwarded to another origin; the session token is read in RSC/actions and sent explicitly.
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { authToken?: string | null },
): Promise<ApiResult<T>> {
  const { authToken, ...init } = options ?? {};
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_AUTH_SERVICE_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const body: unknown = await res.json().catch(() => ({}));
      return {
        data: null,
        error: {
          message: normalizeApiMessage(body),
          status: res.status,
        },
      };
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch {
    return { data: null, error: { message: "Error de red", status: 0 } };
  }
}
