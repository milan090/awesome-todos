import { z } from "zod";
import { reorderTodosSchema } from "../controllers/todo.schema";

export type ReorderTodos = z.infer<typeof reorderTodosSchema>;
