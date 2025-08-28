/*
  Warnings:

  - You are about to drop the column `closeTime` on the `ScheduleData` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `ScheduleData` table. All the data in the column will be lost.
  - You are about to drop the column `openTime` on the `ScheduleData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[officeId]` on the table `ScheduleData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ScheduleData" DROP COLUMN "closeTime",
DROP COLUMN "day",
DROP COLUMN "openTime";

-- CreateTable
CREATE TABLE "SheduleItem" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "SheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleData_officeId_key" ON "ScheduleData"("officeId");

-- AddForeignKey
ALTER TABLE "SheduleItem" ADD CONSTRAINT "SheduleItem_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "ScheduleData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
