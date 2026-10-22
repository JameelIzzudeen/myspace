import multer from "multer";
import * as chatController from "./chat.controller.js";
import { Router } from "express";

const router = Router();
const upload = multer();

router.post("/messages", upload.none(), chatController.sendMessage);

export default router;
