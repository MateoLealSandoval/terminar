#!/bin/bash

echo "🔬 Debug Profundo del Sistema de Login"
echo "======================================"

# 1. Limpiar logs antiguos
echo "1️⃣ Limpiando logs antiguos..."
docker compose logs --tail=0 -f auth-ms > /tmp/auth-ms.log 2>&1 &
AUTH_LOG_PID=$!
docker compose logs --tail=0 -f gateway > /tmp/gateway.log 2>&1 &
GATEWAY_LOG_PID=$!

sleep 2

# 2. Crear usuario de prueba único
timestamp=$(date +%s)
email="debug${timestamp}@test.com"
password="Debug1234"

echo -e "\n2️⃣ Creando usuario de prueba: $email"
register_response=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\",
    \"names\": \"Debug\",
    \"lastnames\": \"User\"
  }" \
  -w "\nSTATUS:%{http_code}")

register_status=$(echo "$register_response" | grep "STATUS:" | cut -d: -f2)

if [ "$register_status" = "201" ] || [ "$register_status" = "200" ]; then
    echo "✅ Usuario registrado exitosamente"
else
    echo "❌ Fallo el registro"
    kill $AUTH_LOG_PID $GATEWAY_LOG_PID 2>/dev/null
    exit 1
fi

# 3. Esperar un momento
sleep 2

# 4. Intentar login
echo -e "\n3️⃣ Intentando login..."
login_response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\"
  }" \
  -w "\nSTATUS:%{http_code}")

login_status=$(echo "$login_response" | grep "STATUS:" | cut -d: -f2)

# 5. Detener captura de logs
kill $AUTH_LOG_PID $GATEWAY_LOG_PID 2>/dev/null

# 6. Analizar resultados
echo -e "\n4️⃣ Resultados:"
echo "Login Status: $login_status"
echo "Login Response: $(echo "$login_response" | grep -v "STATUS:")"

if [ "$login_status" != "201" ] && [ "$login_status" != "200" ]; then
    echo -e "\n❌ Login falló. Analizando logs..."
    
    echo -e "\n📋 Errores en Auth-MS:"
    grep -i "error\|exception\|failed" /tmp/auth-ms.log | tail -10
    
    echo -e "\n📋 Errores en Gateway:"
    grep -i "error\|exception\|failed\|500" /tmp/gateway.log | tail -10
    
    echo -e "\n📋 Últimas líneas de Auth-MS:"
    tail -20 /tmp/auth-ms.log
else
    echo "✅ Login exitoso!"
fi

# 7. Limpiar archivos temporales
rm -f /tmp/auth-ms.log /tmp/gateway.log

echo -e "\n5️⃣ Verificando comunicación NATS..."
curl -s http://localhost:8222/connz | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Conexiones NATS: {len(data.get('connections', []))}\")
for conn in data.get('connections', [])[:5]:
    print(f\"  - {conn.get('name', 'unnamed')} desde {conn.get('ip', 'unknown')}\")"

