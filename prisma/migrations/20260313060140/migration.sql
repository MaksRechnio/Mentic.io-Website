-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "surname" TEXT,
    "company_name" TEXT,
    "linkedin_url" TEXT,
    "niche" TEXT,
    "google_id" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "objective" TEXT NOT NULL DEFAULT 'OUTCOME_LEADS',
    "niche" TEXT NOT NULL,
    "geo" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "age_min" INTEGER NOT NULL DEFAULT 18,
    "age_max" INTEGER NOT NULL DEFAULT 65,
    "placements" JSONB,
    "page_id" TEXT,
    "destination_url" TEXT,
    "call_to_action" TEXT NOT NULL DEFAULT 'LEARN_MORE',
    "bid_strategy" TEXT NOT NULL DEFAULT 'LOWEST_COST_WITHOUT_CAP',
    "bid_amount_cents" INTEGER,
    "roas_floor" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "pixel_id" TEXT,
    "application_id" TEXT,
    "object_store_url" TEXT,
    "destination_type" TEXT,
    "optimization_goal" TEXT,
    "custom_event_type" TEXT,
    "product_catalog_id" TEXT,
    "product_set_id" TEXT,
    "lead_gen_form_id" TEXT,
    "whatsapp_phone_number_id" TEXT,
    "instagram_actor_id" TEXT,
    "dsa_beneficiary" TEXT,
    "dsa_payor" TEXT,
    "constraints" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_assets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "original_name" TEXT,
    "headline" TEXT,
    "primary_text" TEXT,
    "description" TEXT,
    "copy_variants" JSONB,
    "format" TEXT NOT NULL DEFAULT 'single_image',
    "carousel_order" INTEGER,
    "link_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creative_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_account_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'meta',
    "account_id" TEXT,
    "account_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_account_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_vaults" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'meta',
    "iv" TEXT NOT NULL,
    "auth_tag" TEXT NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "key_version" INTEGER NOT NULL DEFAULT 1,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_vaults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_blueprints" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "strategy" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategy_blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_deployments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "blueprint_id" TEXT NOT NULL,
    "idempotency_key" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "meta_campaign_id" TEXT,
    "mocked" BOOLEAN NOT NULL DEFAULT false,
    "result" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "report" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "optimisation_plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "optimisation_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_runs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "results" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "execution_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_snapshots" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'mock',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entity_id" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cron_jobs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ad_account_id" TEXT NOT NULL,
    "ad_account_name" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'meta',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cron_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_snapshots" (
    "id" TEXT NOT NULL,
    "cron_job_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ad_account_id" TEXT NOT NULL,
    "data_hash" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "external_campaign_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'meta',
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "daily_budget" DOUBLE PRECISION,
    "spend_7d" DOUBLE PRECISION,
    "last_synced_at" TIMESTAMP(3),
    "deployment_id" TEXT,
    "needs_reauth" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3),
    "aaguid" TEXT,

    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_profiles_user_id_key" ON "business_profiles"("user_id");

-- CreateIndex
CREATE INDEX "business_profiles_user_id_idx" ON "business_profiles"("user_id");

-- CreateIndex
CREATE INDEX "creative_assets_user_id_idx" ON "creative_assets"("user_id");

-- CreateIndex
CREATE INDEX "creative_assets_created_at_idx" ON "creative_assets"("created_at");

-- CreateIndex
CREATE INDEX "ad_account_connections_user_id_platform_idx" ON "ad_account_connections"("user_id", "platform");

-- CreateIndex
CREATE INDEX "token_vaults_user_id_platform_idx" ON "token_vaults"("user_id", "platform");

-- CreateIndex
CREATE INDEX "strategy_blueprints_user_id_idx" ON "strategy_blueprints"("user_id");

-- CreateIndex
CREATE INDEX "strategy_blueprints_created_at_idx" ON "strategy_blueprints"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_deployments_idempotency_key_key" ON "campaign_deployments"("idempotency_key");

-- CreateIndex
CREATE INDEX "campaign_deployments_user_id_idx" ON "campaign_deployments"("user_id");

-- CreateIndex
CREATE INDEX "campaign_deployments_created_at_idx" ON "campaign_deployments"("created_at");

-- CreateIndex
CREATE INDEX "campaign_deployments_blueprint_id_idx" ON "campaign_deployments"("blueprint_id");

-- CreateIndex
CREATE INDEX "research_reports_user_id_idx" ON "research_reports"("user_id");

-- CreateIndex
CREATE INDEX "research_reports_created_at_idx" ON "research_reports"("created_at");

-- CreateIndex
CREATE INDEX "optimisation_plans_user_id_idx" ON "optimisation_plans"("user_id");

-- CreateIndex
CREATE INDEX "optimisation_plans_created_at_idx" ON "optimisation_plans"("created_at");

-- CreateIndex
CREATE INDEX "execution_runs_user_id_idx" ON "execution_runs"("user_id");

-- CreateIndex
CREATE INDEX "execution_runs_created_at_idx" ON "execution_runs"("created_at");

-- CreateIndex
CREATE INDEX "execution_runs_plan_id_idx" ON "execution_runs"("plan_id");

-- CreateIndex
CREATE INDEX "metric_snapshots_user_id_idx" ON "metric_snapshots"("user_id");

-- CreateIndex
CREATE INDEX "metric_snapshots_created_at_idx" ON "metric_snapshots"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "cron_jobs_user_id_idx" ON "cron_jobs"("user_id");

-- CreateIndex
CREATE INDEX "cron_jobs_active_idx" ON "cron_jobs"("active");

-- CreateIndex
CREATE UNIQUE INDEX "cron_jobs_user_id_ad_account_id_platform_key" ON "cron_jobs"("user_id", "ad_account_id", "platform");

-- CreateIndex
CREATE INDEX "ad_snapshots_cron_job_id_captured_at_idx" ON "ad_snapshots"("cron_job_id", "captured_at");

-- CreateIndex
CREATE INDEX "ad_snapshots_user_id_idx" ON "ad_snapshots"("user_id");

-- CreateIndex
CREATE INDEX "campaigns_user_id_idx" ON "campaigns"("user_id");

-- CreateIndex
CREATE INDEX "campaigns_user_id_status_idx" ON "campaigns"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_external_campaign_id_provider_key" ON "campaigns"("external_campaign_id", "provider");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "passkey_credentialID_key" ON "passkey"("credentialID");

-- CreateIndex
CREATE INDEX "passkey_userId_idx" ON "passkey"("userId");

-- AddForeignKey
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creative_assets" ADD CONSTRAINT "creative_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_account_connections" ADD CONSTRAINT "ad_account_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_vaults" ADD CONSTRAINT "token_vaults_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategy_blueprints" ADD CONSTRAINT "strategy_blueprints_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_deployments" ADD CONSTRAINT "campaign_deployments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_reports" ADD CONSTRAINT "research_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "optimisation_plans" ADD CONSTRAINT "optimisation_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_runs" ADD CONSTRAINT "execution_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cron_jobs" ADD CONSTRAINT "cron_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_snapshots" ADD CONSTRAINT "ad_snapshots_cron_job_id_fkey" FOREIGN KEY ("cron_job_id") REFERENCES "cron_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_snapshots" ADD CONSTRAINT "ad_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
