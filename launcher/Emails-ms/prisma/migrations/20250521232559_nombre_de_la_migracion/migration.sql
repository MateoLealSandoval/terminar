-- CreateEnum
CREATE TYPE "NotificationState" AS ENUM ('OPEN', 'CLOSE');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "state" "NotificationState" NOT NULL DEFAULT 'OPEN';
