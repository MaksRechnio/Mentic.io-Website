-- AlterTable
ALTER TABLE "users"
    ADD COLUMN "brand_voice_json" JSONB,
    ADD COLUMN "brand_voice_updated_at" TIMESTAMP(3),
    ADD COLUMN "brand_voice_company_name_snapshot" TEXT;
