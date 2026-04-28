-- CreateEnum
CREATE TYPE "ChatRunStatus" AS ENUM ('PENDING', 'STREAMING', 'AWAITING_APPROVAL', 'COMPLETED', 'ERROR', 'CANCELLED');

-- CreateTable
CREATE TABLE "chat_thread" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_message" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tool_calls" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_run" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "status" "ChatRunStatus" NOT NULL,
    "page_context" JSONB,
    "interrupt_state" JSONB,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "chat_run_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_thread_user_id_updated_at_idx" ON "chat_thread"("user_id", "updated_at");

-- CreateIndex
CREATE INDEX "chat_message_thread_id_created_at_idx" ON "chat_message"("thread_id", "created_at");

-- CreateIndex
CREATE INDEX "chat_run_thread_id_status_idx" ON "chat_run"("thread_id", "status");

-- AddForeignKey
ALTER TABLE "chat_thread" ADD CONSTRAINT "chat_thread_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "chat_thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_run" ADD CONSTRAINT "chat_run_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "chat_thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
