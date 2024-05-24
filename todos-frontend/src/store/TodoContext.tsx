import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CreateTodoInput,
  ITodo as Todo,
  UpdateTodoInput,
} from "../types/todo.types";
import { useAuth } from "./AuthContext";
import * as api from "../utils/api";
import toast from "react-hot-toast";

// Define the types for todos and context

interface TodoContextProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: CreateTodoInput) => Promise<void>;
  updateTodo: (updatedTodo: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (todos: string[]) => Promise<void>;
}

const TodoContext = createContext<TodoContextProps>({
  todos: [],
  setTodos: () => {},
  addTodo: async () => {},
  updateTodo: async () => {},
  deleteTodo: async () => {},
  reorderTodos: async () => {},
});

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [todosLoaded, setTodosLoaded] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = async (input: CreateTodoInput) => {
    const todo = await api.createTodo({
      ...input,
    });
    setTodos([...todos, todo]);
  };

  const updateTodo = async (input: UpdateTodoInput) => {
    const updatedTodo = await api.updateTodo(input);
    setTodos((todos) =>
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const deleteTodo = async (id: string) => {
    await api.deleteTodo(id);
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const reorderTodos = async (todos: string[]) => {
    await api.reorderTodos(todos);
  };

  useEffect(() => {
    if (!user) {
      setTodos([]);
    } else if (!loadingTodos && !todosLoaded) {
      setLoadingTodos(true);
      const toastId = toast.loading("Loading todos...");
      api
        .getAllTodos()
        .then((todos) => {
          // sort todos by nextTodoId (string) like a linked list
          const todoIds = todos.map((todo) => todo.id);
          const nextIds = todos.map((todo) => todo.nextTodoId);
          const parentTodoId = todos.find((todo) => !nextIds.includes(todo.id))?.id;
          const sortedTodos: Todo[] = [];
          
          let nextTodoId: string | undefined = parentTodoId;
          while (nextTodoId) {
            const todoIndex = todoIds.indexOf(nextTodoId);
            sortedTodos.push(todos[todoIndex]);
            nextTodoId = nextIds[todoIndex] || undefined;
          }

          console.log(todoIds, sortedTodos.map(todo => todo.id));
          setTodos(sortedTodos);

          setLoadingTodos(false);
          toast.dismiss(toastId);
        })
        .catch(() => {
          toast.error("Failed to load todos", { id: toastId });
          setLoadingTodos(false);
        })
        .finally(() => {
          setLoadingTodos(false);
          setTodosLoaded(true);
        });
    }
  }, [user, loadingTodos, todos.length, todosLoaded]);

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, updateTodo, deleteTodo, setTodos, reorderTodos }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);

export { TodoContext, TodoProvider };
