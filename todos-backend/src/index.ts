require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import { sessionMiddleware } from "./utils/session";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";

const app = express();

app.use(bodyParser.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/todo",todoRoutes);

const PORT = process.env.PORT || process.env.NODE_ENV === "test" ? undefined : 3000;
export const server = app.listen(PORT, () => {
  if (PORT) console.log(`Server is running on port ${PORT}`);
  else console.log("Server is running in test mode");
});

export default app;
