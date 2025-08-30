#!/bin/bash
echo "Creating test specialists..."

cd launcher

# Especialista 1: CON PLAN ACTIVO
echo "1. Creating specialist WITH active plan..."
timestamp=$(date +%s)
email1="specialist1_${timestamp}@docvisual.com"

# Registrar especialista
register1=$(curl -s -w "\nSTATUS:%{http_code}" \
  -X POST http://localhost:3000/auth/registerpartner \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email1\",
    \"password\": \"Test1234\",
    \"names\": \"Dr. Juan\",
    \"lastnames\": \"Pérez\",
    \"document\": \"12345678\",
    \"phone\": \"3001234567\",
    \"title\": \"Oftalmólogo\"
  }")

user1_id=$(echo "$register1" | grep -v "STATUS:" | sed 's/.*"id":"\([^"]*\)".*/\1/')

if [[ "$register1" == *"STATUS:201"* ]] || [[ "$register1" == *"STATUS:200"* ]]; then
  echo "✅ Specialist 1 created: $email1"
  
  # Crear suscripción activa (30 días)
  end_date=$(date -d "+30 days" -u +"%Y-%m-%dT%H:%M:%S.000Z")
  
  docker compose exec postgresdb psql -U docvisualadmin -d maindb -c "
  INSERT INTO auth_shema.subscriptions (id, \"userId\", \"planType\", status, \"endDate\", amount, \"paymentId\")
  VALUES (
    gen_random_uuid(),
    '$user1_id',
    'STANDARD',
    'ACTIVE',
    '$end_date',
    214200,
    'test_payment_active'
  );"
  
  echo "✅ Active subscription created for specialist 1"
else
  echo "❌ Failed to create specialist 1"
fi

# Especialista 2: SIN PLAN
echo -e "\n2. Creating specialist WITHOUT plan..."
email2="specialist2_${timestamp}@docvisual.com"

register2=$(curl -s -w "\nSTATUS:%{http_code}" \
  -X POST http://localhost:3000/auth/registerpartner \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email2\",
    \"password\": \"Test1234\",
    \"names\": \"Dra. María\",
    \"lastnames\": \"González\",
    \"document\": \"87654321\",
    \"phone\": \"3007654321\",
    \"title\": \"Optómetra\"
  }")

if [[ "$register2" == *"STATUS:201"* ]] || [[ "$register2" == *"STATUS:200"* ]]; then
  echo "✅ Specialist 2 created (NO PLAN): $email2"
else
  echo "❌ Failed to create specialist 2"
fi

# Especialista 3: CON PLAN VENCIDO
echo -e "\n3. Creating specialist WITH EXPIRED plan..."
email3="specialist3_${timestamp}@docvisual.com"

register3=$(curl -s -w "\nSTATUS:%{http_code}" \
  -X POST http://localhost:3000/auth/registerpartner \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$email3\",
    \"password\": \"Test1234\",
    \"names\": \"Dr. Carlos\",
    \"lastnames\": \"Rodríguez\",
    \"document\": \"11223344\",
    \"phone\": \"3009876543\",
    \"title\": \"Oftalmólogo Pediatra\"
  }")

user3_id=$(echo "$register3" | grep -v "STATUS:" | sed 's/.*"id":"\([^"]*\)".*/\1/')

if [[ "$register3" == *"STATUS:201"* ]] || [[ "$register3" == *"STATUS:200"* ]]; then
  echo "✅ Specialist 3 created: $email3"
  
  # Crear suscripción vencida (hace 10 días)
  expired_date=$(date -d "-10 days" -u +"%Y-%m-%dT%H:%M:%S.000Z")
  
  docker compose exec postgresdb psql -U docvisualadmin -d maindb -c "
  INSERT INTO auth_shema.subscriptions (id, \"userId\", \"planType\", status, \"endDate\", amount, \"paymentId\")
  VALUES (
    gen_random_uuid(),
    '$user3_id',
    'BASIC',
    'EXPIRED',
    '$expired_date',
    178500,
    'test_payment_expired'
  );"
  
  echo "✅ Expired subscription created for specialist 3"
else
  echo "❌ Failed to create specialist 3"
fi

echo -e "\n📋 TEST SPECIALISTS SUMMARY:"
echo "================================"
echo "1. WITH ACTIVE PLAN:"
echo "   📧 Email: $email1"
echo "   🔑 Password: Test1234"
echo "   📋 Plan: STANDARD (Active for 30 days)"
echo ""
echo "2. WITHOUT PLAN:"
echo "   📧 Email: $email2"
echo "   🔑 Password: Test1234"
echo "   📋 Plan: None"
echo ""
echo "3. WITH EXPIRED PLAN:"
echo "   📧 Email: $email3"
echo "   🔑 Password: Test1234"
echo "   📋 Plan: BASIC (Expired 10 days ago)"
echo ""
echo "🌐 Test URL: http://localhost:8080"
echo "Use these credentials to test the subscription restrictions!"
