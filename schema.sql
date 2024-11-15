-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "GenomicDataType" AS ENUM ('WGS', 'WES', 'RNA', 'TARGETTED');

-- CreateEnum
CREATE TYPE "ImagingType" AS ENUM ('MRI', 'CT', 'XRAY', 'ULTRASOUND', 'PETSCAN');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('ECG', 'EEG', 'EMG', 'EOG');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ONCOLOGICAL', 'CARDIOVASCULAR', 'NEUROLOGICAL', 'RESPIRATORY', 'GASTROINTESTINAL', 'ENDOCRINE', 'IMMUNOLOGICAL', 'MUSCULOSKELETAL', 'DERMATOLOGICAL', 'GENETIC_DISORDER', 'INFECTIOUS_DISEASE', 'RARE_DISEASE', 'PRIMARY_DIAGNOSIS', 'SECONDARY_DIAGNOSIS', 'ACUTE_CARE', 'CHRONIC_CARE', 'PALLIATIVE_CARE', 'PREVENTIVE_CARE', 'CLINICAL_TRIAL', 'CHEMOTHERAPY', 'IMMUNOTHERAPY', 'TARGETED_THERAPY', 'HORMONE_THERAPY', 'RADIATION_THERAPY', 'SURGICAL', 'COMBINATION_THERAPY', 'EXPERIMENTAL_THERAPY', 'PEDIATRIC', 'ADULT', 'GERIATRIC', 'MATERNAL', 'FAMILIAL', 'CENTRAL_NERVOUS', 'PERIPHERAL_NERVOUS', 'CARDIAC', 'VASCULAR', 'RESPIRATION', 'DIGESTIVE', 'HEPATIC', 'PANCREATIC', 'RENAL', 'URINARY', 'REPRODUCTIVE', 'SKELETAL', 'MUSCULAR', 'INTEGUMENTARY', 'LYMPHATIC', 'ENDOCRINE_THYROID', 'ENDOCRINE_ADRENAL', 'ENDOCRINE_PITUITARY', 'OCULAR', 'AUDITORY', 'ORAL', 'JOINT', 'HEMATOLOGIC', 'IMMUNE');

-- CreateEnum
CREATE TYPE "DataQuality" AS ENUM ('UNKNOWN', 'LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Researcher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "remainingLoginAttempts" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Researcher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "sex" "Sex" NOT NULL,
    "diagnosticInfo" TEXT NOT NULL,
    "treatmentInfo" TEXT NOT NULL,
    "researcherId" TEXT NOT NULL,
    "categories" "CategoryType"[],

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenomicData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataType" "GenomicDataType" NOT NULL,
    "geneNames" TEXT[],
    "mutationTypes" TEXT[],
    "impacts" TEXT[],
    "rawDataUrl" TEXT NOT NULL,
    "quality" "DataQuality" NOT NULL DEFAULT 'UNKNOWN',
    "categories" "CategoryType"[],
    "patientId" TEXT NOT NULL,

    CONSTRAINT "GenomicData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhenotypeData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "traits" TEXT[],
    "categories" "CategoryType"[],
    "patientId" TEXT NOT NULL,

    CONSTRAINT "PhenotypeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagingData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageType" "ImagingType" NOT NULL,
    "image" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categories" "CategoryType"[],
    "patientId" TEXT NOT NULL,

    CONSTRAINT "ImagingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "signalType" "SignalType" NOT NULL,
    "dataPoints" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "sampleRate" DOUBLE PRECISION NOT NULL,
    "categories" "CategoryType"[],
    "patientId" TEXT NOT NULL,

    CONSTRAINT "SignalData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAccessLog" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "researcherId" TEXT NOT NULL,

    CONSTRAINT "DataAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "researcherId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Researcher_email_key" ON "Researcher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Researcher_username_key" ON "Researcher"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Token_accessToken_key" ON "Token"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshToken_key" ON "Token"("refreshToken");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenomicData" ADD CONSTRAINT "GenomicData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhenotypeData" ADD CONSTRAINT "PhenotypeData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagingData" ADD CONSTRAINT "ImagingData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalData" ADD CONSTRAINT "SignalData_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAccessLog" ADD CONSTRAINT "DataAccessLog_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
