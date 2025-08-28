#!/bin/bash

echo "🧪 Prueba Final de Login"
echo "======================="

# 1. Crear usuario nuevo
timestamp=$(date +%s)
email="final${timestamp}@test.com"
password="Final1234"

echo "1️⃣ Creando usuario: $email"
register=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\",
    \"names\": \"Final\",
    \"lastnames\": \"Test\"
  }")

if echo "$register" | grep -q "token"; then
    echo "✅ Usuario registrado"
    token=$(echo "$register" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', '')[:20]+'...')" 2>/dev/null)
    echo "Token: $token"
    
    # 2. Esperar un poco
    sleep 3
    
    # 3. Intentar login
    echo -e "\n2️⃣ Probando login..."
    login=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\"
      }")
    
    if echo "$login" | grep -q "token"; then
        echo "🎉 ¡¡¡LOGIN EXITOSO!!!"
        echo "================================"
        echo "$login" | python3 -m json.tool
        echo "================================"
        echo "✅ SISTEMA COMPLETAMENTE FUNCIONAL"
        echo "📧 Email: $email"
        echo "🔑 Password: $password"
        echo "🌐 Abre http://localhost:8080 y usa estas credenciales"
        echo "================================"
    else
        echo "❌ Login falló:"
        echo "$login"
        
        # Debug
        echo -e "\n�� Verificando logs..."
        docker compose logs auth-ms --tail=10 | grep -i "🔵\|🔴\|LoginUser"
    fi
else
    echo "❌ No se pudo registrar el usuario:"
    echo "$register"
fi

