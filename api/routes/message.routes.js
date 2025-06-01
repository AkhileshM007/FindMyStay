import express from "express";
import { sendMessage, getMessages, getInbox, deleteMessage } from "../controllers/message.controller.js";
//import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", getMessages);
router.get("/inbox/:userId", getInbox);
router.delete("/:id", deleteMessage);

export default router;