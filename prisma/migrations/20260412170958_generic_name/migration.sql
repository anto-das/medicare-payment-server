/*
  Warnings:

  - Added the required column `user_location` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "generic_name" VARCHAR(150) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "user_location" VARCHAR(100) NOT NULL;
