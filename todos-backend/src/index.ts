require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import { sessionMiddleware } from "./utils/session";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(bodyParser.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/todo",todoRoutes);

const PORT = process.env.BACKEND_PORT ? process.env.BACKEND_PORT : process.env.NODE_ENV === "test" ? undefined : 8000;
export const server = app.listen(PORT, () => {
  if (PORT) console.log(`Server is running on port ${PORT}`);
  else console.log("Server is running in test mode");
});

export default app;
