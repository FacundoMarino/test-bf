CREATE TYPE "EmailSendStatus" AS ENUM ('SENT', 'FAILED', 'SKIPPED');

CREATE TABLE "email_send_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "EmailSendStatus" NOT NULL DEFAULT 'SENT',
    "event_type" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "to_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "body_html" TEXT,
    "error_detail" TEXT,
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_send_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "email_send_logs_event_type_sent_at_idx" ON "email_send_logs"("event_type", "sent_at");
CREATE INDEX "email_send_logs_to_email_sent_at_idx" ON "email_send_logs"("to_email", "sent_at");
