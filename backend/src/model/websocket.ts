import { WebSocket } from 'ws';

export interface CoopWebSocket extends WebSocket {
  clientId: string;
  sessionId: string;
  nextMoveTimestamp: number;
}
