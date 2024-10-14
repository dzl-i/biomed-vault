/*
  Warnings:

  - You are about to drop the column `action` on the `DataAccessLog` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `DataAccessLog` table. All the data in the column will be lost.
  - Added the required column `event` to the `DataAccessLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcome` to the `DataAccessLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `ImagingData` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `ImagingData` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `SignalData` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sampleRate` on table `SignalData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataAccessLog" DROP COLUMN "action",
DROP COLUMN "details",
ADD COLUMN     "event" TEXT NOT NULL,
ADD COLUMN     "outcome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImagingData" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "SignalData" ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "sampleRate" SET NOT NULL;
