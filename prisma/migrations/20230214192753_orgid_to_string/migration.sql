/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Sender" DROP CONSTRAINT "Sender_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_organizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Sender" ALTER COLUMN "organizationId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "organizationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Sender" ADD CONSTRAINT "Sender_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
