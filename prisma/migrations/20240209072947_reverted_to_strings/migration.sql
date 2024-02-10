-- AlterTable
ALTER TABLE "client_details" ALTER COLUMN "configuredMailboxes" DROP NOT NULL,
ALTER COLUMN "configuredMailboxes" SET DATA TYPE TEXT;
