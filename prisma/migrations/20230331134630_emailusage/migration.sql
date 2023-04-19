-- CreateTable
CREATE TABLE "EmailUsage" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "emailsSent" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmailUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmailUsage" ADD CONSTRAINT "EmailUsage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
