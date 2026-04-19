-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonated_by" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ban_expires" TIMESTAMP(3),
ADD COLUMN     "ban_reason" TEXT,
ADD COLUMN     "banned" BOOLEAN,
ADD COLUMN     "role" TEXT;
