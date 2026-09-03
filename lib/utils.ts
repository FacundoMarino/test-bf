import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function verificationLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "En revisión",
    VERIFIED: "Aprobado",
    REJECTED: "Rechazado",
  };
  return labels[status] ?? status;
}

export function subscriptionLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Activa",
    PAUSED: "Suspendida",
    NONE: "Inactiva",
  };
  return labels[status] ?? status;
}

export function accountStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Activo",
    BANNED: "Baneado",
    SUSPENDED: "Suspendido",
  };
  return labels[status] ?? status;
}
