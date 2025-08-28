/*
  Warnings:

  - You are about to drop the column `expired` on the `Reservation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "reservationStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "expired",
ADD COLUMN     "calificationId" TEXT,
ADD COLUMN     "status" "reservationStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "Calification" (
    "id" TEXT NOT NULL,
    "recommends" INTEGER DEFAULT 0,
    "service_specialist" INTEGER DEFAULT 0,
    "recomendations_specialist" INTEGER DEFAULT 0,
    "personal_attention" INTEGER DEFAULT 0,
    "quality" INTEGER DEFAULT 0,
    "time_service" INTEGER DEFAULT 0,
    "time_waiting" INTEGER DEFAULT 0,
    "site" INTEGER DEFAULT 0,
    "ubication_and_comfort" INTEGER DEFAULT 0,
    "comments" TEXT,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "Calification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Calification_reservationId_key" ON "Calification"("reservationId");

-- AddForeignKey
ALTER TABLE "Calification" ADD CONSTRAINT "Calification_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
