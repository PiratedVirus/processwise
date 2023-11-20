-- CreateTable
CREATE TABLE "client_details" (
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,

    CONSTRAINT "client_details_pkey" PRIMARY KEY ("clientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_details_clientId_key" ON "client_details"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "client_details_clientEmail_key" ON "client_details"("clientEmail");
