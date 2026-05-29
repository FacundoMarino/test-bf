CREATE TABLE "court_custom_slots" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "court_id" UUID NOT NULL,
  "date" DATE NOT NULL,
  "start_time_minutes" INTEGER NOT NULL,
  "end_time_minutes" INTEGER NOT NULL,
  "price" INTEGER NOT NULL DEFAULT 0,
  "note" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "court_custom_slots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "court_custom_slots_court_id_date_idx"
  ON "court_custom_slots"("court_id", "date");

ALTER TABLE "court_custom_slots"
  ADD CONSTRAINT "court_custom_slots_court_id_fkey"
  FOREIGN KEY ("court_id")
  REFERENCES "courts"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
