import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Text,
  Card,
  Group,
  Avatar,
  Burger,
  Button,
  AppShell,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChartBubble, IconLogout } from "@tabler/icons-react";

export default function LoggedIn() {
  const { user, logout } = useKindeAuth();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <IconChartBubble size={30} />
            <Text size="lg" fw="bold">
              Listify
            </Text>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow></AppShell.Section>
        <AppShell.Section>
          <Card>
            <Group mb="md">
              <Avatar radius="xl" src={user.picture} />
              <div>
                <Text>{user.given_name}</Text>
                <Text size="xs" c="dimmed">
                  {user.email}
                </Text>
              </div>
            </Group>
            <Button
              size="sm"
              variant="light"
              onClick={logout}
              rightSection={<IconLogout size={16} />}
            >
              Logout
            </Button>
          </Card>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
