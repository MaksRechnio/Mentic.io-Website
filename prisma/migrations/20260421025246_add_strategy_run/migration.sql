-- CreateEnum
CREATE TYPE "StrategyRunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "strategy_run" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "StrategyRunStatus" NOT NULL DEFAULT 'PENDING',
    "phase" INTEGER NOT NULL DEFAULT 0,
    "totalPhases" INTEGER NOT NULL DEFAULT 9,
    "phase_message" TEXT,
    "blueprint_id" TEXT,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "strategy_run_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "strategy_run_user_id_status_idx" ON "strategy_run"("user_id", "status");

-- CreateIndex
CREATE INDEX "strategy_run_user_id_started_at_idx" ON "strategy_run"("user_id", "started_at");

-- AddForeignKey
ALTER TABLE "strategy_run" ADD CONSTRAINT "strategy_run_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
