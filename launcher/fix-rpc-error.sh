#!/bin/bash

echo "🔧 Corrigiendo formato de errores RPC"
echo "===================================="

# 1. Verificar cómo se está lanzando el error
echo "1️⃣ Buscando RpcExceptions en auth.service.ts..."
docker compose exec auth-ms grep -n "throw new RpcException" src/auth/auth.service.ts | head -5

# 2. Corregir el formato de los errores
echo -e "\n2️⃣ Corrigiendo formato de errores..."
docker compose exec auth-ms sh << 'SCRIPT'
# Backup
cp src/auth/auth.service.ts src/auth/auth.service.ts.rpc-backup

# Corregir el formato de RpcException para usar statusCode numérico
# Cambiar {status: 400, ...} por {statusCode: 400, ...}
sed -i 's/status: 400/statusCode: 400/g' src/auth/auth.service.ts
sed -i 's/status: 401/statusCode: 401/g' src/auth/auth.service.ts
sed -i 's/status: 404/statusCode: 404/g' src/auth/auth.service.ts
sed -i 's/status: 500/statusCode: 500/g' src/auth/auth.service.ts

# Si hay algún {status: "error"}, cambiarlo
sed -i 's/status: "error"/statusCode: 500/g' src/auth/auth.service.ts

echo "Correcciones aplicadas"
SCRIPT

# 3. Reiniciar
echo -e "\n3️⃣ Reiniciando auth-ms..."
docker compose restart auth-ms
sleep 15

# 4. Probar
echo -e "\n4️⃣ Probando login..."
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test1755454423@docvisual.com","password":"Test1234"}' \
  -w "\nStatus: %{http_code}\n"

