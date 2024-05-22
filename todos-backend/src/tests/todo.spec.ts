// src/tests/todo.test.ts
import request from "supertest";
import app, { server } from "../index"; // Ensure your server is exported from index.ts
import prisma from "../utils/db";
import bcrypt from "bcryptjs";
import { redisClient } from "../utils/session";

const userCredentials = {
  email: "testuser@example.com",
  password: "password123",
};
let authCookie: string;

beforeAll(async () => {
  // Create a user and log in to get auth cookie
  const hashedPassword = await bcrypt.hash(userCredentials.password, 10);
  await prisma.user.create({
    data: { email: userCredentials.email, hashedPassword },
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send(userCredentials);

  authCookie = loginResponse.headers["set-cookie"];
});

afterAll(async () => {
  await prisma.todo.deleteMany({});
  await prisma.user.deleteMany({});

  // server.close();
});

describe("Todo API", () => {
  it("should create a new todo", async () => {
    const response = await request(app)
      .post("/api/todo/create")
      .set("Cookie", authCookie)
      .send({
        title: "New Todo",
        description: "Todo description",
        status: "TODO",
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Todo");
  });

  it("should get all todos", async () => {
    const response = await request(app)
      .get("/api/todo")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("should update an existing todo", async () => {
    const todos = await prisma.todo.findMany();
    const todoId = todos[0].id;

    const response = await request(app)
      .put(`/api/todo/update/${todoId}`)
      .set("Cookie", authCookie)
      .send({
        title: "Updated Todo",
        description: "Updated description",
        status: "IN_PROGRESS",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Todo");
  });

  it("should reorder todos", async () => {
    await prisma.todo.deleteMany({});

    const newTodo1 = await request(app)
      .post("/api/todo/create")
      .set("Cookie", authCookie)
      .send({
        title: "Another Todo",
        description: "Another description",
        status: "TODO",
      });

    const newTodo2 = await request(app)
      .post("/api/todo/create")
      .set("Cookie", authCookie)
      .send({
        title: "Yet Another Todo",
        description: "Yet another description",
        status: "TODO",
      });

    const newTodo3 = await request(app)
      .post("/api/todo/create")
      .set("Cookie", authCookie)
      .send({
        title: "Last Todo",
        description: "Last description",
        status: "TODO",
      });

    const newOrder = {
      todos: [newTodo2.body.id, newTodo3.body.id, newTodo1.body.id],
    };

    const response = await request(app)
      .put("/api/todo/reorder")
      .set("Cookie", authCookie)
      .send(newOrder);

    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe("Yet Another Todo");
    expect(response.body[1].title).toBe("Last Todo");
    expect(response.body[2].title).toBe("Another Todo");
  });

  it("should delete a todo", async () => {
    const todos = await prisma.todo.findMany();
    const todoId = todos[0].id;

    const response = await request(app)
      .delete(`/api/todo/delete/${todoId}`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    const remainingTodos = await prisma.todo.findMany();
    expect(remainingTodos).toHaveLength(todos.length - 1);
  });
});
