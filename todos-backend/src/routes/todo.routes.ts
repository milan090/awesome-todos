import { Router } from "express";

import protectedRouter from "../utils/authorize";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  reorderTodos,
  updateTodo,
} from "../controllers/todo.controller";
import validateSchema from "../utils/validateSchema";
import {
  createTodoSchema,
  reorderTodosSchema,
  updateTodoSchema,
} from "../controllers/todo.schema";

const router = Router();

router.use(protectedRouter);

router.get("/", getAllTodos);
router.post("/create", validateSchema(createTodoSchema), createTodo);
router.put("/update/:id", validateSchema(updateTodoSchema), updateTodo);
router.put("/reorder", validateSchema(reorderTodosSchema), reorderTodos);
router.delete("/delete/:id", deleteTodo);

export default router;