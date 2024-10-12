/*
  Warnings:

  - The primary key for the `Phenotype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `GenomicData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ImagingData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Phenotype` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SignalData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GenomicData" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImagingData" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Phenotype" DROP CONSTRAINT "Phenotype_pkey",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Phenotype_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Phenotype_id_seq";

-- AlterTable
ALTER TABLE "SignalData" ADD COLUMN     "name" TEXT NOT NULL;
