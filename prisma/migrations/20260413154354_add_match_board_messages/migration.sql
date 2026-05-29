-- CreateTable
CREATE TABLE "court_booking_board_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "author_profile_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "court_booking_board_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loose_match_board_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "loose_match_id" UUID NOT NULL,
    "author_profile_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loose_match_board_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "court_booking_board_messages_booking_id_created_at_idx" ON "court_booking_board_messages"("booking_id", "created_at");

-- CreateIndex
CREATE INDEX "loose_match_board_messages_loose_match_id_created_at_idx" ON "loose_match_board_messages"("loose_match_id", "created_at");

-- AddForeignKey
ALTER TABLE "court_booking_board_messages" ADD CONSTRAINT "court_booking_board_messages_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "court_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_booking_board_messages" ADD CONSTRAINT "court_booking_board_messages_author_profile_id_fkey" FOREIGN KEY ("author_profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loose_match_board_messages" ADD CONSTRAINT "loose_match_board_messages_loose_match_id_fkey" FOREIGN KEY ("loose_match_id") REFERENCES "loose_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loose_match_board_messages" ADD CONSTRAINT "loose_match_board_messages_author_profile_id_fkey" FOREIGN KEY ("author_profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
