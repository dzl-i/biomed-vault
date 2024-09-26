/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Researcher` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Researcher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Researcher" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken";

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "researcherId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_accessToken_key" ON "Token"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshToken_key" ON "Token"("refreshToken");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "Researcher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
