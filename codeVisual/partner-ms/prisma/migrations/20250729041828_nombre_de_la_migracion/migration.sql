-- AlterTable
ALTER TABLE "ServicesPartner" ADD COLUMN     "serviceNameId" TEXT;

-- CreateTable
CREATE TABLE "serviceName" (
    "id" TEXT NOT NULL,
    "name" "ServiceName" NOT NULL,

    CONSTRAINT "serviceName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "serviceName_name_key" ON "serviceName"("name");

-- AddForeignKey
ALTER TABLE "ServicesPartner" ADD CONSTRAINT "ServicesPartner_serviceNameId_fkey" FOREIGN KEY ("serviceNameId") REFERENCES "serviceName"("id") ON DELETE SET NULL ON UPDATE CASCADE;
