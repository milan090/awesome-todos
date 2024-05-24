export type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TodoRes {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  dueDate?: string;
  status: TodoStatus;
  nextTodoId?: string | null;
  userId: string;
}

export interface ITodo extends Omit<TodoRes, "createdAt" | "dueDate"> {
  createdAt: Date;
  dueDate?: Date;
}

export type CreateTodoInput = Pick<ITodo, "title" | "description" | "dueDate" | "status">;
export type UpdateTodoInput = Partial<CreateTodoInput> & { id: string };
