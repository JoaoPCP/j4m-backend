/*
  Warnings:

  - You are about to drop the `asaas_integrations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `asaas_customer_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Made the column `asaas_integration` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cpf` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "asaas_integrations" DROP CONSTRAINT "asaas_integrations_user_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_asaas_integration_fkey";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "asaas_customer_id" TEXT NOT NULL,
ALTER COLUMN "asaas_integration" SET NOT NULL,
ALTER COLUMN "asaas_integration" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cpf" TEXT NOT NULL;

-- DropTable
DROP TABLE "asaas_integrations";
