import express from "express";
import { createSession } from "./routes/session.route.js";

const router = express.Router();

router.post("/session", createSession);

export default router;