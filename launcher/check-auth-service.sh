#!/bin/bash

echo "🔍 Buscando implementación de LoginUser en auth-ms"
echo "================================================="

# Buscar el método LoginUser
echo -e "\n1️⃣ Buscando método LoginUser:"
if [ -f "auth-ms/src/auth/auth.service.ts" ]; then
    grep -n "LoginUser" auth-ms/src/auth/auth.service.ts || echo "❌ No se encontró LoginUser"
    
    # Buscar variaciones
    echo -e "\n2️⃣ Buscando variaciones del método:"
    grep -n -i "login" auth-ms/src/auth/auth.service.ts | head -10
else
    echo "❌ No se encontró auth.service.ts"
    find auth-ms/src -name "*.service.ts" -exec echo "Archivo: {}" \; -exec grep -l "login" {} \;
fi

# Ver imports
echo -e "\n3️⃣ Verificando imports en auth.controller.ts:"
head -20 auth-ms/src/auth/auth.controller.ts | grep import

# Ver la declaración del servicio
echo -e "\n4️⃣ Verificando inyección del servicio:"
grep -A 5 "constructor" auth-ms/src/auth/auth.controller.ts

