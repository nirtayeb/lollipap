/*
  Warnings:

  - You are about to drop the column `emailTemplates` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedSenders` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sender_email_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "emailTemplates",
DROP COLUMN "verifiedSenders";
