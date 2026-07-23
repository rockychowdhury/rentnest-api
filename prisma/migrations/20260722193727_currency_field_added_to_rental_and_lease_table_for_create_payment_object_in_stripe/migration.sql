-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BDT', 'USD');

-- AlterTable
ALTER TABLE "leases" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BDT';

-- AlterTable
ALTER TABLE "rental_requests" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BDT';
