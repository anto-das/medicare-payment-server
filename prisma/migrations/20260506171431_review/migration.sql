/*
  Warnings:

  - You are about to drop the column `medicine_id` on the `Reviews` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_medicine_id_fkey";

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "medicine_id",
ADD COLUMN     "medicineMedicine_id" TEXT,
ADD COLUMN     "order_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_medicineMedicine_id_fkey" FOREIGN KEY ("medicineMedicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE SET NULL ON UPDATE CASCADE;
