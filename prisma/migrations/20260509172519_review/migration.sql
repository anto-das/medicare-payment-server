/*
  Warnings:

  - Added the required column `customer_name` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "customer_name" TEXT NOT NULL;
