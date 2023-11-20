-- AlterTable
ALTER TABLE "Account" ADD COLUMN "oauth_token" TEXT;
ALTER TABLE "Account" ADD COLUMN "oauth_token_secret" TEXT;
ALTER TABLE "Account" ADD COLUMN "refresh_token_expires_in" INTEGER;
