#!/bin/bash

echo "🔧 Reiniciando DocVisual completamente..."
echo "========================================"

# 1. Detener todo
echo "1️⃣ Deteniendo servicios..."
docker compose down

# 2. Limpiar volúmenes de PostgreSQL
echo "2️⃣ Limpiando base de datos..."
docker volume rm launcher_pgdata 2>/dev/null || true

# 3. Iniciar servicios en orden
echo "3️⃣ Iniciando PostgreSQL y NATS..."
docker compose up -d postgresdb nats

echo "⏳ Esperando que PostgreSQL esté listo (20 segundos)..."
sleep 20

# 4. Iniciar microservicios
echo "4️⃣ Iniciando microservicios..."
docker compose up -d auth-ms user-ms partner-ms emails-ms reservations-ms

echo "⏳ Esperando que los microservicios estén listos (15 segundos)..."
sleep 15

# 5. Iniciar gateway
echo "5️⃣ Iniciando Gateway..."
docker compose up -d gateway

echo "⏳ Esperando que el gateway esté listo (10 segundos)..."
sleep 10

# 6. Iniciar frontend
echo "6️⃣ Iniciando Frontend..."
docker compose up -d frontend

# 7. Verificar servicios
echo -e "\n📊 Estado de los servicios:"
docker compose ps

# 8. Probar gateway
echo -e "\n🔌 Probando Gateway..."
if curl -s http://localhost:3000/files/example > /dev/null 2>&1; then
    echo "✅ Gateway respondiendo"
else
    echo "❌ Gateway no responde"
fi

# 9. Crear usuario de prueba
echo -e "\n👤 Creando usuario de prueba..."
sleep 5
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@docvisual.com",
    "password": "Admin1234",
    "names": "Admin",
    "lastnames": "DocVisual"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n✅ Sistema reiniciado completamente"
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 API: http://localhost:3000"
echo ""
echo "📧 Usuario de prueba:"
echo "   Email: admin@docvisual.com"
echo "   Password: Admin1234"
