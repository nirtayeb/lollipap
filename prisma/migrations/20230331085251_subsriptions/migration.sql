-- CreateTable
CREATE TABLE "Subsscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "isTrial" BOOLEAN NOT NULL,
    "billingPeriod" TEXT NOT NULL,
    "pricingVersion" INTEGER,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Subsscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subsscription" ADD CONSTRAINT "Subsscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
