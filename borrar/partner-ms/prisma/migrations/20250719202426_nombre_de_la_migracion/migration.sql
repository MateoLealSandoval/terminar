/*
  Warnings:

  - Added the required column `type` to the `Prepagadas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "typePayment" AS ENUM ('SITE', 'ANTICIPATED');

-- AlterTable
ALTER TABLE "Prepagadas" ADD COLUMN     "type" "TypePayment" NOT NULL;
