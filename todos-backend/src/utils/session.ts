import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from 'redis';

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set");
}

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);
const redisStore = new RedisStore({ client: redisClient, prefix: "todos:" });

export const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});
