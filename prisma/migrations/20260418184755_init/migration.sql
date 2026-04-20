/*
  Warnings:

  - You are about to drop the column `user_email` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_user_email_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "user_email",
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
