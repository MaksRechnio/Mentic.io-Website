-- CreateTable
CREATE TABLE "agent_drafts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "name" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "agent_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_drafts_user_id_status_idx" ON "agent_drafts"("user_id", "status");

-- AddForeignKey
ALTER TABLE "agent_drafts" ADD CONSTRAINT "agent_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
