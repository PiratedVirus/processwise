/*
  Warnings:

  - The primary key for the `client_mailboxes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[mailBoxId]` on the table `client_mailboxes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `client_mailboxes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "client_mailboxes" DROP CONSTRAINT "client_mailboxes_pkey",
ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ALTER COLUMN "mailBoxId" SET DATA TYPE TEXT,
ADD CONSTRAINT "client_mailboxes_pkey" PRIMARY KEY ("mailBoxId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "client_mailboxes_mailBoxId_key" ON "client_mailboxes"("mailBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "client_mailboxes_clientId_key" ON "client_mailboxes"("clientId");
