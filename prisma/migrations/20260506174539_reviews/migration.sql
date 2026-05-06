/*
  Warnings:

  - You are about to drop the column `medicineMedicine_id` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Reviews` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_medicineMedicine_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_order_id_fkey";

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "medicineMedicine_id",
DROP COLUMN "order_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
