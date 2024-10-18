/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryPatient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearcherProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryPatient" DROP CONSTRAINT "CategoryPatient_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryPatient" DROP CONSTRAINT "CategoryPatient_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ResearcherProject" DROP CONSTRAINT "ResearcherProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ResearcherProject" DROP CONSTRAINT "ResearcherProject_researcherId_fkey";

-- AlterTable
ALTER TABLE "GenomicData" ADD COLUMN     "categories" "CategoryType"[];

-- AlterTable
ALTER TABLE "ImagingData" ADD COLUMN     "categories" "CategoryType"[];

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "categories" "CategoryType"[];

-- AlterTable
ALTER TABLE "PhenotypeData" ADD COLUMN     "categories" "CategoryType"[];

-- AlterTable
ALTER TABLE "SignalData" ADD COLUMN     "categories" "CategoryType"[];

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "CategoryPatient";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ResearcherProject";
