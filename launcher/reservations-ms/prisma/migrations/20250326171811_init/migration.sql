-- CreateEnum
CREATE TYPE "SpecialistStatus" AS ENUM ('ACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "TypePayment" AS ENUM ('CLINIC', 'prepaid');

-- CreateTable
CREATE TABLE "OfficesParnet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "UserDataId" TEXT NOT NULL,

    CONSTRAINT "OfficesParnet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotosParnet" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "UserDataId" TEXT,

    CONSTRAINT "PhotosParnet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "UserDataId" TEXT,
    "status" "SpecialistStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ServicesPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SpecialistStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Specialist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDataPartner" (
    "id" TEXT NOT NULL,
    "web" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "perfilPhoto" TEXT,
    "point" DOUBLE PRECISION DEFAULT 0,
    "document" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "description" TEXT,
    "name" TEXT,
    "type_of_payment" "TypePayment",
    "actions" TEXT[],

    CONSTRAINT "UserDataPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpecialistToUserDataPartner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpecialistToUserDataPartner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialist_name_key" ON "Specialist"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserDataPartner_id_key" ON "UserDataPartner"("id");

-- CreateIndex
CREATE INDEX "_SpecialistToUserDataPartner_B_index" ON "_SpecialistToUserDataPartner"("B");

-- AddForeignKey
ALTER TABLE "OfficesParnet" ADD CONSTRAINT "OfficesParnet_UserDataId_fkey" FOREIGN KEY ("UserDataId") REFERENCES "UserDataPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotosParnet" ADD CONSTRAINT "PhotosParnet_UserDataId_fkey" FOREIGN KEY ("UserDataId") REFERENCES "UserDataPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesPartner" ADD CONSTRAINT "ServicesPartner_UserDataId_fkey" FOREIGN KEY ("UserDataId") REFERENCES "UserDataPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialistToUserDataPartner" ADD CONSTRAINT "_SpecialistToUserDataPartner_A_fkey" FOREIGN KEY ("A") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialistToUserDataPartner" ADD CONSTRAINT "_SpecialistToUserDataPartner_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDataPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
