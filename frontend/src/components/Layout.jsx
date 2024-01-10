import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Text,
  Card,
  Group,
  Avatar,
  Burger,
  Button,
  NavLink,
  Divider,
  AppShell,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconList,
  IconPlus,
  IconLogout,
  IconChartBubble,
} from "@tabler/icons-react";
import useListStore from "../hooks/useListStore";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const { user, logout } = useKindeAuth();
  const [opened, { toggle }] = useDisclosure();

  const lists = useListStore((state) => state.lists);

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
        <AppShell.Section grow>
          {lists.map((list) => (
            <NavLink
              to={`/lists/${list._id}`}
              component={Link}
              label={list.name}
              key={list._id}
              leftSection={<IconList size={16} />}
            />
          ))}
          <Divider my="md" />
          <NavLink
            href=""
            active
            label="Add new list"
            leftSection={<IconPlus size={16} />}
          />
        </AppShell.Section>
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
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
