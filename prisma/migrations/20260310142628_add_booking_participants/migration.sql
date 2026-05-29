-- CreateTable
CREATE TABLE "court_booking_participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "court_booking_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "court_booking_participants_booking_id_profile_id_key" ON "court_booking_participants"("booking_id", "profile_id");

-- AddForeignKey
ALTER TABLE "court_booking_participants" ADD CONSTRAINT "court_booking_participants_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "court_bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_booking_participants" ADD CONSTRAINT "court_booking_participants_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
