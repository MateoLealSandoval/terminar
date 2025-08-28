#!/bin/bash

echo "🔬 Debug detallado del flujo de login"
echo "====================================="

# 1. Verificar que el usuario existe
echo "1️⃣ Verificando usuarios en la base de datos..."
docker compose exec postgresdb psql -U docvisualadmin -d maindb -t -c "
SET search_path TO auth_shema;
SELECT COUNT(*) as total FROM users WHERE email LIKE '%test%';
" 2>/dev/null | tr -d ' '

# 2. Crear usuario de prueba con contraseña conocida
echo -e "\n2️⃣ Creando usuario de prueba con hash conocido..."
timestamp=$(date +%s)
email="debug${timestamp}@test.com"
password="Debug1234"

# Registrar usuario
register=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\",
    \"names\": \"Debug\",
    \"lastnames\": \"User\"
  }")

if echo "$register" | grep -q "token"; then
    echo "✅ Usuario creado: $email"
    
    # 3. Verificar que se guardó en la DB
    echo -e "\n3️⃣ Verificando en base de datos..."
    docker compose exec postgresdb psql -U docvisualadmin -d maindb -t -c "
    SET search_path TO auth_shema;
    SELECT email, names, role FROM users WHERE email = '$email';
    " 2>/dev/null
    
    # 4. Capturar logs detallados durante el login
    echo -e "\n4️⃣ Intentando login con logs detallados..."
    
    # Iniciar captura de logs
    docker compose logs --tail=0 -f gateway > /tmp/gateway-debug.log 2>&1 &
    GATEWAY_PID=$!
    docker compose logs --tail=0 -f auth-ms > /tmp/auth-debug.log 2>&1 &
    AUTH_PID=$!
    
    sleep 2
    
    # Intentar login
    login=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\"
      }" \
      -w "\nSTATUS:%{http_code}")
    
    sleep 2
    
    # Detener logs
    kill $GATEWAY_PID $AUTH_PID 2>/dev/null
    
    # Analizar resultado
    status=$(echo "$login" | grep "STATUS:" | cut -d: -f2)
    body=$(echo "$login" | grep -v "STATUS:")
    
    echo "Login status: $status"
    
    if [ "$status" != "201" ] && [ "$status" != "200" ]; then
        echo "❌ Login falló"
        echo "Respuesta: $body"
        
        echo -e "\n📋 Errores en Gateway:"
        grep -i "error\|exception\|🔴" /tmp/gateway-debug.log | tail -10
        
        echo -e "\n📋 Errores en Auth-MS:"
        grep -i "error\|exception" /tmp/auth-debug.log | tail -10
    else
        echo "✅ Login exitoso!"
        echo "$body" | python3 -m json.tool
    fi
else
    echo "❌ No se pudo crear el usuario"
    echo "$register"
fi

# Limpiar
rm -f /tmp/gateway-debug.log /tmp/auth-debug.log

