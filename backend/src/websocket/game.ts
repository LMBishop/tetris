import { Server } from "http";
import { addSessionClient, getSession, setSessionHost, setSessionState } from "../config/session-store.js";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const wss = new WebSocketServer({ noServer: true });

const sendToClient = (clientId: string, message: any) => {
  wss.clients.forEach((client: any) => {
    if (client.clientId === clientId) {
      client.send(JSON.stringify(message));
    }
  });
};

const broadcastToClients = (clientIds: string[], message: any) => {
  wss.clients.forEach((client: any) => {
    if (clientIds.includes(client.clientId)) {
      client.send(JSON.stringify(message));
    }
  });
};

export const createWebsocketServer = (server: Server): WebSocketServer => {
  server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: any) => {
    ws.clientId = uuidv4();

    ws.on("message", (message) => {
      console.log("received: %s", message);
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch (e) {
        console.log("Invalid JSON");
        return;
      }
      
      if (data.action === "host") {
        setSessionHost(data.sessionId, ws.clientId);
      } else if (data.action === "move") {
        const session = getSession(data.sessionId);
        if (!session) {
          return;
        }

        sendToClient(session.host!, {
          action: "move",
          move: data.move,
        });
      } else if (data.action === "join") {
        const session = getSession(data.sessionId);
        if (!session) {
          return;
        }

        addSessionClient(data.sessionId, ws.clientId);
        
        sendToClient(session.host!, {
          action: "join",
          clients: session.clients.length,
        });
        
        ws.send(JSON.stringify({
          action: "state",
          state: session.state,
        }));
      } else if (data.action === "start") {
        const session = getSession(data.sessionId);
        if (!session) {
          return;
        }
        
        setSessionState(data.sessionId, "playing");

        sendToClient(session.host!, {
          action: "state",
          state: "playing",
        });
        
        broadcastToClients(session.clients, {
          action: "state",
          state: "playing",
        });
      }
    });
  });

  return wss;
};

export default createWebsocketServer;
