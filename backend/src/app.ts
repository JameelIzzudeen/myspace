import express, { type ErrorRequestHandler } from "express";
import "dotenv/config";
import cors from "cors";

import testRouter from "./modules/test_api/test.route.js";
import chatRouter from "./modules/chat/chat.route.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://192.168.0.140:3001",
      "http://127.0.0.1:3001",
      "http://localhost:3001",
    ],
  }),
);

app.use(express.json());
app.use("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    data: "api healthy",
  });
});
app.use("/api/v1/test", testRouter);
app.use("/api/v1/chat", chatRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message,
  });
};

app.use(errorHandler);

export default app;
