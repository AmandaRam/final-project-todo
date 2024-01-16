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
          <Card shadow="md" w="300px">
            <Title order={3}>Listify</Title>
            <Text mb="md">Welcome! Please login or register to continue.</Text>
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
