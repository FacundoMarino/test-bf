"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { loginSchema, registerSchema } from "@/types";

/**
 * Open-redirect safe target for post-login navigation (typed routes).
 */
function callbackToRoute(url: string): Route {
  const u = url.trim();
  if (
    u.startsWith("/dashboard") &&
    !u.includes("//") &&
    !u.includes("..") &&
    u.length <= 256
  ) {
    return u as Route;
  }
  return "/dashboard";
}

function normalizeAuthServiceError(
  body: unknown,
  fallback = "Credenciales inválidas",
): string {
  if (body === null || typeof body !== "object" || !("message" in body)) {
    return fallback;
  }
  const msg = (body as { message: unknown }).message;
  if (typeof msg === "string" && msg.length > 0) return msg;
  if (Array.isArray(msg)) {
    const parts = msg.filter((m): m is string => typeof m === "string");
    if (parts.length > 0) return parts.join(", ");
  }
  return fallback;
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(env.SESSION_COOKIE_NAME);
  redirect("/login");
}

export async function loginAction(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");
  const callbackRaw = formData.get("callbackUrl");

  const email = typeof emailRaw === "string" ? emailRaw : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";
  const callbackUrl =
    typeof callbackRaw === "string" && callbackRaw.startsWith("/")
      ? callbackRaw
      : "/dashboard";
  const destination = callbackToRoute(callbackUrl);

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Datos inválidos" };
  }

  let signInJson: unknown;
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/sign-in`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      },
    );

    signInJson = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: normalizeAuthServiceError(signInJson) };
    }
  } catch {
    return { error: "Error de red" };
  }

  const token =
    signInJson !== null &&
    typeof signInJson === "object" &&
    "accessToken" in signInJson &&
    typeof (signInJson as { accessToken: unknown }).accessToken === "string"
      ? (signInJson as { accessToken: string }).accessToken
      : null;

  if (!token) {
    return { error: "Respuesta de autenticación inválida" };
  }

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidateTag("user-session", "max");
  redirect(destination);
}

/**
 * Alta de club vía sass: `isClub: true` fijo (metadata Supabase `is_club`).
 */
export async function registerAction(
  _prev: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const fullNameRaw = formData.get("fullName");
  const emailRaw = formData.get("email");
  const confirmEmailRaw = formData.get("confirmEmail");
  const passwordRaw = formData.get("password");
  const confirmRaw = formData.get("confirmPassword");

  const fullName =
    typeof fullNameRaw === "string" ? fullNameRaw.trim() : undefined;
  const email = typeof emailRaw === "string" ? emailRaw.trim() : "";
  const confirmEmail =
    typeof confirmEmailRaw === "string" ? confirmEmailRaw.trim() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";
  const confirmPassword = typeof confirmRaw === "string" ? confirmRaw : "";

  const parsed = registerSchema.safeParse({
    fullName: fullName && fullName.length > 0 ? fullName : undefined,
    email,
    confirmEmail,
    password,
    confirmPassword,
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Datos inválidos" };
  }

  let body: unknown;
  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/sign-up`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
          ...(parsed.data.fullName && parsed.data.fullName.trim().length > 0
            ? { fullName: parsed.data.fullName.trim() }
            : {}),
          isClub: true,
        }),
      },
    );

    body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        error: normalizeAuthServiceError(
          body,
          "No se pudo completar el registro",
        ),
      };
    }
  } catch {
    return { error: "Error de red" };
  }

  redirect("/login?registered=1" as Route);
}
