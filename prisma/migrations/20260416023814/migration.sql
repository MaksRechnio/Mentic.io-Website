-- CreateEnum
CREATE TYPE "ResearchReportStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "research_reports" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "ResearchReportStatus" NOT NULL DEFAULT 'COMPLETED',
ALTER COLUMN "report" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "research_reports_user_id_status_created_at_idx" ON "research_reports"("user_id", "status", "created_at");
