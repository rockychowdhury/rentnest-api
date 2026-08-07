/*
  Warnings:

  - You are about to drop the column `upazila_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `bn_name` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `bn_name` on the `divisions` table. All the data in the column will be lost.
  - You are about to drop the column `payer_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `total_units` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `upazilas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `area_id` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('RENT', 'SECURITY', 'UTILITY', 'OTHER');

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_upazila_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_payer_id_fkey";

-- DropForeignKey
ALTER TABLE "upazilas" DROP CONSTRAINT "upazilas_division_id_fkey";

-- DropIndex
DROP INDEX "addresses_upazila_id_idx";

-- DropIndex
DROP INDEX "payments_payer_id_idx";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "upazila_id",
ADD COLUMN     "area_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "districts" DROP COLUMN "bn_name";

-- AlterTable
ALTER TABLE "divisions" DROP COLUMN "bn_name";

-- AlterTable
ALTER TABLE "leases" ADD COLUMN     "paid_till" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payer_id",
ADD COLUMN     "payment_type" "PaymentType" NOT NULL DEFAULT 'RENT',
ADD COLUMN     "tenant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "pricing" ADD COLUMN     "utility_bill" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "utility_policy" VARCHAR(255);

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "total_units",
ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "property_images" ADD COLUMN     "unit_id" UUID;

-- DropTable
DROP TABLE "upazilas";

-- CreateTable
CREATE TABLE "property_unit_amenities" (
    "unit_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,

    CONSTRAINT "property_unit_amenities_pkey" PRIMARY KEY ("unit_id","amenity_id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "division_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_unit_amenities_amenity_id_idx" ON "property_unit_amenities"("amenity_id");

-- CreateIndex
CREATE INDEX "areas_division_id_idx" ON "areas"("division_id");

-- CreateIndex
CREATE INDEX "areas_name_idx" ON "areas"("name");

-- CreateIndex
CREATE INDEX "addresses_area_id_idx" ON "addresses"("area_id");

-- CreateIndex
CREATE INDEX "payments_tenant_id_idx" ON "payments"("tenant_id");

-- CreateIndex
CREATE INDEX "property_images_unit_id_idx" ON "property_images"("unit_id");

-- AddForeignKey
ALTER TABLE "property_unit_amenities" ADD CONSTRAINT "property_unit_amenities_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "property_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_unit_amenities" ADD CONSTRAINT "property_unit_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "property_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
