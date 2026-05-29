-- Add approval status to clubs for super admin moderation flow
CREATE TYPE "ClubApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "clubs"
ADD COLUMN "approval_status" "ClubApprovalStatus" NOT NULL DEFAULT 'PENDING';

