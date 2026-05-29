CREATE TABLE "court_schedule_exceptions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "court_id" UUID NOT NULL,
  "date" DATE NOT NULL,
  "start_time_minutes" INTEGER,
  "end_time_minutes" INTEGER,
  "is_closed_all_day" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "court_schedule_exceptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "court_schedule_exceptions_court_id_date_idx"
  ON "court_schedule_exceptions"("court_id", "date");

ALTER TABLE "court_schedule_exceptions"
  ADD CONSTRAINT "court_schedule_exceptions_court_id_fkey"
  FOREIGN KEY ("court_id")
  REFERENCES "courts"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
