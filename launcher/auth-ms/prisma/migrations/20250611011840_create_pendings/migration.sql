/*
  Warnings:

  - Added the required column `side_back` to the `PendingPartner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side_front` to the `PendingPartner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `PendingPartner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingPartner" ADD COLUMN     "side_back" TEXT NOT NULL,
ADD COLUMN     "side_front" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
