/*
  Warnings:

  - The primary key for the `client_mailboxes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientID` on the `client_mailboxes` table. All the data in the column will be lost.
  - You are about to drop the column `mailBoxID` on the `client_mailboxes` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `client_mailboxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailBoxId` to the `client_mailboxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "client_mailboxes" DROP CONSTRAINT "client_mailboxes_pkey",
DROP COLUMN "clientID",
DROP COLUMN "mailBoxID",
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD COLUMN     "mailBoxId" INTEGER NOT NULL,
ADD CONSTRAINT "client_mailboxes_pkey" PRIMARY KEY ("mailBoxId", "clientId");
