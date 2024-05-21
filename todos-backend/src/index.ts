require("dotenv").config();

// src/index.ts
import express from "express";
import bodyParser from "body-parser";
import { sessionMiddleware } from "./utils/session";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(bodyParser.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
