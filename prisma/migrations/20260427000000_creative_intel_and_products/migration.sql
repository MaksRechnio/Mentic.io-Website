-- AlterTable
ALTER TABLE "users" ADD COLUMN "website_url" TEXT;

-- AlterTable
ALTER TABLE "creative_assets" ADD COLUMN "intelligence_json" JSONB,
    ADD COLUMN "intelligence_analyzed_at" TIMESTAMP(3),
    ADD COLUMN "intelligence_model" TEXT;

-- CreateTable
CREATE TABLE "scraped_products" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "source_url" TEXT NOT NULL,
    "price_cents" INTEGER,
    "currency" TEXT,
    "scraped_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraped_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scraped_products_user_id_idx" ON "scraped_products"("user_id");

-- CreateIndex
CREATE INDEX "scraped_products_user_id_scraped_at_idx" ON "scraped_products"("user_id", "scraped_at");
