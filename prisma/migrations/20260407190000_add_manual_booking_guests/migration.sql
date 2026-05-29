-- AlterTable
ALTER TABLE "court_bookings" ADD COLUMN "manual_guests" JSONB,
ADD COLUMN "manual_club_notes" TEXT;
