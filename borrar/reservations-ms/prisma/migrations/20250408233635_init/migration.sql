/*
  Warnings:

  - Added the required column `price` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profecionalId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profecionalId" TEXT NOT NULL;
