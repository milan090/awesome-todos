import { Request, Response } from "express";
import TodoController from "../models/todo.models";
import { createTodoSchema } from "./todo.schema";
import { ReorderTodos } from "../types/todo.types";

export const getAllTodos = async (req: Request, res: Response) => {
  const todos = await TodoController.getTodos(req.session.userId!);
  return res.status(200).json(todos);
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, description, dueDate, status } = req.body;

  const todo = await TodoController.createTodo(req.session.userId!, {
    title,
    description,
    dueDate,
    status,
  });
  return res.status(201).json(todo);
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;

  const todo = await TodoController.updateTodo(id, {
    title,
    description,
    dueDate,
    status,
  });
  return res.status(200).json(todo);
};

export const reorderTodos = async (req: Request, res: Response) => {
  const { todos } = req.body as ReorderTodos;
  const updatedTodos = await TodoController.updateManyTodos(
    todos.map((id, i) => ({
      id,
      nextTodoId: i === todos.length - 1 ? null : todos[i + 1],
    }))
  );
  return res.status(200).json(updatedTodos);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await TodoController.deleteTodo(id);
  return res.status(200).json(todo);
};
