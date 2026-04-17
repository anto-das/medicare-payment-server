-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "unit_type" VARCHAR(50) NOT NULL DEFAULT 'TABLET';

-- CreateTable
CREATE TABLE "Cart" (
    "cart_id" TEXT NOT NULL,
    "medicine_name" VARCHAR(150) NOT NULL,
    "generic_name" VARCHAR(150) NOT NULL DEFAULT '',
    "manufacturer" TEXT NOT NULL,
    "medi_img" TEXT NOT NULL,
    "price" DECIMAL(10,0) NOT NULL,
    "category_name" TEXT NOT NULL DEFAULT 'ANTIBIOTICS'
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_cart_id_key" ON "Cart"("cart_id");
