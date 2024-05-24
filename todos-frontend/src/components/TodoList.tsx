import { Reorder } from "framer-motion";
import Todo from "./Todo";
import { useTodos } from "../store/TodoContext";
import { ITodo, TodoStatus } from "../types/todo.types";
import { useState } from "react";
import { Box } from "@radix-ui/themes";
import * as ToggleGroup from "@radix-ui/react-toggle-group";



const TodoList: React.FC = () => {
  const [filterType, setFilterType] = useState<TodoStatus | "ALL">("ALL");
  const { todos, setTodos, reorderTodos } = useTodos();

  const handleReorder = async (newTodos: ITodo[]) => {
    await reorderTodos(newTodos.map((todo) => todo.id));
    setTodos(newTodos);
  };

  return (
    <Box className="mt-6">
      <ToggleGroup.Root
        className="inline-flex rounded gap-x-2 shadow-blackA4 space-x-px"
        type="single"
        value={filterType}
        onValueChange={(value) =>
          setFilterType((v) => (value ? (value as TodoStatus | "ALL") : v))
        }
        aria-label="Text alignment"
      >
        <ToggleGroup.Item
          className={"px-3 py-1 rounded-md data-[state=on]:bg-blue-300 border"}
          value="ALL"
          aria-label="All"
        >
          All
        </ToggleGroup.Item>
        <ToggleGroup.Item
          className={"px-3 py-1 rounded-md data-[state=on]:bg-orange-300 border"}
          value="TODO"
          aria-label="Todo"
        >
          Todo
        </ToggleGroup.Item>
        <ToggleGroup.Item
          className={"px-3 py-1 rounded-md data-[state=on]:bg-green-500/50 border"}
          value="IN_PROGRESS"
          aria-label="In Progress"
        >
          In Progress
        </ToggleGroup.Item>

        <ToggleGroup.Item
          className={"px-3 py-1 rounded-md data-[state=on]:bg-red-600/50 border"}
          value="DONE"
          aria-label="Done"
        >
          Done
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={handleReorder}
        className="mt-6 gap-y-2 flex flex-col"
      >
        {todos.filter(t => filterType === "ALL" ? true : filterType === t.status).map((todo) => (
          <Reorder.Item key={todo.id} value={todo}>
            <Todo todo={todo} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Box>
  );
};

export default TodoList;
