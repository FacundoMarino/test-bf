-- DropForeignKey
ALTER TABLE "court_schedule_exceptions" DROP CONSTRAINT "court_schedule_exceptions_court_id_fkey";

-- AlterTable
ALTER TABLE "court_schedule_exceptions" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "court_schedule_exceptions" ADD CONSTRAINT "court_schedule_exceptions_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
