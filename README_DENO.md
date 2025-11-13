# Protest Against - Deno Edition

A modernized version of Protest Against, rebuilt with Deno 2.0!

## What's New

This version has been completely modernized:

- **Deno 2.0** - Modern, secure runtime with built-in TypeScript support
- **Hono** - Fast, lightweight web framework
- **Native WebSockets** - No Socket.io dependency, using standard WebSocket API
- **Modern ES Modules** - Clean, standard JavaScript modules
- **Zero build step** - No webpack needed for the client
- **TypeScript** - Type-safe server code
- **Simplified dependencies** - Minimal external dependencies

## Running Locally

### Prerequisites

- [Deno 2.0+](https://deno.land/)

### Development

```bash
# Run in development mode with auto-reload
deno task dev

# Or run directly
deno run --allow-net --allow-read --allow-env main.ts
```

Visit http://localhost:3000

## Deployment with Coolify

This app is ready to deploy on Coolify using Docker Compose:

1. Connect your Git repository to Coolify
2. Select "Docker Compose" as the build pack
3. Coolify will automatically use the `docker-compose.yml` file
4. Set the `PORT` environment variable if needed (defaults to 3000)
5. Deploy!

## How It Works

### Server Architecture

- **main.ts** - HTTP server and WebSocket endpoint using Hono
- **src/websocket-handler.ts** - WebSocket connection management
- **src/topics-db.ts** - In-memory database for topics and protesters
- **src/utils.ts** - Utility functions for input sanitization

### Client Architecture

- **static/index.html** - Single-page application
- **static/js/websocket-client.js** - WebSocket client wrapper
- **static/js/app.js** - Main application logic
- **static/js/dom.js** - DOM manipulation utilities
- **static/js/utils.js** - Client utility functions

All client code uses modern ES modules loaded directly by the browser - no bundler required!

## Features

- Real-time protest coordination via WebSockets
- Multiple protest topics supported
- Visual protester count and animations
- Sound effects for protests
- Responsive design
- Auto-reconnection on disconnect

## Credits

Original concept by Koen van Gilst (@vnglst)

Modernized to Deno 2.0 while keeping the original spirit!
