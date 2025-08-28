-- CreateEnum para el nuevo tipo de pago si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'typePaymentPrepagadas') THEN
        CREATE TYPE "typePaymentPrepagadas" AS ENUM ('SITE', 'ANTICIPATED');
    END IF;
END $$;

-- Agregar la columna type a Prepagadas si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Prepagadas' AND column_name = 'type') THEN
        ALTER TABLE "Prepagadas" ADD COLUMN "type" "typePaymentPrepagadas" NOT NULL DEFAULT 'SITE';
    END IF;
END $$;