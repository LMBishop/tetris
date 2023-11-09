import {
  addSessionClient,
  createNewSession,
  getSession,
  setSessionState,
} from "../config/coop-session-store.js";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IncomingMessage } from "http";
import { CoopWebSocket } from "../model/websocket.js";
import { parse } from "url";
import {
  ClientJoinedCoopSessionMessage,
  CoopSessionCreatedMessage,
  CoopSessionMessage,
  CoopSessionMoveMessage,
  CoopSessionMoveTimeoutMessage,
  CoopSessionStateChangeMessage,
} from "../model/actions/coop.js";

export const wss = new WebSocketServer({ noServer: true });

const sendMessageToClient = (
  client: CoopWebSocket,
  message: CoopSessionMessage
) => {
  if (client.readyState === client.OPEN) {
    client.send(JSON.stringify(message));
    console.log(
      `Sent message to client ${client.clientId}: ${JSON.stringify(message)}}`
    );
  }
};

wss.on("connection", (ws: CoopWebSocket, req: IncomingMessage) => {
  ws.clientId = uuidv4();

  const url = parse(req.url!, true);

  if (url.query.action === "create") {
    const session = createNewSession(ws);
    sendMessageToClient(ws, <CoopSessionCreatedMessage>{
      type: "create",
      payload: {
        sessionId: session.id,
      },
    });
    ws.sessionId = session.id;
  } else if (url.query.action === "join") {
    const session = getSession(url.query.sessionId as string);
    if (!session) {
      ws.close();
      return;
    }

    addSessionClient(url.query.sessionId as string, ws);

    sendMessageToClient(session.host, <ClientJoinedCoopSessionMessage>{
      type: "join",
      payload: {
        numberOfClients: session.clients.length,
      },
    });
    sendMessageToClient(ws, <CoopSessionStateChangeMessage>{
      type: "state",
      payload: {
        state: session.state,
      },
    });

    ws.sessionId = session.id;
  } else {
    ws.close();
    return;
  }

  ws.on("message", (message) => {
    console.log(`Received message from client ${ws.clientId}: ${message}`);
    let data: any;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      return;
    }

    const session = getSession(ws.sessionId);
    if (!session) {
      return;
    }

    const type = data.type as string;
    const payload = data.payload as any;

    if (!type || !payload) {
      return;
    }

    if (type === "move") {
      if (Date.now() - ws.nextMoveTimestamp < 0) {
        return;
      }

      sendMessageToClient(session.host, <CoopSessionMoveMessage>{
        type: "move",
        payload: {
          move: payload.move,
        },
      });

      ws.nextMoveTimestamp = Date.now() + 1000;

      sendMessageToClient(ws, <CoopSessionMoveTimeoutMessage>{
        type: "timeout",
        payload: {
          timeoutUntil: ws.nextMoveTimestamp,
        },
      });
    } else if (type === "start") {
      session.state = "playing";

      [session.host, ...session.clients].forEach((client) => {
        sendMessageToClient(client, <CoopSessionStateChangeMessage>{
          type: "state",
          payload: {
            state: "playing",
          },
        });
      });
    } else if (type === "end") {
      session.state = "finished";

      [session.host, ...session.clients].forEach((client) => {
        sendMessageToClient(client, <CoopSessionStateChangeMessage>{
          type: "state",
          payload: {
            state: "finished",
          },
        });
      });
    }
  });
});
