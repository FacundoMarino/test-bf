-- CreateTable
CREATE TABLE "loose_match_participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "loose_match_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loose_match_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loose_match_participants_loose_match_id_idx" ON "loose_match_participants"("loose_match_id");

-- CreateIndex
CREATE UNIQUE INDEX "loose_match_participants_loose_match_id_profile_id_key" ON "loose_match_participants"("loose_match_id", "profile_id");

-- AddForeignKey
ALTER TABLE "loose_match_participants" ADD CONSTRAINT "loose_match_participants_loose_match_id_fkey" FOREIGN KEY ("loose_match_id") REFERENCES "loose_matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loose_match_participants" ADD CONSTRAINT "loose_match_participants_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
