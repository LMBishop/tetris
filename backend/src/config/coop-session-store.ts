import { CoopSession, SessionState } from "../model/session";
import { CoopWebSocket } from "../model/websocket";

const sessions: { [key: string]: CoopSession } = {};

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


export const createNewSession = (host: CoopWebSocket): CoopSession => {
  const id = makeid(10);
  const session: CoopSession = {
    id,
    state: "waiting",
    host: host,
    clients: [],
  };
  sessions[id] = session;
  return session;
};

export const setSessionState = (id: string, state: SessionState): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id].state = state;
  
  if (state === "finished") {
    cleanupSession(id);
  }
};

export const setSessionHost = (id: string, client: CoopWebSocket): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id].host = client;
};

export const addSessionClient = (id: string, client: CoopWebSocket): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id]?.clients.push(client);
};

export const cleanupSession = (id: string): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id].host.close();
  
  sessions[id].clients.forEach(client => client.close());

  delete sessions[id];
}

export const getSession = (id: string): CoopSession => {
  return sessions[id];
};