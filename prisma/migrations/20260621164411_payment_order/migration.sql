/*
  Warnings:

  - A unique constraint covering the columns `[customer_email]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Orders_customer_email_key" ON "Orders"("customer_email");
