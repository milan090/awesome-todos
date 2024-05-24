import { Container, Flex } from "@radix-ui/themes";
import "./App.css";
import Navbar from "./components/Navbar";
import CreateTodo from "./components/CreateTodo";
import { useContext } from "react";
import { TasksContext } from "./store/TaskContext";
import Task from "./components/Task";
import { Reorder } from "framer-motion";
import AuthModal from "./components/AuthModal";

function App() {
  const { tasks, setTasks } = useContext(TasksContext);

  return (
    <main>
      <Navbar />
      <AuthModal  />
      <Container size="2" mt="3rem">
        <CreateTodo />

        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={setTasks}
          style={{
            marginTop: "1.5rem",
            rowGap: "0.5rem",
            display: "flex",
            flexDirection: "column",
            listStyle: "none",
            paddingLeft: 0,
          }}
        >
          {tasks.map((task) => (
            <Reorder.Item key={task.id} value={task}>
              <Task task={task} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Container>
    </main>
  );
}

export default App;
