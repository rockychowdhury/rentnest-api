/*
  Warnings:

  - Added the required column `landlord_id` to the `leases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "leases" ADD COLUMN     "landlord_id" UUID NOT NULL;
