import { z } from "zod";

const status = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000),
  dueDate: z.string().optional(),
  status,
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
  status: status.optional(),
});

export const reorderTodosSchema = z.object({
  todos: z.array(z.string()),
});
