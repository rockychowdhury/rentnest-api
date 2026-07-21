/*
  Warnings:

  - The `status` column on the `property_units` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PropertyUnitStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "property_units" ADD COLUMN     "deleted_at" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "PropertyUnitStatus" NOT NULL DEFAULT 'AVAILABLE';

-- DropEnum
DROP TYPE "UnitStatus";

-- CreateIndex
CREATE INDEX "property_units_status_idx" ON "property_units"("status");
