-- Ciudad del club (mismos valores que el combo de perfil de jugador) para filtrar "Para ti" por club.
ALTER TABLE "clubs" ADD COLUMN IF NOT EXISTS "location" TEXT;
