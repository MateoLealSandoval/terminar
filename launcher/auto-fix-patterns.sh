#!/bin/bash

echo "🔧 Auto-corrección de patrones de mensajes"
echo "=========================================="

# 1. Buscar el patrón actual en gateway
echo "1️⃣ Buscando patrón actual en Gateway..."
current_pattern=$(grep -r "login" gateway/src/auth/ | grep "send" | grep -oP "send\(['\"].*?['\"]" | sed "s/send(['\"]//g" | sed "s/['\"]//g" | head -1)

if [ -z "$current_pattern" ]; then
    echo "❌ No se encontró el patrón de login en el gateway"
    echo "Buscando en todos los archivos..."
    find gateway/src -name "*.ts" -exec grep -H "send.*login" {} \; | head -5
else
    echo "Patrón encontrado: '$current_pattern'"
fi

# 2. Verificar si coincide con auth-ms
auth_pattern="auth.login.user"
if [ "$current_pattern" != "$auth_pattern" ]; then
    echo "⚠️  Los patrones NO coinciden!"
    echo "   Gateway envía: '$current_pattern'"
    echo "   Auth-MS espera: '$auth_pattern'"
    
    echo -e "\n2️⃣ Opciones de corrección:"
    echo "   a) Modificar Gateway para usar 'auth.login.user'"
    echo "   b) Modificar Auth-MS para aceptar '$current_pattern'"
    
    # Buscar el archivo exacto del gateway
    gateway_file=$(find gateway/src -name "*.controller.ts" -exec grep -l "login" {} \; | head -1)
    if [ -n "$gateway_file" ]; then
        echo -e "\n📄 Archivo a modificar en Gateway: $gateway_file"
        echo "   Buscar la línea con: send('...' y cambiar a: send('auth.login.user'"
    fi
else
    echo "✅ Los patrones coinciden!"
fi

# 3. Reiniciar servicios después de cambios
echo -e "\n3️⃣ Para aplicar cambios:"
echo "   docker compose restart auth-ms gateway"

