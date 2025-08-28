-- CreateEnum para PaymentStatus
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED');

-- CreateEnum para PlanType
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'PREMIUM', 'ENTERPRISE');

-- Agregar columnas de pagos a UserDataPartner
ALTER TABLE "UserDataPartner" ADD COLUMN "payment_status" "PaymentStatus";
ALTER TABLE "UserDataPartner" ADD COLUMN "plan_type" "PlanType";
ALTER TABLE "UserDataPartner" ADD COLUMN "payment_date" TIMESTAMP(3);
ALTER TABLE "UserDataPartner" ADD COLUMN "expiration_date" TIMESTAMP(3);

-- Crear tabla PaymentTransaction
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "transactionId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "planType" "PlanType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- Crear índices únicos
CREATE UNIQUE INDEX "PaymentTransaction_transactionId_key" ON "PaymentTransaction"("transactionId");

-- Crear relación con UserDataPartner
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "UserDataPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;