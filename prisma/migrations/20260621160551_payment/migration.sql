-- DropIndex
DROP INDEX "payments_transactionId_key";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "transactionId" SET DATA TYPE TEXT;
