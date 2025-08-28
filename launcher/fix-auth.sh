#!/bin/bash

echo "🔧 Reparando sistema de autenticación..."
echo "======================================"

# 1. Reiniciar solo los servicios necesarios
echo "1️⃣ Reiniciando servicios en orden..."
docker compose restart postgresdb
sleep 10

docker compose restart nats
sleep 5

docker compose restart auth-ms user-ms
sleep 10

docker compose restart gateway
sleep 5

# 2. Verificar servicios
echo -e "\n2️⃣ Verificando servicios..."
services=("postgresdb" "nats" "auth-ms" "user-ms" "gateway")
for service in "${services[@]}"; do
    if docker compose ps | grep -q "$service.*Up"; then
        echo "✅ $service está corriendo"
    else
        echo "❌ $service NO está corriendo"
        docker compose up -d $service
    fi
done

# 3. Crear un usuario nuevo de prueba
echo -e "\n3️⃣ Creando usuario de prueba..."
timestamp=$(date +%s)
email="test${timestamp}@docvisual.com"

register=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"Test1234\",
    \"names\": \"Test\",
    \"lastnames\": \"User\"
  }" \
  -w "\nSTATUS:%{http_code}")

status=$(echo "$register" | grep "STATUS:" | cut -d: -f2)
if [ "$status" = "201" ] || [ "$status" = "200" ]; then
    echo "✅ Usuario creado: $email"
    
    # Intentar login
    echo -e "\n4️⃣ Probando login..."
    login=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"Test1234\"
      }")
    
    if echo "$login" | grep -q "token"; then
        echo "✅ Login exitoso!"
        echo -e "\n📧 Credenciales funcionando:"
        echo "   Email: $email"
        echo "   Password: Test1234"
        echo -e "\n🌐 Usa estas credenciales en: http://localhost:8080"
    else
        echo "❌ Login falló"
        echo "$login"
    fi
else
    echo "❌ No se pudo crear el usuario"
    echo "$register"
fi

