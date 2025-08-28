-- Migración para agregar campos de pago y recordatorios
-- Ejecutar en PostgreSQL

-- 1. Agregar campos a la tabla user_data para manejo de pagos de especialistas
ALTER TABLE user_data 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS expiration_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS profile_approved BOOLEAN DEFAULT FALSE;

-- 2. Agregar campo para recordatorios en reservaciones
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

-- 3. Crear tabla de transacciones de pago
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_data(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  plan_type VARCHAR(20) NOT NULL,
  transaction_ref VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_user_data_payment_status ON user_data(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_reservations_reminder_sent ON reservations(reminder_sent);

-- 5. Agregar comentarios a las columnas para documentación
COMMENT ON COLUMN user_data.payment_status IS 'Estado del pago: PENDING, PAID, EXPIRED';
COMMENT ON COLUMN user_data.plan_type IS 'Tipo de plan: BASIC, STANDARD, PREMIUM';
COMMENT ON COLUMN user_data.payment_date IS 'Fecha cuando se realizó el pago';
COMMENT ON COLUMN user_data.expiration_date IS 'Fecha de expiración del plan';
COMMENT ON COLUMN user_data.profile_approved IS 'Si el perfil ha sido aprobado por admin';
COMMENT ON COLUMN reservations.reminder_sent IS 'Si se envió recordatorio de la cita';