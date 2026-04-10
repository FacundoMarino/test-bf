/**
 * Catálogo de ciudades (perfil jugador en la app y club en backoffice).
 * Mantener alineado con `events-starter/lib/constants/profile-cities.ts`.
 */
export const PROFILE_CITIES = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "San Miguel de Tucumán",
  "La Plata",
  "Mar del Plata",
  "Salta",
  "Santa Fe",
  "San Juan",
  "Resistencia",
  "Corrientes",
  "Neuquén",
  "Posadas",
  "San Salvador de Jujuy",
  "Bahía Blanca",
  "Paraná",
  "Santiago del Estero",
  "San Luis",
  "Río Cuarto",
] as const;

export type ProfileCity = (typeof PROFILE_CITIES)[number];

export function isProfileCity(value: string): value is ProfileCity {
  return (PROFILE_CITIES as readonly string[]).includes(value);
}
