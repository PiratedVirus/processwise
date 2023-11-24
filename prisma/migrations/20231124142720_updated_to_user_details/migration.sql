/*
  Warnings:

  - You are about to drop the column `userPassword` on the `user_details` table. All the data in the column will be lost.
  - Added the required column `userRole` to the `user_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userStatus` to the `user_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_details" DROP COLUMN "userPassword",
ADD COLUMN     "userRole" TEXT NOT NULL,
ADD COLUMN     "userStatus" TEXT NOT NULL;
