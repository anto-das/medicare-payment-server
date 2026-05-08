-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_orderId_fkey";

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
