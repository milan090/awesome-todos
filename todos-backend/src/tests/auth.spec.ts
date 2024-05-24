import request from "supertest";
import app, { server } from "../index"; // Ensure your server is exported from index.ts
import prisma from "../utils/db";
import bcrypt from "bcryptjs";
import { redisClient } from "../utils/session";

beforeEach(async () => {
  await prisma.user.deleteMany({});
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("test@example.com");
  });

  it("should not register a user with an existing email", async () => {
    await prisma.user.create({
      data: { email: "test@example.com", hashedPassword: "anything" },
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "anything" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  it("should login an existing user", async () => {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email: "test@example.com", hashedPassword },
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
  });

  it("should get the logged-in user", async () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email: "test@example.com", hashedPassword },
    });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(loginResponse.status).toBe(200);

    const cookie = loginResponse.headers["set-cookie"];

    const response2 = await request(app)
      .get("/api/auth/user")
      .set("Cookie", cookie);

    expect(response2.status).toBe(200);
    expect(response2.body.email).toBe(email);
  });

  it("should not login with wrong credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "nonexistent@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should logout a logged-in user", async () => {
    const email = "test3@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, hashedPassword },
    });

    // Log in the user first
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(loginResponse.status).toBe(200);

    const cookie = loginResponse.headers["set-cookie"];

    const logoutResponse = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe("Logged out");
  });
});
