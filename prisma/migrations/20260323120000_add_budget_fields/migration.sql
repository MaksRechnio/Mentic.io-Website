-- AlterTable
ALTER TABLE "users" ADD COLUMN "monthly_ad_budget" DOUBLE PRECISION;
ALTER TABLE "users" ADD COLUMN "ad_budget_currency" TEXT DEFAULT 'USD';
