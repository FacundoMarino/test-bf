-- AlterTable
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "amenities" JSONB NOT NULL DEFAULT '{}'::jsonb;
