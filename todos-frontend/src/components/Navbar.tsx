import { Flex, Text, Button, Container, Section } from "@radix-ui/themes";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

const Navbar: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  }

  return (
    <Section
      style={{
        padding: 20,
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,.1)",
      }}
    >
      <Container size="3">
        <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontWeight: 700 }}>Todos</Text>
          <Button variant="outline" color="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Container>
    </Section>
  );
};

export default Navbar;
