#!/bin/bash

echo "🐛 Debug del servicio de autenticación"
echo "======================================"

# 1. Verificar estructura del proyecto auth-ms
echo "1️⃣ Estructura de auth-ms:"
tree -L 3 auth-ms/src 2>/dev/null || find auth-ms/src -type f -name "*.ts" | head -20

# 2. Ver el contenido completo del servicio
echo -e "\n2️⃣ Contenido de auth.service.ts:"
if [ -f "auth-ms/src/auth/auth.service.ts" ]; then
    echo "Líneas totales: $(wc -l < auth-ms/src/auth/auth.service.ts)"
    echo "Métodos encontrados:"
    grep -n "async \|public \|private " auth-ms/src/auth/auth.service.ts | grep "(" | head -20
else
    echo "❌ No se encontró auth.service.ts"
fi

# 3. Buscar errores de compilación
echo -e "\n3️⃣ Verificando errores de compilación:"
docker compose exec auth-ms npm run build 2>&1 | grep -i error | head -10

# 4. Ver logs detallados al intentar login
echo -e "\n4️⃣ Capturando error detallado:"
# Limpiar logs
docker compose logs --tail=0 -f auth-ms > /tmp/auth-debug.log 2>&1 &
LOG_PID=$!

sleep 2

# Intentar login
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}' > /dev/null 2>&1

sleep 2
kill $LOG_PID 2>/dev/null

echo "Errores capturados:"
grep -i "error\|exception\|undefined\|cannot" /tmp/auth-debug.log | tail -10

rm -f /tmp/auth-debug.log

