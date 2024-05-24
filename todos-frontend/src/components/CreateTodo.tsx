import {
  Box,
  Button,
  Container,
  Flex,
  Popover,
  Select,
  Text,
} from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import * as chrono from "chrono-node";
import { CalendarIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { formatDate } from "../utils/date-format";
import Datetime from "react-datetime";
import DateTimePicker from "./DateTimePicker";

type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";

const CreateTodo: React.FC = () => {
  const [status, setStatus] = useState<TodoStatus>("TODO");

  const [taskName, setTaskName] = useState("");
  const [taskNameHtml, setTaskNameHtml] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (contentEditableRef.current) {
      const text = contentEditableRef.current.innerText;
      setTaskName(text);
      setTaskNameHtml(text);
    }
  };

  const highlightDates = useCallback(
    (dateText: string) => {
      const highlighted = `<span style="background-color: #ff706e; color: white;">${dateText}</span>`;

      const highlightedText = taskName.replace(dateText, highlighted);

      return highlightedText;
    },
    [taskName]
  );

  useEffect(() => {
    const results = chrono.parse(taskName);
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
      setTaskNameHtml(highlightDates(text));
    }
  }, [taskName, highlightDates]);

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
        {!taskName && (
          <Text
            size="4"
            style={{ opacity: 0.55, position: "absolute", zIndex: -10 }}
          >
            Task name
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
          asChild
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
          dangerouslySetInnerHTML={{ __html: taskNameHtml }}
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
          <Button color="red">
            Add Todo
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default CreateTodo;
