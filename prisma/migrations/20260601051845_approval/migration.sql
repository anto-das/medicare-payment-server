-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';
