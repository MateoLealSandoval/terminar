-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'USER_PARTNER', 'ADMIN', 'SUPER_ADMIN', 'DELETED_USER', 'DELETED_USER_PARTNER', 'PENDING_DELETE', 'PENDING_PARTNER');

-- CreateEnum
CREATE TYPE "StatusPendingPartner" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "lastnames" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingPartner" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "lastnames" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "StatusPendingPartner" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PendingPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingPartner_email_key" ON "PendingPartner"("email");
