const sessions = {};
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
export const createNewSession = () => {
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
export const setSessionState = (id, state) => {
    if (!sessions[id]) {
        return;
    }
    sessions[id].state = state;
};
export const setSessionHost = (id, clientId) => {
    if (!sessions[id]) {
        return;
    }
    sessions[id].host = clientId;
};
export const addSessionClient = (id, clientId) => {
    var _a;
    if (!sessions[id]) {
        return;
    }
    (_a = sessions[id]) === null || _a === void 0 ? void 0 : _a.clients.push(clientId);
};
export const cleanupSession = (id) => {
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
};
export const getSession = (id) => {
    return sessions[id];
};
//# sourceMappingURL=session-store.js.map