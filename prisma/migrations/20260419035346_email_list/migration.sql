-- CreateTable
CREATE TABLE "website_email_list" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "company" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_email_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_email_list_email_key" ON "website_email_list"("email");

-- CreateIndex
CREATE INDEX "website_email_list_email_idx" ON "website_email_list"("email");
