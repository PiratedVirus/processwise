/*
  Warnings:

  - The `configuredMailboxes` column on the `client_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "client_details" DROP COLUMN "configuredMailboxes",
ADD COLUMN     "configuredMailboxes" TEXT[];
