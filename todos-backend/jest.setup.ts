import { server } from "./src";
import prisma from "./src/utils/db";

beforeAll(async () => {
  // clear the database before running the tests
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
  server.close();
});

beforeEach(async () => {
  // clear the database before each test
  await prisma.user.deleteMany({});
});
