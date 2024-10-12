/*
  Warnings:

  - Added the required column `description` to the `GenomicData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ImagingData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `SignalData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GenomicData" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImagingData" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SignalData" ADD COLUMN     "description" TEXT NOT NULL;
