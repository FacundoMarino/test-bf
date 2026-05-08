"use server";

import { cookies } from "next/headers";

import { env } from "@/lib/env";

function normalizeMessage(body: unknown): string {
  if (body !== null && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m))
      return m.filter((s): s is string => typeof s === "string").join(", ");
  }
  return "No se pudo subir la imagen";
}

export async function uploadImageAction(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!file) return { ok: false, error: "Archivo requerido" };

  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return { ok: false, error: "Sesión no válida" };

  const allowedMime = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ]);
  if (!allowedMime.has(file.type)) {
    return { ok: false, error: "Formato no soportado. Usa PNG, JPG o WEBP." };
  }

  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const res = await fetch(
      `${env.NEXT_PUBLIC_AUTH_SERVICE_URL}/uploads/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: normalizeMessage(body) };
    }

    const url =
      body !== null &&
      typeof body === "object" &&
      "url" in body &&
      typeof (body as { url: unknown }).url === "string"
        ? (body as { url: string }).url
        : "";

    if (!url) {
      return {
        ok: false,
        error: "La API devolvió una respuesta inválida al subir la imagen",
      };
    }
    return { ok: true, url };
  } catch {
    return { ok: false, error: "Error de red al subir la imagen" };
  }
}
