#!/bin/bash

echo "🔧 Verificando corrección del sistema"
echo "====================================="

# 1. Verificar que no hay errores de compilación
echo "1️⃣ Verificando compilación de auth-ms..."
docker compose logs auth-ms --tail=30 | grep -i "error" > /tmp/errors.log
if [ -s /tmp/errors.log ]; then
    echo "❌ Hay errores de compilación:"
    cat /tmp/errors.log
else
    echo "✅ No hay errores de compilación"
fi

# 2. Verificar que el microservicio está iniciado
echo -e "\n2️⃣ Verificando inicio del microservicio..."
if docker compose logs auth-ms --tail=10 | grep -q "Nest microservice successfully started"; then
    echo "✅ Microservicio iniciado correctamente"
else
    echo "❌ Microservicio no iniciado"
    echo "Reiniciando..."
    docker compose restart auth-ms
    sleep 10
fi

# 3. Crear usuario de prueba
echo -e "\n3️⃣ Creando usuario de prueba..."
timestamp=$(date +%s)
email="working${timestamp}@test.com"
password="Working123"

register=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email\",
    \"password\": \"$password\",
    \"names\": \"Working\",
    \"lastnames\": \"Test\"
  }" \
  -w "\nSTATUS:%{http_code}")

status=$(echo "$register" | grep "STATUS:" | cut -d: -f2)

if [ "$status" = "201" ] || [ "$status" = "200" ]; then
    echo "✅ Usuario registrado: $email"
    
    # 4. Probar login
    echo -e "\n4️⃣ Probando login..."
    sleep 2
    
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
        echo "✅ ¡LOGIN EXITOSO!"
        echo "$login_body" | python3 -m json.tool 2>/dev/null || echo "$login_body"
        echo -e "\n🎉 ¡SISTEMA FUNCIONANDO CORRECTAMENTE!"
        echo "📧 Credenciales de prueba:"
        echo "   Email: $email"
        echo "   Password: $password"
        echo "🌐 URL: http://localhost:8080"
    else
        echo "❌ Login falló (Status: $login_status)"
        echo "Respuesta: $login_body"
    fi
else
    echo "❌ Registro falló (Status: $status)"
fi

# 5. Verificar suscripciones NATS
echo -e "\n5️⃣ Verificando suscripciones NATS..."
subs=$(curl -s http://localhost:8222/connz | python3 -c "
import sys, json
data = json.load(sys.stdin)
total = sum([conn.get('subscriptions', 0) for conn in data.get('connections', [])])
print(total)" 2>/dev/null)

echo "Total de suscripciones activas: $subs"
if [ "$subs" -gt "10" ]; then
    echo "✅ Servicios conectados correctamente"
else
    echo "⚠️  Pocas suscripciones, algunos servicios pueden no estar conectados"
fi

rm -f /tmp/errors.log

