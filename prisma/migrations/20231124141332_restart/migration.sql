-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('Invocie', 'PURCHASE_ORDER', 'ORDER_CONFIRMATION', 'SHIPPING_DOCUMENT', 'CUSTOM_DOCUMENTS');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    "ext_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "client_details" (
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,

    CONSTRAINT "client_details_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "client_mailboxes" (
    "mailBoxId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "mailBoxAddress" TEXT NOT NULL,
    "mailBoxTemplate" "TemplateType" NOT NULL,

    CONSTRAINT "client_mailboxes_pkey" PRIMARY KEY ("mailBoxId","clientId")
);

-- CreateTable
CREATE TABLE "user_details" (
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userVerified" BOOLEAN NOT NULL,

    CONSTRAINT "user_details_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "client_details_clientId_key" ON "client_details"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "client_details_clientName_key" ON "client_details"("clientName");

-- CreateIndex
CREATE UNIQUE INDEX "client_details_clientEmail_key" ON "client_details"("clientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "client_mailboxes_mailBoxId_key" ON "client_mailboxes"("mailBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "user_details_userId_key" ON "user_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_details_userEmail_key" ON "user_details"("userEmail");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
