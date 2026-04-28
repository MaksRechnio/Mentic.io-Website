-- AlterTable
ALTER TABLE "creative_assets" ADD COLUMN "draft_copy_json" JSONB,
    ADD COLUMN "draft_copy_at" TIMESTAMP(3);
