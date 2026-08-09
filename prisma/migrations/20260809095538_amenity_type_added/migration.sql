-- CreateEnum
CREATE TYPE "AmenityType" AS ENUM ('PROPERTY', 'UNIT', 'COMMON');

-- AlterTable
ALTER TABLE "amenities" ADD COLUMN     "type" "AmenityType" NOT NULL DEFAULT 'COMMON';
