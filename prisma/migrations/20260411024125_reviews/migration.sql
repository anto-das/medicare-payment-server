-- AlterTable
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY ("review_id");

-- DropIndex
DROP INDEX "Reviews_review_id_key";
