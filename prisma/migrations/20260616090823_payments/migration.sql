/*
  Warnings:

  - You are about to drop the column `payment_status` on the `payments` table. All the data in the column will be lost.
  - Added the required column `name` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_status",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "user_email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "user"("email") ON DELETE CASCADE ON UPDATE CASCADE;
