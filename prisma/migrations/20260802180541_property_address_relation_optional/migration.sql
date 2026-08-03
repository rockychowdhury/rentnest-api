-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_address_id_fkey";

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "address_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
