/**
 * Fallback local si `/cities` no responde.
 * La fuente de verdad es la tabla `cities` en auth-service (admin CRUD).
 */
export const FALLBACK_CITIES = [
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
  "Sastre",
] as const;

/** @deprecated Preferir listActiveCitiesAction / API. Se mantiene para fallback. */
export const PROFILE_CITIES = FALLBACK_CITIES;

export type ProfileCity = (typeof FALLBACK_CITIES)[number];

export function isProfileCity(value: string): boolean {
  return value.trim().length > 0;
}
