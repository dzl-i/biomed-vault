/*
  Warnings:

  - The values [PHENOTYPE] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('DISEASE', 'CANCER', 'CARDIOVASCULAR', 'NEUROLOGICAL', 'GENETIC', 'METABOLIC', 'IMMUNOLOGICAL', 'INFECTIOUS', 'DEVELOPMENTAL', 'DIAGNOSIS', 'TREATMENT', 'SCREENING', 'PREVENTION', 'EMERGENCY', 'SYMPTOM', 'SYNDROME', 'COMPLICATION', 'SIDE_EFFECT', 'MUTATION', 'VARIANT', 'POLYMORPHISM', 'DELETION', 'INSERTION', 'FUSION', 'AMPLIFICATION', 'DRUG', 'THERAPY', 'SURGERY', 'RADIATION', 'IMMUNOTHERAPY', 'GENE_THERAPY', 'HORMONE_THERAPY', 'PEDIATRIC', 'ADULT', 'GERIATRIC', 'MATERNAL', 'BRAIN', 'HEART', 'LUNG', 'LIVER', 'KIDNEY', 'BONE', 'MUSCLE', 'BLOOD');
ALTER TABLE "Patient" ALTER COLUMN "categories" TYPE "CategoryType_new"[] USING ("categories"::text::"CategoryType_new"[]);
ALTER TABLE "GenomicData" ALTER COLUMN "categories" TYPE "CategoryType_new"[] USING ("categories"::text::"CategoryType_new"[]);
ALTER TABLE "PhenotypeData" ALTER COLUMN "categories" TYPE "CategoryType_new"[] USING ("categories"::text::"CategoryType_new"[]);
ALTER TABLE "ImagingData" ALTER COLUMN "categories" TYPE "CategoryType_new"[] USING ("categories"::text::"CategoryType_new"[]);
ALTER TABLE "SignalData" ALTER COLUMN "categories" TYPE "CategoryType_new"[] USING ("categories"::text::"CategoryType_new"[]);
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "CategoryType_old";
COMMIT;

-- DropEnum
DROP TYPE "ProjectRole";

-- DropEnum
DROP TYPE "ProjectStatus";
