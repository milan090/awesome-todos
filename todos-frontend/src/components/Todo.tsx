import {
  CalendarIcon,
  CheckCircledIcon,
  CircleIcon,
  Cross2Icon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import {
  Box,
  Text,
  Button,
  Flex,
  Dialog,
  Container,
  Popover,
  Select,
} from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { formatDate } from "../utils/date-format";
import { useState } from "react";
import "../App.css";
import { ITodo, TodoStatus } from "../types/todo.types";
import { useTodos } from "../store/TodoContext";
import toast from "react-hot-toast";
import DateTimePicker from "./DateTimePicker";

interface TodoProps {
  todo: ITodo;
}

const Todo: React.FC<TodoProps> = ({ todo }) => {
  const { updateTodo, deleteTodo } = useTodos();
  const [showFullTodo, setShowFullTodo] = useState(false);

  const handleToggleStatus = async () => {
    await updateTodo({
      ...todo,
      status: todo.status === "DONE" ? "TODO" : "DONE",
    });
  };

  const handleDeleteTodo = async () => {
    const toastId = toast.loading("Deleting todo...");
    await deleteTodo(todo.id);
    toast.success("Todo deleted successfully", { id: toastId });
  };

  return (
    <>
     <Dialog.Root open={showFullTodo} onOpenChange={(v) => setShowFullTodo(v)}>
        <Dialog.Content className="max-w-[450px]">
          <Dialog.Title>
            {todo.title}
          </Dialog.Title>
          <Dialog.Description>
            {todo.description || "No description"}
          </Dialog.Description>
          <Dialog.Close>
            <Cross2Icon width="20" height="20" className="cursor-pointer absolute top-6 right-6" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    <Box className="todo"
      onClick={() => setShowFullTodo(true)}
    >
      <Flex justify="between" pb={todo.dueDate ? "0" : "0.5rem"}>
        <Flex gapX="0.5rem">
          <DragHandleDots2Icon className="hidden md:block todo-drag-handler" />
          <span style={{ marginTop: "0.3rem" }} onClick={handleToggleStatus}>
            {todo.status === "DONE" ? (
              <CheckCircledIcon
                width={20}
                height={20}
                style={{ color: "#0070f3" }}
              />
            ) : (
              <CircleIcon width={20} height={20} style={{ color: "#0070f3" }} />
            )}
          </span>
          <Flex gapX="0.75rem">
          <Text size="3" weight="medium">
            {todo.title}
          </Text>
          {/* status */}
          <Text
            size="2"
            style={{
              display: "flex",
              columnGap: "0.25rem",
              alignItems: "center",
              fontSize: "0.75rem",
            }}
          >
            {todo.status === "TODO" ? (
              <span className="bg-orange-400 rounded-lg px-2 text-black">Todo</span>
            ) : todo.status === "IN_PROGRESS" ? (
              <span className="bg-yellow-500/60 text-black px-2 rounded-lg">In Progress</span>
            ) : (
              <span className="bg-green-400 px-2 text-black rounded-lg">Done</span>
            )}
          </Text>
          </Flex>
        </Flex>
        <Flex gapX="1rem">
          <Button
            variant="ghost"
            className="text-red-400"
            onClick={handleDeleteTodo}
          >
            Delete
          </Button>
          <EditTodo todo={todo} />
        </Flex>
      </Flex>
      {todo.dueDate && (
        <Text
          size="2"
          style={{
            display: "flex",
            columnGap: "0.25rem",
            alignItems: "center",
          }}
          ml="1.75rem"
        >
          <CalendarIcon width={14} />
          Due: {formatDistanceToNow(todo.dueDate, { addSuffix: true })}
        </Text>
      )}
     
    </Box>
    </>
  );
};

interface TodoProps {
  todo: ITodo;
}

const EditTodo: React.FC<TodoProps> = ({ todo }) => {
  const { updateTodo } = useTodos();
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newStatus, setStatus] = useState<TodoStatus>(todo.status);
  const [newDescription, setNewDescription] = useState(todo.description);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate);

  const handleAddNewDueDate = () => {
    setNewDueDate(new Date());
  };

  const handleSave = async () => {
    const toastId = toast.loading("Saving todo...");
    try {
      const updatedTodo = await updateTodo({
        ...todo,
        title: newTitle,
        status: newStatus,
        description: newDescription,
        dueDate: newDueDate,
      });
      toast.success("Todo saved successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to save todo", { id: toastId });
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" className="cursor-pointer text-[#0070f3]">
          Edit
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="3" maxWidth="450px">
        <Dialog.Title>Edit Todo</Dialog.Title>
        <Dialog.Close>
          <Cross2Icon width="20" height="20" className="cursor-pointer absolute top-6 right-6" />
        </Dialog.Close>

        <Container size="1">
          <Box mb="2rem">
            <input
              type="text"
              id="title"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input border-b border-b-gray-400 w-full bg--100 pt-2 pb-1 mb-2"
            />
            <input
              type="text"
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              className="input border-b border-b-gray-400 w-full bg--100 pt-2 pb-1"
            />
          </Box>
          <Flex justify="between" align="center">
            <Flex gap="1rem" align="center">
              {newDueDate ? (
                <Popover.Root>
                  <Popover.Trigger>
                    <Button
                      variant="soft"
                      style={{ cursor: "pointer" }}
                      color="green"
                    >
                      <CalendarIcon width="16" height="16" />
                      {newDueDate ? formatDate(newDueDate) : "today"}
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content>
                    <div>
                      <DateTimePicker
                        date={newDueDate}
                        setDate={(date) => setNewDueDate(date)}
                      />
                    </div>
                  </Popover.Content>
                </Popover.Root>
              ) : (
                <Button onClick={handleAddNewDueDate}>Add Due Date</Button>
              )}
              <Select.Root
                value={newStatus}
                onValueChange={(e) => setStatus(e as TodoStatus)}
              >
                <Select.Trigger
                  color={
                    newStatus === "TODO"
                      ? "red"
                      : newStatus === "IN_PROGRESS"
                      ? "yellow"
                      : "green"
                  }
                  style={{ cursor: "pointer" }}
                  variant="soft"
                />
                <Select.Content position="popper" color="blue">
                  <Select.Item value="TODO" className="pointer">
                    Todo
                  </Select.Item>
                  <Select.Item value="IN_PROGRESS" className="pointer">
                    In Progress
                  </Select.Item>
                  <Select.Item value="DONE" className="pointer">
                    Done
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            <Button color="blue" onClick={handleSave}>
              Save
            </Button>
          </Flex>
        </Container>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Todo;
