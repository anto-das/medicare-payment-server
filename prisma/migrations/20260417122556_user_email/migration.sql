-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "user_email" TEXT;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "user"("email") ON DELETE SET NULL ON UPDATE CASCADE;
