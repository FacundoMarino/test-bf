-- Turnos fijos recurrentes: metadatos de serie sobre court_bookings
ALTER TABLE "court_bookings" ADD COLUMN "is_fixed_series" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "court_bookings" ADD COLUMN "fixed_series_id" UUID;
ALTER TABLE "court_bookings" ADD COLUMN "fixed_series_occurrence_index" INTEGER;
ALTER TABLE "court_bookings" ADD COLUMN "fixed_series_rule" JSONB;

CREATE INDEX "court_bookings_court_id_is_fixed_series_idx" ON "court_bookings"("court_id", "is_fixed_series");
CREATE INDEX "court_bookings_fixed_series_id_idx" ON "court_bookings"("fixed_series_id");
