/*
  Warnings:

  - You are about to drop the `plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `premium_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "premium_subscriptions" DROP CONSTRAINT "premium_subscriptions_plan_fkey";

-- DropForeignKey
ALTER TABLE "premium_subscriptions" DROP CONSTRAINT "premium_subscriptions_user_fkey";

-- DropTable
DROP TABLE "plans";

-- DropTable
DROP TABLE "premium_subscriptions";

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "price_cents" INTEGER NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "plan" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "asaas_integration" INTEGER,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asaas_integrations" (
    "id" SERIAL NOT NULL,
    "subscriptionId" VARCHAR(100) NOT NULL,
    "user" INTEGER NOT NULL,
    "asaas_customer_id" VARCHAR(100) NOT NULL,
    "asaas_subscription_id" VARCHAR(100) NOT NULL,

    CONSTRAINT "asaas_integrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_asaas_integration_fkey" FOREIGN KEY ("asaas_integration") REFERENCES "asaas_integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_fkey" FOREIGN KEY ("plan") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asaas_integrations" ADD CONSTRAINT "asaas_integrations_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
