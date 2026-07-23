/*
  Warnings:

  - You are about to drop the column `gateway_ref` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_type` on the `payments` table. All the data in the column will be lost.
  - The `currency` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[checkoutSessionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkoutSessionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "LeaseStatus" ADD VALUE 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "leases" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gateway_ref",
DROP COLUMN "payment_method",
DROP COLUMN "payment_type",
ADD COLUMN     "checkoutSessionId" TEXT NOT NULL,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "paid_at" TIMESTAMP(3),
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BDT',
ALTER COLUMN "transaction_id" DROP NOT NULL;

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentType";

-- CreateIndex
CREATE UNIQUE INDEX "payments_checkoutSessionId_key" ON "payments"("checkoutSessionId");
