-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "medicine_id" TEXT;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE SET NULL ON UPDATE CASCADE;
