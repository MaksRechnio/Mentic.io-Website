/*
  Warnings:

  - You are about to drop the `business_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "business_profiles" DROP CONSTRAINT "business_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "campaign_deployments" ALTER COLUMN "blueprint_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ad_constraints" JSONB,
ADD COLUMN     "age_max" INTEGER DEFAULT 65,
ADD COLUMN     "age_min" INTEGER DEFAULT 18,
ADD COLUMN     "application_id" TEXT,
ADD COLUMN     "bid_amount_cents" INTEGER,
ADD COLUMN     "bid_strategy" TEXT DEFAULT 'LOWEST_COST_WITHOUT_CAP',
ADD COLUMN     "call_to_action" TEXT DEFAULT 'LEARN_MORE',
ADD COLUMN     "custom_event_type" TEXT,
ADD COLUMN     "destination_type" TEXT,
ADD COLUMN     "destination_url" TEXT,
ADD COLUMN     "dsa_beneficiary" TEXT,
ADD COLUMN     "dsa_payor" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "instagram_actor_id" TEXT,
ADD COLUMN     "lead_gen_form_id" TEXT,
ADD COLUMN     "object_store_url" TEXT,
ADD COLUMN     "objective" TEXT DEFAULT 'OUTCOME_LEADS',
ADD COLUMN     "optimization_goal" TEXT,
ADD COLUMN     "page_id" TEXT,
ADD COLUMN     "pixel_id" TEXT,
ADD COLUMN     "placements" JSONB,
ADD COLUMN     "product_catalog_id" TEXT,
ADD COLUMN     "product_set_id" TEXT,
ADD COLUMN     "roas_floor" INTEGER,
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "whatsapp_phone_number_id" TEXT;

-- DropTable
DROP TABLE "business_profiles";
