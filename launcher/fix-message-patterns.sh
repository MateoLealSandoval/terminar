#!/bin/bash

echo "🔍 Verificando patrones de mensajes entre Gateway y Auth-MS"
echo "=========================================================="

# 1. Buscar patrones en auth-ms
echo -e "\n1️⃣ Patrones en Auth-MS:"
echo "Archivo: auth-ms/src/auth/auth.controller.ts"
grep "@MessagePattern" auth-ms/src/auth/auth.controller.ts | grep -v "//" | sed 's/.*MessagePattern/Pattern:/'

# 2. Buscar cómo se envían desde gateway
echo -e "\n2️⃣ Mensajes enviados desde Gateway:"
echo "Archivo: gateway/src/auth/auth.controller.ts"

# Buscar el archivo del gateway
if [ -f "gateway/src/auth/auth.controller.ts" ]; then
    grep -A 5 "login" gateway/src/auth/auth.controller.ts | grep "send\|emit"
else
    echo "Buscando en otros archivos..."
    find gateway/src -name "*.ts" -exec grep -l "login" {} \; | while read file; do
        echo "  Archivo: $file"
        grep -A 3 -B 3 "login" "$file" | grep "send\|emit" | head -5
    done
fi

# 3. Mostrar el contenido del controlador del gateway
echo -e "\n3️⃣ Contenido del endpoint login en Gateway:"
if [ -f "gateway/src/auth/auth.controller.ts" ]; then
    sed -n '/login/,/^  }/p' gateway/src/auth/auth.controller.ts | head -20
fi

