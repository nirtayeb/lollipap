-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "emailTemplates" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verifiedSenders" INTEGER NOT NULL DEFAULT 0;
