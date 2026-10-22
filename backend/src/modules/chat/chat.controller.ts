import type { RequestHandler } from "express";
import * as chatService from "./chat.service.js";
import { AppError } from "../../utils/AppError.js";

export const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    const message = req.body.chat;
    if (!message) {
      throw new AppError("Message content cannot be empty", 400);
    }
    const response = await chatService.createMessage(message);
    return res.status(200).json({
      status: "ok",
      data: response,
    });
  } catch (err) {
    next(err);
  }
};
