-- CreateTable
CREATE TABLE "creative_analyses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT,
    "media_type" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "concept_type" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "campaign_id" TEXT,
    "ad_set_id" TEXT,
    "analyzed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creative_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "creative_analyses_user_id_idx" ON "creative_analyses"("user_id");

-- CreateIndex
CREATE INDEX "creative_analyses_analyzed_at_idx" ON "creative_analyses"("analyzed_at");

-- AddForeignKey
ALTER TABLE "creative_analyses" ADD CONSTRAINT "creative_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
