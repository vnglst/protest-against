# Protest Against

Online protesting made easy! Join others in protesting against any topic in real-time.

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up
```

Open http://localhost:3000

### Using Deno

```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Start the server
deno task start
```

## Stack

- **Backend**: Deno 2.0 + Hono + WebSockets
- **Frontend**: Vanilla JavaScript (ES modules, no build!)
- **Zero dependencies**, no webpack, no bundler

## Testing

Interactive WebSocket tester:
```
open http://localhost:3000/test-websocket.html
```

## Environment

- `PORT` - Server port (default: 3000)

## Credits

Original by [Koen van Gilst](https://twitter.com/vnglst)

Inspired by Sara Vieira's [@NikkitaFTW](https://twitter.com/NikkitaFTW) music apps

Boo sound: https://www.youtube.com/watch?v=rYAQN11a2Dc
