/*
  Warnings:

  - You are about to drop the `Subsscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subsscription" DROP CONSTRAINT "Subsscription_organizationId_fkey";

-- DropTable
DROP TABLE "Subsscription";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "isTrial" BOOLEAN NOT NULL,
    "billingPeriod" TEXT NOT NULL,
    "pricingVersion" INTEGER,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
