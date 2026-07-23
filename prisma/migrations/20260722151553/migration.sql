/*
  Warnings:

  - The values [RENTED] on the enum `PropertyUnitStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyUnitStatus_new" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');
ALTER TABLE "public"."property_units" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "property_units" ALTER COLUMN "status" TYPE "PropertyUnitStatus_new" USING ("status"::text::"PropertyUnitStatus_new");
ALTER TYPE "PropertyUnitStatus" RENAME TO "PropertyUnitStatus_old";
ALTER TYPE "PropertyUnitStatus_new" RENAME TO "PropertyUnitStatus";
DROP TYPE "public"."PropertyUnitStatus_old";
ALTER TABLE "property_units" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
