import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Text,
  Card,
  Group,
  Avatar,
  Burger,
  Button,
  AppShell,
  LoadingOverlay,
  NavLink,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartBubble,
  IconList,
  IconLogout,
  IconPlus,
} from "@tabler/icons-react";
import useListStore from "../hooks/useListStore";
import { useEffect, useState } from "react";

export default function LoggedIn() {
  const { user, logout, getToken } = useKindeAuth();
  const [opened, { toggle }] = useDisclosure();

  // State for loading user data and lists
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const lists = useListStore((state) => state.lists);
  const setLists = useListStore((state) => state.setLists);

  // Load user data on mount
  useEffect(() => {
    const loadLists = async () => {
      try {
        // Getting our token from the Kinde
        const token = await getToken();
        // Fetching our lists from the backend using the Kinde token
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // If the response is not ok, force an error and catch it
        if (!response.ok) {
          throw new Error("Failed to load lists");
        }

        // Parse the response as JSON
        const data = await response.json();
        setLists(data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadLists();
  }, []);

  // If we're loading, show a loading overlay
  if (isLoading) {
    return (
      <LoadingOverlay visible zIndex={1000} loaderProps={{ type: "dots" }} />
    );
  }

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
              href=""
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
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
