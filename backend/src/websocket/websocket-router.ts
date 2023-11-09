import { Server } from "http";
import { wss as gameServer } from "./coop.js";

export const createWebsocketServer = (server: Server) => {

  server.on("upgrade", (req, socket, head) => {
    if (req.url?.startsWith("/coop")) {
      gameServer.handleUpgrade(req, socket, head, (ws) => {
        gameServer.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

};

export default createWebsocketServer;
