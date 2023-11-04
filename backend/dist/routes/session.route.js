import { createNewSession } from "../config/session-store.js";
export function createSession(req, res) {
    const session = createNewSession();
    res.status(201).send(session);
}
//# sourceMappingURL=session.route.js.map