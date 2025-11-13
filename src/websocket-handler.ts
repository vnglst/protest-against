import { TopicsDB } from "./topics-db.ts";
import { sanitizeTopic } from "./utils.ts";
import { DEFAULT_TOPIC } from "./config.ts";

interface WebSocketMessage {
  event: string;
  data?: unknown;
}

interface ProtesterData {
  id: number;
  topic: string;
}

export class WebSocketHandler {
  private db: TopicsDB;
  private clients: Map<WebSocket, ClientData>;

  constructor() {
    this.db = new TopicsDB(DEFAULT_TOPIC);
    this.clients = new Map();
  }

  handleConnection(ws: WebSocket, req: Request): void {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";

    const clientData: ClientData = {
      socket: ws,
      ip,
      protesterAdded: false,
      protesterId: 0,
      topic: DEFAULT_TOPIC,
    };

    this.clients.set(ws, clientData);

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(ws, message, clientData);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      this.handleDisconnect(ws, clientData);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private handleMessage(
    ws: WebSocket,
    message: WebSocketMessage,
    clientData: ClientData,
  ): void {
    switch (message.event) {
      case "add protester":
        this.handleAddProtester(ws, message.data as ProtesterData, clientData);
        break;
      case "protesting":
        this.handleProtesting(clientData);
        break;
      default:
        console.log("Unknown event:", message.event);
    }
  }

  private handleAddProtester(
    ws: WebSocket,
    data: ProtesterData,
    clientData: ClientData,
  ): void {
    if (clientData.protesterAdded) return;

    const topic = sanitizeTopic(data.topic);
    const protester = { id: data.id, ip: clientData.ip };

    this.db.addProtester(topic, protester);

    clientData.protesterAdded = true;
    clientData.protesterId = data.id;
    clientData.topic = topic;

    // Broadcast to all clients in the same topic (including sender)
    this.broadcastToTopic(topic, {
      event: "protester joined",
      data: {
        id: data.id,
        protesters: this.db.getProtesters(topic),
        topicsWithCounts: this.db.getTopicsWithCounts(),
      },
    });
  }

  private handleProtesting(clientData: ClientData): void {
    this.broadcastToTopic(clientData.topic, {
      event: "protesting",
      data: { id: clientData.protesterId },
    });
  }

  private handleDisconnect(ws: WebSocket, clientData: ClientData): void {
    if (clientData.protesterAdded) {
      this.db.removeProtester(clientData.topic, clientData.protesterId);

      // Broadcast to others in the topic (excluding the disconnected client)
      this.broadcastToTopic(
        clientData.topic,
        {
          event: "protester left",
          data: {
            id: clientData.protesterId,
            protesters: this.db.getProtesters(clientData.topic),
            topicsWithCounts: this.db.getTopicsWithCounts(),
          },
        },
        ws,
      );
    }

    this.clients.delete(ws);
  }

  private broadcastToTopic(
    topic: string,
    message: WebSocketMessage,
    exclude?: WebSocket,
  ): void {
    const messageStr = JSON.stringify(message);

    for (const [socket, clientData] of this.clients.entries()) {
      if (
        clientData.topic === topic &&
        socket.readyState === WebSocket.OPEN &&
        socket !== exclude
      ) {
        socket.send(messageStr);
      }
    }
  }
}

interface ClientData {
  socket: WebSocket;
  ip: string;
  protesterAdded: boolean;
  protesterId: number;
  topic: string;
}
