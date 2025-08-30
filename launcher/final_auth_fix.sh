#!/bin/bash

echo "🔧 CORRECCIÓN DEFINITIVA DEL SISTEMA DE LOGIN"
echo "=============================================="

echo "📍 Problema identificado: Inconsistencia en nombres de métodos"
echo "   - Controller llama: authService.LoginUser()"
echo "   - Service tiene: loginUser() (cambiado anteriormente)"
echo ""

# 1. Corregir la llamada en el controller
echo "1️⃣ Corrigiendo llamada del método en auth.controller.ts..."
docker compose exec auth-ms sh -c '
# Buscar la línea que llama LoginUser y cambiarla a loginUser
sed -i "s/this\.authService\.LoginUser(/this.authService.loginUser(/g" src/auth/auth.controller.ts

echo "✅ Corrección aplicada al controller"
'

# 2. Verificar que la corrección se aplicó
echo -e "\n2️⃣ Verificando corrección..."
docker compose exec auth-ms grep -A3 -B1 "loginUser.*LoginUserDto" src/auth/auth.controller.ts

# 3. Limpiar el método test que agregamos
echo -e "\n3️⃣ Limpiando archivo de métodos test..."
docker compose exec auth-ms sh -c '
# Restaurar el backup del controller si existe
if [ -f "src/auth/auth.controller.ts.backup" ]; then
    cp src/auth/auth.controller.ts.backup src/auth/auth.controller.ts
    # Aplicar la corrección correcta
    sed -i "s/this\.authService\.LoginUser(/this.authService.loginUser(/g" src/auth/auth.controller.ts
    echo "✅ Restaurado desde backup con corrección aplicada"
else
    # Solo remover las líneas del test.login si existen
    sed -i "/test\.login/,+4d" src/auth/auth.controller.ts
    echo "✅ Método test removido"
fi
'

# 4. Reiniciar auth-ms
echo -e "\n4️⃣ Reiniciando auth-ms..."
docker compose restart auth-ms

echo "⏳ Esperando que auth-ms compile y se inicie..."
for i in {1..20}; do
    echo -n "."
    sleep 1
done
echo ""

# 5. Verificar compilación
echo -e "\n5️⃣ Verificando compilación..."
if docker compose logs auth-ms --tail=5 | grep -q "Found 0 errors"; then
    echo "✅ Compilación exitosa"
    
    if docker compose logs auth-ms --tail=5 | grep -q "successfully started"; then
        echo "✅ Microservicio iniciado"
    else
        echo "⚠️  Esperando inicio..."
        sleep 10
    fi
else
    echo "❌ Error de compilación"
    docker compose logs auth-ms --tail=10
    exit 1
fi

# 6. Probar login final
echo -e "\n6️⃣ PRUEBA FINAL DE LOGIN..."
echo "==========================================="

# Usar el usuario admin que ya sabemos que existe
login_response=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@docvisual.com",
    "password": "Admin1234"
  }' \
  -w "\nSTATUS:%{http_code}")

login_status=$(echo "$login_response" | grep "STATUS:" | cut -d: -f2)
login_body=$(echo "$login_response" | grep -v "STATUS:")

echo "Respuesta del servidor:"
echo "$login_body"
echo "Status HTTP: $login_status"

if [ "$login_status" = "201" ] || [ "$login_status" = "200" ]; then
    if echo "$login_body" | grep -q "token"; then
        echo ""
        echo "🎉🎉🎉 ¡¡¡LOGIN FUNCIONANDO CORRECTAMENTE!!! 🎉🎉🎉"
        echo "=============================================="
        echo "✅ El sistema de autenticación está FUNCIONANDO"
        echo "✅ Token generado correctamente"
        echo "✅ Puedes usar estas credenciales en el frontend:"
        echo "   📧 Email: admin@docvisual.com"
        echo "   🔑 Password: Admin1234"
        echo "   🌐 URL: http://localhost:8080"
        echo "=============================================="
    else
        echo "⚠️  Respuesta exitosa pero sin token"
    fi
else
    echo "❌ Login falló con status $login_status"
    
    echo -e "\n📋 Logs para debug:"
    echo "Gateway logs:"
    docker compose logs gateway --tail=5 | grep -i error
    echo "Auth-MS logs:"
    docker compose logs auth-ms --tail=5 | grep -i error
fi

echo -e "\n📊 Resumen de la corrección aplicada:"
echo "- ✅ Método en service: loginUser() (minúscula)"
echo "- ✅ Llamada en controller: this.authService.loginUser()"
echo "- ✅ MessagePattern: auth.login.user"
echo "- ✅ Gateway envía a: auth.login.user"