-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GenomicDataType" AS ENUM ('WGS', 'WES', 'RNA', 'TARGETTED');

-- CreateEnum
CREATE TYPE "ImagingType" AS ENUM ('MRI', 'CT', 'XRAY', 'ULTRASOUND', 'PETSCAN');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('ECG', 'EEG', 'EMG', 'EOG');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('DISEASE', 'PHENOTYPE', 'MUTATION', 'TREATMENT', 'DRUG');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('LEAD', 'MEMBER');

-- CreateEnum
CREATE TYPE "DataQuality" AS ENUM ('UNKNOWN', 'LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Researcher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "remainingLoginAttempts" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Researcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "sex" "Sex" NOT NULL,
    "diagnosticInfo" TEXT,
    "researcherId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenomicData" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dataType" "GenomicDataType" NOT NULL,
    "geneNames" TEXT[],
    "mutationTypes" TEXT[],
    "impacts" TEXT[],
    "rawDataUrl" TEXT NOT NULL,
    "quality" "DataQuality" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "GenomicData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phenotype" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "traits" TEXT[],
    "source" TEXT,

    CONSTRAINT "Phenotype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagingData" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "imageType" "ImagingType" NOT NULL,
    "image" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "ImagingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalData" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "signalType" "SignalType" NOT NULL,
    "dataPoints" JSONB NOT NULL,
    "duration" DOUBLE PRECISION,
    "sampleRate" DOUBLE PRECISION,

    CONSTRAINT "SignalData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryPatient" (
    "categoryId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "CategoryPatient_pkey" PRIMARY KEY ("categoryId","patientId")
);

-- CreateTable
CREATE TABLE "DataAccessLog" (
    "id" TEXT NOT NULL,
    "researcherId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearcherProject" (
    "researcherId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL,

    CONSTRAINT "ResearcherProject_pkey" PRIMARY KEY ("researcherId","projectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Researcher_email_key" ON "Researcher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Researcher_username_key" ON "Researcher"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenomicData" ADD CONSTRAINT "GenomicData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phenotype" ADD CONSTRAINT "Phenotype_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagingData" ADD CONSTRAINT "ImagingData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalData" ADD CONSTRAINT "SignalData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPatient" ADD CONSTRAINT "CategoryPatient_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPatient" ADD CONSTRAINT "CategoryPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAccessLog" ADD CONSTRAINT "DataAccessLog_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearcherProject" ADD CONSTRAINT "ResearcherProject_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearcherProject" ADD CONSTRAINT "ResearcherProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
