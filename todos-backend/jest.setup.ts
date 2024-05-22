import { server } from "./src";
import prisma from "./src/utils/db";
import { redisClient } from "./src/utils/session";

beforeAll(async () => {
  // clear the database before running the tests
  await prisma.user.deleteMany({});
  await prisma.todo.deleteMany({});
});

afterAll(async () => {
  await redisClient.quit();
  await prisma.$disconnect();
  server.close();
});

beforeEach(async () => {
  // clear the database before each test
  // await prisma.user.deleteMany({});
});
