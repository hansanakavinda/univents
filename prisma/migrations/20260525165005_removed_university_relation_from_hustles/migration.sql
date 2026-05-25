/*
  Warnings:

  - You are about to drop the column `uniId` on the `Hustle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hustle" DROP CONSTRAINT "Hustle_uniId_fkey";

-- DropIndex
DROP INDEX "Hustle_uniId_idx";

-- AlterTable
ALTER TABLE "Hustle" DROP COLUMN "uniId";
