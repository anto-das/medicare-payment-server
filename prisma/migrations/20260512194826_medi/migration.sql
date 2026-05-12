/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Medicine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_categoryId_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "categoryId";
