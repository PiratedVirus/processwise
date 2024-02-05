/*
  Warnings:

  - The `pinCode` column on the `client_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalDocumentsPerDay` column on the `client_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "client_details" DROP COLUMN "pinCode",
ADD COLUMN     "pinCode" INTEGER,
DROP COLUMN "totalDocumentsPerDay",
ADD COLUMN     "totalDocumentsPerDay" INTEGER;
