#!/bin/bash

echo "🔧 Prueba Completa del Sistema"
echo "=============================="

# 1. Verificar compilación
echo "1️⃣ Verificando compilación de auth-ms..."
if docker compose logs auth-ms --tail=5 | grep -q "Found 0 errors"; then
    echo "✅ Sin errores de compilación"
else
    echo "❌ Hay errores - verificando..."
    docker compose logs auth-ms --tail=20 | grep error
    echo "Intentando corregir..."
    docker compose exec auth-ms sh -c "sed -i 's/this\.User\./this.user./g' src/auth/auth.service.ts"
    docker compose restart auth-ms
    sleep 15
fi

# 2. Verificar que el microservicio está activo
echo -e "\n2️⃣ Verificando microservicio..."
if docker compose logs auth-ms --tail=10 | grep -q "Nest microservice successfully started"; then
    echo "✅ Microservicio activo"
else
    echo "⚠️  Reiniciando microservicio..."
    docker compose restart auth-ms
    sleep 15
fi

# 3. Crear usuario nuevo
echo -e "\n3️⃣ Creando usuario de prueba..."
timestamp=$(date +%s)
email="test${timestamp}@docvisual.com"
password="Test1234"

register=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\",
    \"names\": \"Test\",
    \"lastnames\": \"User\"
  }" \
  -w "\nSTATUS:%{http_code}")

reg_status=$(echo "$register" | grep "STATUS:" | cut -d: -f2)

if [ "$reg_status" = "201" ] || [ "$reg_status" = "200" ]; then
    echo "✅ Usuario creado: $email"
    
    # 4. Intentar login
    echo -e "\n4️⃣ Probando login..."
    sleep 3
    
    login=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\"
      }" \
      -w "\nSTATUS:%{http_code}")
    
    login_status=$(echo "$login" | grep "STATUS:" | cut -d: -f2)
    login_body=$(echo "$login" | grep -v "STATUS:")
    
    if [ "$login_status" = "201" ] || [ "$login_status" = "200" ]; then
        echo "🎉 ¡LOGIN EXITOSO!"
        echo "$login_body" | python3 -m json.tool
        echo -e "\n✅ SISTEMA COMPLETAMENTE FUNCIONAL"
        echo "================================"
        echo "📧 Email: $email"
        echo "🔑 Password: $password"
        echo "🌐 URL: http://localhost:8080"
        echo "================================"
    else
        echo "❌ Login falló (Status: $login_status)"
        echo "Respuesta: $login_body"
        
        # Debug
        echo -e "\n📋 Debug:"
        docker compose logs auth-ms --tail=5 | grep -i error
        docker compose logs gateway --tail=5 | grep -i error
    fi
else
    echo "❌ No se pudo crear usuario (Status: $reg_status)"
    echo "$register" | grep -v "STATUS:"
fi

