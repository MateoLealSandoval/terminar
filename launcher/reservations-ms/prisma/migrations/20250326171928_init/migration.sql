/*
  Warnings:

  - You are about to drop the `OfficesParnet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhotosParnet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServicesPartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specialist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDataPartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SpecialistToUserDataPartner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfficesParnet" DROP CONSTRAINT "OfficesParnet_UserDataId_fkey";

-- DropForeignKey
ALTER TABLE "PhotosParnet" DROP CONSTRAINT "PhotosParnet_UserDataId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesPartner" DROP CONSTRAINT "ServicesPartner_UserDataId_fkey";

-- DropForeignKey
ALTER TABLE "_SpecialistToUserDataPartner" DROP CONSTRAINT "_SpecialistToUserDataPartner_A_fkey";

-- DropForeignKey
ALTER TABLE "_SpecialistToUserDataPartner" DROP CONSTRAINT "_SpecialistToUserDataPartner_B_fkey";

-- DropTable
DROP TABLE "OfficesParnet";

-- DropTable
DROP TABLE "PhotosParnet";

-- DropTable
DROP TABLE "ServicesPartner";

-- DropTable
DROP TABLE "Specialist";

-- DropTable
DROP TABLE "UserDataPartner";

-- DropTable
DROP TABLE "_SpecialistToUserDataPartner";

-- DropEnum
DROP TYPE "SpecialistStatus";

-- DropEnum
DROP TYPE "TypePayment";

-- CreateTable
CREATE TABLE "ScheduleData" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,

    CONSTRAINT "ScheduleData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);
