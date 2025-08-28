#!/bin/bash

echo "🔧 Aplicación Final de Correcciones"
echo "==================================="

# 1. Asegurar que todas las referencias están correctas
echo "1️⃣ Corrigiendo todas las referencias..."
docker compose exec auth-ms sh << 'SCRIPT'
# Backup actual
cp src/auth/auth.service.ts src/auth/auth.service.ts.final-backup

# Corregir absolutamente TODO
sed -i 's/this\.User/this.user/g' src/auth/auth.service.ts
sed -i 's/this\.Users/this.user/g' src/auth/auth.service.ts

# Verificar
echo "Referencias con User mayúscula (debe ser 0):"
grep -c "this\.User" src/auth/auth.service.ts || echo "0"

echo "Referencias correctas con user minúscula:"
grep -c "this\.user\." src/auth/auth.service.ts
SCRIPT

# 2. Reiniciar
echo -e "\n2️⃣ Reiniciando auth-ms..."
docker compose restart auth-ms

# 3. Esperar compilación
echo "⏳ Esperando compilación completa (25 segundos)..."
for i in {1..25}; do
    echo -n "."
    sleep 1
done
echo ""

# 4. Verificar compilación
echo -e "\n3️⃣ Verificando compilación..."
compilation_status=$(docker compose logs auth-ms --tail=5 2>&1)
if echo "$compilation_status" | grep -q "Found 0 errors"; then
    echo "✅ Compilación exitosa"
    
    # 5. Verificar que está escuchando
    if echo "$compilation_status" | grep -q "successfully started"; then
        echo "✅ Microservicio activo"
    fi
    
    # 6. Crear usuario de prueba
    echo -e "\n4️⃣ Creando usuario de prueba final..."
    timestamp=$(date +%s)
    email="working${timestamp}@test.com"
    password="Working123"
    
    register=$(curl -s -X POST http://localhost:3000/auth/register \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\",
        \"names\": \"Working\",
        \"lastnames\": \"User\"
      }" \
      -w "\nSTATUS:%{http_code}")
    
    reg_status=$(echo "$register" | grep "STATUS:" | cut -d: -f2)
    
    if [ "$reg_status" = "201" ] || [ "$reg_status" = "200" ]; then
        echo "✅ Usuario creado: $email"
        
        # 7. Probar login
        echo -e "\n5️⃣ Probando login final..."
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
            echo "🎉 ¡¡¡LOGIN EXITOSO!!!"
            echo "================================"
            echo "$login_body" | python3 -m json.tool
            echo "================================"
            echo "✅ SISTEMA 100% FUNCIONAL"
            echo "📧 Email: $email"
            echo "🔑 Password: $password"
            echo "🌐 URL: http://localhost:8080"
            echo "================================"
        else
            echo "❌ Login falló"
            echo "Status: $login_status"
            echo "Respuesta: $login_body"
        fi
    else
        echo "❌ Registro falló"
    fi
else
    echo "❌ Hay errores de compilación"
    docker compose logs auth-ms --tail=20 | grep error
fi

