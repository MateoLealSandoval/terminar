/*
  Warnings:

  - Added the required column `document` to the `PendingPartner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingPartner" ADD COLUMN     "document" TEXT NOT NULL;
