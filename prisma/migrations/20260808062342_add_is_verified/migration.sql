/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `properties` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_slug_idx" ON "properties"("slug");
