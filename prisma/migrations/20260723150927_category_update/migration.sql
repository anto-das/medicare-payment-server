-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "categoriesCategory_id" TEXT;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_categoriesCategory_id_fkey" FOREIGN KEY ("categoriesCategory_id") REFERENCES "Categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;
