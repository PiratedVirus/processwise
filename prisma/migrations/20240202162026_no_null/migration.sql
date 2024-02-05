/*
  Warnings:

  - Made the column `city` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyName` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPerson` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPersonEmail` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentDMSName` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentDocumentFlow` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employeeCount` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endStorageSystem` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `industryType` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inputSourceOfDocument` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numberOfUsersRequired` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sampleInput` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `typeOfDocument` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pinCode` on table `client_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalDocumentsPerDay` on table `client_details` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "client_details" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "companyName" SET NOT NULL,
ALTER COLUMN "contactPerson" SET NOT NULL,
ALTER COLUMN "contactPersonEmail" SET NOT NULL,
ALTER COLUMN "currentDMSName" SET NOT NULL,
ALTER COLUMN "currentDocumentFlow" SET NOT NULL,
ALTER COLUMN "employeeCount" SET NOT NULL,
ALTER COLUMN "endStorageSystem" SET NOT NULL,
ALTER COLUMN "industryType" SET NOT NULL,
ALTER COLUMN "inputSourceOfDocument" SET NOT NULL,
ALTER COLUMN "numberOfUsersRequired" SET NOT NULL,
ALTER COLUMN "sampleInput" SET NOT NULL,
ALTER COLUMN "streetAddress" SET NOT NULL,
ALTER COLUMN "typeOfDocument" SET NOT NULL,
ALTER COLUMN "pinCode" SET NOT NULL,
ALTER COLUMN "totalDocumentsPerDay" SET NOT NULL;
