#!/bin/bash

echo "🔍 Diagnóstico del Error de Login"
echo "================================="

# 1. Verificar NATS
echo -e "\n1️⃣ Verificando NATS..."
if curl -s http://localhost:8222/varz > /dev/null 2>&1; then
    connections=$(curl -s http://localhost:8222/connz | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('connections', [])))" 2>/dev/null)
    echo "✅ NATS activo con $connections conexiones"
else
    echo "❌ NATS no responde"
fi

# 2. Verificar que auth-ms está conectado a NATS
echo -e "\n2️⃣ Verificando conexión auth-ms con NATS..."
docker compose logs auth-ms --tail=20 | grep -i "microservice\|started\|error" | tail -5

# 3. Verificar base de datos
echo -e "\n3️⃣ Verificando base de datos..."
docker compose exec postgresdb psql -U docvisualadmin -d maindb -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth_shema';" 2>/dev/null | grep auth_shema > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Schema auth_shema existe"
else
    echo "❌ Schema auth_shema NO existe - ejecutando migraciones..."
    docker compose exec auth-ms npx prisma migrate deploy
fi

# 4. Probar comunicación directa con auth-ms
echo -e "\n4️⃣ Verificando comunicación Gateway -> Auth-MS..."
docker compose logs gateway --tail=50 | grep -i "auth\|login" | tail -10

# 5. Reiniciar servicios
echo -e "\n5️⃣ Reiniciando servicios problemáticos..."
docker compose restart auth-ms
sleep 5
docker compose restart gateway
sleep 5

echo -e "\n6️⃣ Probando login nuevamente..."
response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@docvisual.com","password":"Admin1234"}' \
  -w "\nSTATUS:%{http_code}")

status=$(echo "$response" | grep "STATUS:" | cut -d: -f2)
body=$(echo "$response" | grep -v "STATUS:")

if [ "$status" = "201" ] || [ "$status" = "200" ]; then
    echo "✅ Login exitoso!"
    echo "$body" | python3 -m json.tool
else
    echo "❌ Login sigue fallando (Status: $status)"
    echo "Respuesta: $body"
    
    echo -e "\n📋 Últimos errores en logs:"
    docker compose logs auth-ms --tail=10 | grep -i error
fi

