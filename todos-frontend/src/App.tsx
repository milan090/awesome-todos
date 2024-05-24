import "./App.css";
import { Container } from "@radix-ui/themes";
import Navbar from "./components/Navbar";
import CreateTodo from "./components/CreateTodo";
import AuthModal from "./components/AuthModal";
import TodoList from "./components/TodoList";

function App() {

  

  return (
    <main>
      <Navbar />
      <AuthModal />
      <Container size="2" mt="3rem" px="1rem">
        <CreateTodo />

      <TodoList />
      </Container>
    </main>
  );
}

export default App;
