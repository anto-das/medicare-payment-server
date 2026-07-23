/*
  Warnings:

  - You are about to drop the column `categoriesCategory_id` on the `Medicine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_categoriesCategory_id_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "categoriesCategory_id";
