-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "strength" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;
