import {
  Box,
  Button,
  Container,
  Flex,
  Popover,
  Select,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import * as chrono from "chrono-node";
import { CalendarIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { formatDate } from "../utils/date-format";
import Datetime from "react-datetime";
import DateTimePicker from "./DateTimePicker";
import { useTodos } from "../store/TodoContext";
import toast from "react-hot-toast";

type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";

const CreateTodo: React.FC = () => {
  const [status, setStatus] = useState<TodoStatus>("TODO");
  const [addingTodo, setAddingTodo] = useState(false);
  const { addTodo } = useTodos();

  const [todoName, setTodoName] = useState("");
  const [todoNameHtml, setTodoNameHtml] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (contentEditableRef.current) {
      const text = contentEditableRef.current.innerText;
      setTodoName(text);
      setTodoNameHtml(text);
    }
  };

  const highlightDates = useCallback(
    (dateText: string) => {
      const highlighted = `<span style="background-color: #ff706e; color: white;">${dateText}</span>`;

      const highlightedText = todoName.replace(dateText, highlighted);

      return highlightedText;
    },
    [todoName]
  );

  const handleAddTodo = async () => {
    setTodoName("");
    setTodoNameHtml("");
    setDescription("");
    setDueDate(null);
    setAddingTodo(true);
    
    const toastId = toast.loading("Adding todo...");

    let newTitle = todoName;
    const results = chrono.parse(todoName);
    const result = results[0];

    if (result) {
      const timeResult = chrono.parse(todoName);
      newTitle = todoName.replace(timeResult[0].text, "").trim();
    }

    try {
      await addTodo({
        title: newTitle,
        description,
        status,
        dueDate: dueDate || undefined,
      });
      toast.success("Todo added successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to add todo", { id: toastId });
    }

    setAddingTodo(false);

  };

  useEffect(() => {
    const results = chrono.parse(todoName);
    const result = results[0];

    if (result) {
      const refDate = result.refDate;
      const text = result.text;

      const date = chrono.parseDate(text, refDate);

      const tags = result.start.tags();

      // handling casual times unhandled by chrono
      if (tags.has("casualReference/morning")) {
        date?.setHours(9, 0, 0, 0);
      } else if (tags.has("casualReference/evening")) {
        date?.setHours(19, 0, 0, 0);
      } else if (
        !result.start.isCertain("hour") &&
        !result.start.isCertain("minute")
      ) {
        // Set the time to end of day if uncertain
        date?.setHours(23, 59, 59, 999);
      }

      setDueDate(date);
      setTodoNameHtml(highlightDates(text));
    }
  }, [todoName, highlightDates]);

  return (
    <Container p="0.75rem" id="create-todo-container">
      <Box
        style={{
          height: "21px",
          marginBottom: "6px",
          fontSize: "14px",
          position: "relative",
        }}
      >
        {!todoName && (
          <Text
            size="4"
            style={{ opacity: 0.55, position: "absolute", zIndex: -10, }}
            className="select-none"
          >
            Todo name
          </Text>
        )}
        <Text
          style={{
            zIndex: 10,
            position: "relative",
            width: "100%",
            height: "100%",
            outline: "none",
            color: "transparent",
            caretColor: "black",
          }}
          size="4"
          contentEditable
          onInput={handleInput}
          suppressContentEditableWarning={true}
          ref={contentEditableRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.innerHTML = ""
              handleAddTodo();
            }
          }}
          asChild
          className="select-none"
        >
          <p></p>
        </Text>
        <Text
          style={{
            zIndex: 9,
            position: "absolute",
            width: "100%",
            height: "100%",
            outline: "none",
            top: 0,
          }}
          
          size="4"
          dangerouslySetInnerHTML={{ __html: todoNameHtml }}
          asChild
        >
          <p></p>
        </Text>
      </Box>

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="description"
        style={{ display: "block", fontSize: "16px", marginTop: "0.5rem" }}
      />

      <Flex align="center" justify="between" mt="1rem">
        <Flex gapX="0.5rem">
          <Popover.Root>
            <Popover.Trigger>
              <Button
                variant="soft"
                style={{ cursor: "pointer" }}
                color="green"
              >
                <CalendarIcon width="16" height="16" />
                {dueDate ? formatDate(dueDate) : "today"}
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <div>
                <DateTimePicker
                  date={dueDate || new Date()}
                  setDate={(date) => setDueDate(date)}
                />
              </div>
            </Popover.Content>
          </Popover.Root>
          <Select.Root
            value={status}
            onValueChange={(e) => setStatus(e as TodoStatus)}
          >
            <Select.Trigger
              color={
                status === "TODO"
                  ? "red"
                  : status === "IN_PROGRESS"
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
        <Flex>
          <Button color="red" className="w-24 md:w-32" onClick={handleAddTodo}>
            {addingTodo ? <Spinner /> : "Add Todo"}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default CreateTodo;
