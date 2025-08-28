#!/bin/bash

echo "Agregando logs de debug a LoginUser..."

docker compose exec auth-ms sh << 'SCRIPT'
# Hacer backup
cp src/auth/auth.service.ts src/auth/auth.service.ts.backup

# Agregar console.logs
sed -i '/async LoginUser/a\        console.log("LoginUser called with:", LoginUserDto);' src/auth/auth.service.ts
sed -i '/const user = await/a\        console.log("User found:", user);' src/auth/auth.service.ts
sed -i '/throw new RpcException/i\        console.log("Error: User not found or invalid password");' src/auth/auth.service.ts

echo "Logs agregados"
SCRIPT

# Reiniciar
docker compose restart auth-ms
sleep 10

# Probar
echo "Probando con logs..."
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'

# Ver logs
echo -e "\nLogs de auth-ms:"
docker compose logs auth-ms --tail=30 | grep -i "LoginUser\|User found\|Error:"

