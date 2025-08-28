/*
  Warnings:

  - Changed the type of `type` on the `Prepagadas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "typePaymentPrepagadas" AS ENUM ('SITE', 'ANTICIPATED');

-- AlterTable
ALTER TABLE "Prepagadas" DROP COLUMN "type",
ADD COLUMN     "type" "typePaymentPrepagadas" NOT NULL;

-- DropEnum
DROP TYPE "typePayment";
