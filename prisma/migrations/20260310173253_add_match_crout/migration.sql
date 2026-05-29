-- AlterTable
ALTER TABLE "court_bookings" ADD COLUMN     "is_match" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" SMALLINT,
ADD COLUMN     "max_players" SMALLINT,
ADD COLUMN     "title" TEXT;
