/*
  Warnings:

  - You are about to drop the `Phenotype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Phenotype" DROP CONSTRAINT "Phenotype_patientId_fkey";

-- DropTable
DROP TABLE "Phenotype";

-- CreateTable
CREATE TABLE "PhenotypeData" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "traits" TEXT[],

    CONSTRAINT "PhenotypeData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhenotypeData" ADD CONSTRAINT "PhenotypeData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
