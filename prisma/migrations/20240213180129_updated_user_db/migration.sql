-- AlterTable
ALTER TABLE "user_details" ADD COLUMN     "userCompany" TEXT,
ADD COLUMN     "userMailboxesAccess" TEXT,
ADD COLUMN     "userPosition" TEXT,
ALTER COLUMN "userRole" DROP NOT NULL;
