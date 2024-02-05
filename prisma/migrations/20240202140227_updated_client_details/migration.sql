/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `client_details` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `client_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyName]` on the table `client_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactPersonEmail]` on the table `client_details` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "client_details_clientEmail_key";

-- DropIndex
DROP INDEX "client_details_clientName_key";

-- AlterTable
ALTER TABLE "client_details" DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "contactPersonEmail" TEXT,
ADD COLUMN     "currentDMSName" TEXT,
ADD COLUMN     "currentDocumentFlow" TEXT,
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "endStorageSystem" TEXT,
ADD COLUMN     "industryType" TEXT,
ADD COLUMN     "inputSourceOfDocument" TEXT,
ADD COLUMN     "numberOfUsersRequired" INTEGER,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "sampleInput" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "totalDocumentsPerDay" TEXT,
ADD COLUMN     "typeOfDocument" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "client_details_companyName_key" ON "client_details"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "client_details_contactPersonEmail_key" ON "client_details"("contactPersonEmail");
