ALTER TABLE "court_schedules"
ADD COLUMN "price_per_hour" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "period_name" TEXT,
ADD COLUMN "period_start" DATE,
ADD COLUMN "period_end" DATE;
