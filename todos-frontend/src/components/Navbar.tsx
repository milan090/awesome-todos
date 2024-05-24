import { Flex, Text, Button, Container, Section } from "@radix-ui/themes";

const Navbar: React.FC = () => {
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
          <Button variant="outline" color="red">
            Logout
          </Button>
        </Flex>
      </Container>
    </Section>
  );
};

export default Navbar;
