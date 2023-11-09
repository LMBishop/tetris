import { SessionState } from "../session";

export type CoopSessionCreatedMessage = {
  type: "create";
  payload: {
    sessionId: string;
  };
};

export type ClientJoinedCoopSessionMessage = {
  type: "join";
  payload: {
    numberOfClients: number;
  };
};

export type CoopSessionStateChangeMessage = {
  type: "state";
  payload: {
    state: SessionState;
  };
};

export type CoopSessionMoveMessage = {
  type: "move";
  payload: {
    move: string;
  };
};

export type CoopSessionMoveTimeoutMessage = {
  type: "timeout";
  payload: {
    timeoutUntil: number;
  };
};

export type CoopSessionMessage =
  | CoopSessionCreatedMessage
  | ClientJoinedCoopSessionMessage
  | CoopSessionStateChangeMessage
  | CoopSessionMoveMessage
  | CoopSessionMoveTimeoutMessage;