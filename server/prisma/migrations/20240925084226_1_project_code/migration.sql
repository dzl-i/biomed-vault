/*
  Warnings:

  - Added the required column `code` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "code" TEXT NOT NULL;
