/*
  Warnings:

  - You are about to drop the column `order_quantity` on the `Order_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order_item" DROP COLUMN "order_quantity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
