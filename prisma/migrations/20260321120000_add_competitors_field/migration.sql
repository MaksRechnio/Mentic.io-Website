-- AlterTable
ALTER TABLE "users" ADD COLUMN "competitors" TEXT[] DEFAULT ARRAY[]::TEXT[];
