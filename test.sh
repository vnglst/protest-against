#!/bin/bash

# Test script for the Deno protest app

PORT=${PORT:-3000}
BASE_URL="http://localhost:$PORT"

echo "🧪 Testing Protest Against Deno App"
echo "===================================="
echo ""

# Test 1: Homepage
echo "Test 1: GET / (Homepage)"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/)
if [ "$response" = "200" ]; then
    echo "✅ Homepage loads successfully"
else
    echo "❌ Homepage failed (HTTP $response)"
fi
echo ""

# Test 2: Static JS files
echo "Test 2: GET /static/js/app.js"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/static/js/app.js)
if [ "$response" = "200" ]; then
    echo "✅ JavaScript files served correctly"
else
    echo "❌ JavaScript files failed (HTTP $response)"
fi
echo ""

# Test 3: Media files
echo "Test 3: GET /media/boo.mp3"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/media/boo.mp3)
if [ "$response" = "200" ]; then
    echo "✅ Media files served correctly"
else
    echo "❌ Media files failed (HTTP $response)"
fi
echo ""

# Test 4: WebSocket endpoint (basic check)
echo "Test 4: WebSocket endpoint availability"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/ws)
if [ "$response" = "400" ]; then
    echo "✅ WebSocket endpoint exists (returns 400 for non-WS request)"
else
    echo "⚠️  WebSocket endpoint response: HTTP $response"
fi
echo ""

# Test 5: Homepage content check
echo "Test 5: Checking homepage content"
content=$(curl -s $BASE_URL/)
if echo "$content" | grep -q "Protest against"; then
    echo "✅ Homepage contains expected content"
else
    echo "❌ Homepage content missing"
fi
echo ""

echo "===================================="
echo "✨ Testing complete!"
