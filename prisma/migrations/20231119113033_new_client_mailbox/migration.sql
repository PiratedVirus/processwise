-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('INVOICE', 'PURCHASE_ORDER', 'ORDER_CONFIRMATION', 'SHIPPING_DOCUMENT', 'CUSTOM_DOCUMENTS');

-- CreateTable
CREATE TABLE "client_mailboxes" (
    "mailBoxID" INTEGER NOT NULL,
    "clientID" INTEGER NOT NULL,
    "mailBoxAddress" TEXT NOT NULL,
    "mailBoxTemplate" "TemplateType" NOT NULL,

    CONSTRAINT "client_mailboxes_pkey" PRIMARY KEY ("mailBoxID","clientID")
);
