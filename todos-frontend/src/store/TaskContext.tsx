import React, { createContext } from "react";
import { ITask as Task } from "../components/Task";

// Define the types for tasks and context

interface TaskContextProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
}

const TasksContext = createContext<TaskContextProps>({
  tasks: [],
  setTasks: () => {},
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
});

const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: "1",
      title: "Task 1",
      status: "TODO",
      dueDate: new Date(),
    },
    {
      id: "2",
      title: "Task 2",
      status: "IN_PROGRESS",
    },
    {
      id: "3",
      title: "Task 3",
      status: "DONE",
    },
  ]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
};

export { TasksContext, TasksProvider };
