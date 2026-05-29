-- Partidos públicos pendientes pueden no ocupar el turno hasta completar jugadores.
ALTER TABLE "court_bookings" ADD COLUMN IF NOT EXISTS "occupies_slot" BOOLEAN NOT NULL DEFAULT true;
