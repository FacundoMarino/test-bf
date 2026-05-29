-- CreateTable
CREATE TABLE "loose_matches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "start_label" TEXT NOT NULL,
    "level" SMALLINT NOT NULL,
    "court_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "loose_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loose_matches_profile_id_idx" ON "loose_matches"("profile_id");

-- AddForeignKey
ALTER TABLE "loose_matches" ADD CONSTRAINT "loose_matches_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
