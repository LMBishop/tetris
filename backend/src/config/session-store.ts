export type Session = {
  id: string;
  state: string;
  host?: string;
  clients: string[];
};

const sessions: { [key: string]: Session } = {};

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


export const createNewSession = (): Session => {
  const id = makeid(10);
  const session = {
    id,
    state: "waiting",
    host: undefined,
    clients: [],
  };
  sessions[id] = session;
  return session;
};

export const setSessionState = (id: string, state: string): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id].state = state;
};

export const setSessionHost = (id: string, clientId: string): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id].host = clientId;
};

export const addSessionClient = (id: string, clientId: string): void => {
  if (!sessions[id]) {
    return;
  }

  sessions[id]?.clients.push(clientId);
};

export const cleanupSession = (id: string): void => {
  if (!sessions[id]) {
    return;
  }

//  if (sessions[id].host) {
//    sessions[id].host!.close();
//  }
//  
//  sessions[id].clients.forEach((client) => {
//    client.close();
//  });

  delete sessions[id];
}

export const getSession = (id: string): Session => {
  return sessions[id];
};