import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Card,
  Text,
  Title,
  Group,
  Button,
  Center,
  AppShell,
} from "@mantine/core";

export default function LoggedOut() {
  const { login, register } = useKindeAuth();
  return (
    <AppShell>
      <AppShell.Main>
        <Center h="100vh">
          <Card w="300px">
            <Title order={3}>Listify</Title>
            <Text mb="md">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
              voluptatum, voluptatibus, quisquam, quos voluptas quia
              exercitationem quibusdam eaque quod dolorum atque? Quisquam
              voluptatum, voluptatibus, quisquam, quos voluptas quia
              exercitationem quibusdam eaque quod dolorum atque?
            </Text>
            <Group grow>
              <Button onClick={login}>Login</Button>
              <Button variant="light" onClick={register}>
                Register
              </Button>
            </Group>
          </Card>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}
