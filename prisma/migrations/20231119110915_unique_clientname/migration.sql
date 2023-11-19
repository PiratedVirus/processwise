/*
  Warnings:

  - A unique constraint covering the columns `[clientName]` on the table `client_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "client_details_clientName_key" ON "client_details"("clientName");
