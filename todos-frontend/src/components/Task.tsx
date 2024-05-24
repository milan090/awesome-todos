import {
  CalendarIcon,
  CheckCircledIcon,
  CircleBackslashIcon,
  CircleIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import { Box, Container, Text, Button, Flex } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import "../App.css";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

interface TaskProps {
  task: ITask;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box className="task">
      <Flex justify="between" pb={task.dueDate ? "0" : "0.5rem"}>
        <Flex gapX="0.5rem">
          <DragHandleDots2Icon className="task-drag-handler" />
          <span style={{ marginTop: "0.2rem" }}>
            {task.status === "DONE" ? (
              <CheckCircledIcon
                width={18}
                height={18}
                style={{ color: "#0070f3" }}
              />
            ) : (
              <CircleIcon width={18} height={18} style={{ color: "#0070f3" }} />
            )}
          </span>
          <Text size="3" weight="medium">
            {task.title}
          </Text>
        </Flex>
        <Button
          variant="ghost"
          onClick={() => setIsEditing(true)}
          style={{ color: "#0070f3" }}
        >
          Edit
        </Button>
      </Flex>
      {task.dueDate && (
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
          Due: {formatDistanceToNow(task.dueDate, { addSuffix: true })}
        </Text>
      )}
    </Box>
  );
};

export default Task;
