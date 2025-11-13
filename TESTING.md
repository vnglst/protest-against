# Testing Guide

## Prerequisites

Install Deno 2.0+:
```bash
curl -fsSL https://deno.land/install.sh | sh
```

## Running the Server

```bash
# Start the server
deno task start

# Or run directly with watch mode for development
deno run --allow-net --allow-read --allow-env --watch main.ts
```

The server will start on http://localhost:3000

## Manual Testing with curl

### 1. Test Homepage
```bash
curl http://localhost:3000/
```
Expected: HTML content with "Protest against"

### 2. Test Static JavaScript
```bash
curl http://localhost:3000/static/js/app.js
```
Expected: JavaScript module code

### 3. Test Media Files
```bash
curl -I http://localhost:3000/media/boo.mp3
```
Expected: HTTP 200 with audio/mpeg content-type

### 4. Test WebSocket Endpoint (Non-WS request)
```bash
curl http://localhost:3000/ws
```
Expected: "Expected websocket" with HTTP 400

### 5. Run the Test Script
```bash
chmod +x test.sh
./test.sh
```

## Testing WebSocket Functionality

### Option 1: Using the Browser Test Tool

1. Start the server
2. Open http://localhost:3000/test-websocket.html in your browser
3. Click "Connect" to establish WebSocket connection
4. Click "Add Protester" to join the protest
5. Click "Protest!" to trigger protest animation
6. Open multiple browser tabs to test multi-user functionality

### Option 2: Using websocat (CLI tool)

Install websocat:
```bash
# macOS
brew install websocat

# Linux
wget https://github.com/vi/websocat/releases/download/v1.11.0/websocat_linux64
chmod +x websocat_linux64
```

Connect and test:
```bash
# Connect to WebSocket
websocat ws://localhost:3000/ws

# Send add protester message
{"event":"add protester","data":{"id":123,"topic":"trump"}}

# Send protesting message
{"event":"protesting","data":{}}
```

### Option 3: Using Node.js/Deno script

```javascript
// test-ws.js
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected');

  // Add protester
  ws.send(JSON.stringify({
    event: 'add protester',
    data: { id: Date.now(), topic: 'trump' }
  }));
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};

ws.onerror = (error) => {
  console.error('Error:', error);
};
```

Run with Deno:
```bash
deno run --allow-net test-ws.js
```

## Expected WebSocket Flow

1. **Client connects** to `ws://localhost:3000/ws`
2. **Client sends** "add protester" event:
   ```json
   {
     "event": "add protester",
     "data": {"id": 12345, "topic": "trump"}
   }
   ```
3. **Server broadcasts** "protester joined" to all clients in topic:
   ```json
   {
     "event": "protester joined",
     "data": {
       "id": 12345,
       "protesters": [{"id": 12345, "ip": "..."}],
       "topicsWithCounts": [{"topicName": "trump", "protesterCount": 1}]
     }
   }
   ```
4. **Client sends** "protesting" event:
   ```json
   {
     "event": "protesting",
     "data": {}
   }
   ```
5. **Server broadcasts** "protesting" to all in topic:
   ```json
   {
     "event": "protesting",
     "data": {"id": 12345}
   }
   ```
6. **Client disconnects**, server broadcasts "protester left"

## Testing in Production (Docker)

Build and run:
```bash
docker-compose up --build
```

Test:
```bash
./test.sh
```

## Common Issues

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### WebSocket Connection Refused
- Ensure server is running
- Check firewall settings
- Verify correct protocol (ws:// for http, wss:// for https)

### Static Files Not Loading
- Check file paths in `static/` directory
- Verify MIME types in browser DevTools
- Check browser console for errors
