import { createNewSession } from "../config/coop-session-store.js";
import { Request, Response } from "express";

export function createSession(req: Request, res: Response) {
  // const session = createNewSession();
  res.status(400).send();
}
