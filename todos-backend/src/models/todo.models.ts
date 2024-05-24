import { Todo } from "@prisma/client";
import prisma from "../utils/db";

const createTodo = async (
  userId: string,
  data: Pick<Todo, "title" | "description" | "dueDate" | "status">
): Promise<Todo> => {
  const lastTodo = await prisma.todo.findFirst({
    where: {
      nextTodoId: null,
    },
  });
  return await prisma.todo.create({
    data: {
      ...data,
      userId,
      parentTodo: lastTodo ? { connect: { id: lastTodo.id } } : undefined,
    },
  });
};

const getTodos = async (userId: string): Promise<Todo[]> => {
  return await prisma.todo.findMany({
    where: {
      userId,
    },
  });
};

const updateTodo = async (
  id: string,
  data: Pick<Todo, "title" | "description" | "dueDate" | "status">
): Promise<Todo> => {
  return await prisma.todo.update({
    where: {
      id,
    },
    data,
  });
};

const updateManyTodos = async (
  todos: (Partial<Todo> & { id: string })[]
): Promise<Todo[]> => {
  await prisma.todo.updateMany({
    data: {
      nextTodoId: null,
    },
  });
  return await prisma.$transaction(
    todos.map((todo) => {
      return prisma.todo.update({
        where: {
          id: todo.id,
        },
        data: todo,
      });
    })
  );
};

const deleteTodo = async (id: string): Promise<Todo> => {
  return await prisma.todo.delete({
    where: {
      id,
    },
  });
};

const TodoController = {
  createTodo,
  getTodos,
  updateTodo,
  updateManyTodos,
  deleteTodo,
};

export default TodoController;
