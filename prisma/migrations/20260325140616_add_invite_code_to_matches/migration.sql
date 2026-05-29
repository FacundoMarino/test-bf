/*
  Warnings:

  - A unique constraint covering the columns `[invite_code]` on the table `court_bookings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invite_code]` on the table `loose_matches` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "court_bookings" ADD COLUMN     "invite_code" TEXT;

-- AlterTable
ALTER TABLE "loose_matches" ADD COLUMN     "invite_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "court_bookings_invite_code_key" ON "court_bookings"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "loose_matches_invite_code_key" ON "loose_matches"("invite_code");
