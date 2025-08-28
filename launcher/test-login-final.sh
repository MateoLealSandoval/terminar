#!/bin/bash

echo "🧪 Prueba final del sistema de login"
echo "===================================="

# Crear usuario nuevo
timestamp=$(date +%s)
email="final${timestamp}@test.com"
password="Final1234"

echo "1️⃣ Registrando: $email"
register=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\",
    \"names\": \"Final\",
    \"lastnames\": \"Test\"
  }")

if echo "$register" | grep -q "token"; then
    echo "✅ Registro exitoso"
    
    sleep 2
    
    echo -e "\n2️⃣ Probando login..."
    login=$(curl -s -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\"
      }")
    
    if echo "$login" | grep -q "token"; then
        echo "✅ ¡LOGIN EXITOSO!"
        echo "$login" | python3 -m json.tool
        echo -e "\n🎉 Sistema funcionando correctamente"
        echo "🌐 Puedes usar estas credenciales en http://localhost:8080"
        echo "   Email: $email"
        echo "   Password: $password"
    else
        echo "❌ Login falló:"
        echo "$login"
    fi
else
    echo "❌ Registro falló:"
    echo "$register"
fi

