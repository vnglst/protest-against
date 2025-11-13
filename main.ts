import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { WebSocketHandler } from "./src/websocket-handler.ts";

const app = new Hono();
const wsHandler = new WebSocketHandler();

// Serve static files from the static directory
app.use("/static/*", serveStatic({ root: "./" }));
app.use("/media/*", serveStatic({ root: "./static" }));

// Main page
app.get("/", serveStatic({ path: "./static/index.html" }));

// WebSocket endpoint
app.get("/ws", (c) => {
  const upgrade = c.req.header("upgrade");
  if (upgrade !== "websocket") {
    return c.text("Expected websocket", 400);
  }

  const { socket, response } = Deno.upgradeWebSocket(c.req.raw);
  wsHandler.handleConnection(socket, c.req.raw);

  return response;
});

const PORT = parseInt(Deno.env.get("PORT") || "3000");

console.log(`Server running on http://localhost:${PORT}`);

Deno.serve({ port: PORT }, app.fetch);
