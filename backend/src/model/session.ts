import { CoopWebSocket } from "./websocket";

export type CoopSession = {
  id: string;
  state: SessionState;
  host: CoopWebSocket;
  clients: CoopWebSocket[];
};

export type VersusSession = {
  id: string;
  state: SessionState;
  clients: string[];
};

export type SessionState = 'waiting' | 'playing' | 'finished';