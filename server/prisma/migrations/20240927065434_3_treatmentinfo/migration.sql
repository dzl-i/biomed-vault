/*
  Warnings:

  - You are about to drop the column `source` on the `Phenotype` table. All the data in the column will be lost.
  - Made the column `diagnosticInfo` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "treatmentInfo" TEXT,
ALTER COLUMN "diagnosticInfo" SET NOT NULL;

-- AlterTable
ALTER TABLE "Phenotype" DROP COLUMN "source";
