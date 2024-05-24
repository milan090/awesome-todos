import axios from "axios";
import { User } from "../types/auth.types";
import {
  CreateTodoInput,
  ITodo,
  TodoRes,
  UpdateTodoInput,
} from "../types/todo.types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// Auth

export const getUser = async (): Promise<User> => {
  const res = await api.get("/auth/user");
  return res.data;
};

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const logout = () => {
  return api.post("/auth/logout");
};

// Todo
export const getAllTodos = async (): Promise<ITodo[]> => {
  const res = await api.get("/todo");
  const data = res.data as TodoRes[];
  // convert date strings to Date objects
  return data.map(convertTodoResToITodo);
};

export const createTodo = async (todo: CreateTodoInput): Promise<ITodo> => {
  const res = await api.post("/todo/create", todo);
  const data = res.data as TodoRes;
  return convertTodoResToITodo(data);
};

export const updateTodo = async (todo: UpdateTodoInput): Promise<ITodo> => {
  const { id, ...input } = todo;
  const res = await api.put(`/todo/update/${id}`, input);
  const data = res.data as TodoRes;
  return convertTodoResToITodo(data);
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todo/delete/${id}`);
};

export const reorderTodos = async (todos: string[]): Promise<void> => {
  await api.put("/todo/reorder", { todos });
};

const convertTodoResToITodo = (todo: TodoRes): ITodo => ({
  ...todo,
  dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
  createdAt: new Date(todo.createdAt),
});

export default api;
