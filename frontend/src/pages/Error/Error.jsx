import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Alert, Button, Center, AppShell, Group } from "@mantine/core";

const Error = () => {
  const { logout } = useKindeAuth();
  return (
    <AppShell>
      <AppShell.Main>
        <Center h="100vh">
          <div>
            <Alert w="300px" mb="md" title="An unexpected error occurred">
              We are sorry, but an unexpected error occurred. Please try
              navigating back to the home page, and if the problem persists,
              please contact us.
            </Alert>
            <Center>
              <Group>
                <Button variant="light" onClick={logout}>
                  Logout
                </Button>
              </Group>
            </Center>
          </div>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
};

export default Error;
