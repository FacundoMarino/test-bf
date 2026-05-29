-- CreateEnum
CREATE TYPE "CourtBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "court_schedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "court_id" UUID NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time_minutes" INTEGER NOT NULL,
    "end_time_minutes" INTEGER NOT NULL,
    "slot_duration_minutes" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "court_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_bookings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "court_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "start" TIMESTAMPTZ NOT NULL,
    "end" TIMESTAMPTZ NOT NULL,
    "status" "CourtBookingStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "court_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "court_schedules_court_id_day_of_week_idx" ON "court_schedules"("court_id", "day_of_week");

-- CreateIndex
CREATE INDEX "court_bookings_court_id_start_idx" ON "court_bookings"("court_id", "start");

-- AddForeignKey
ALTER TABLE "court_schedules" ADD CONSTRAINT "court_schedules_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_bookings" ADD CONSTRAINT "court_bookings_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
