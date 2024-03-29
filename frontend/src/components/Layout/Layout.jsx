import { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Text,
  Card,
  Group,
  Avatar,
  Burger,
  Button,
  Divider,
  NavLink,
  AppShell,
  Indicator,
  ThemeIcon,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSun,
  IconMoon,
  IconPlus,
  IconList,
  IconLogout,
  IconHeartCheck,
} from "@tabler/icons-react";
import useListStore from "../../hooks/useListStore";
import { notifications } from "@mantine/notifications";

const Layout = () => {
  const { user, logout, getToken } = useKindeAuth();
  const [opened, { toggle, close }] = useDisclosure();

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  // We are using the useNavigate hook to navigate to the list page after creating a new list
  const navigate = useNavigate();
  const location = useLocation();

  // We are using the useListStore hook to get the lists and addList function from the Zustand store
  const lists = useListStore((state) => state.lists);
  const addList = useListStore((state) => state.addList);

  // We are using useState to tell that we are making an API call to the backend when adding a new list
  const [isAdding, setIsAdding] = useState(false);

  // When user presses the add new list button, the following will happen:
  const handleAddList = async () => {
    try {
      setIsAdding(true);

      // Get token from Kinde Auth React hook
      const token = await getToken();
      // Make a POST request to the backend to add a new list
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: "Untitled list" }),
      });

      if (response.ok) {
        // If the response is ok, then we will add the new list to our Zustand store and navigate to the list page
        const addedList = await response.json();
        addList(addedList);
        navigate(`/lists/${addedList._id}`);
        close();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        color: "red",
        message: "Could not add list ... 🤥",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // We are sorting the lists by createdAt date
  const sortedLists = [...lists].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <ThemeIcon variant="transparent">
              <IconHeartCheck size={25} stroke={1.5} />
            </ThemeIcon>
            <Text size="xl" to="/" component={Link}>
              Listify
            </Text>
          </Group>
          <Group>
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light",
                )
              }
              size="md"
              variant="transparent"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "light" && <IconMoon stroke={1.5} />}
              {computedColorScheme === "dark" && <IconSun stroke={1.5} />}
            </ActionIcon>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle menu"
            />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {sortedLists.length === 0 && (
            <Text size="sm" c="dimmed">
              Add your first list
            </Text>
          )}
          {sortedLists.map((list) => (
            <NavLink
              key={list._id}
              to={`/lists/${list._id}`}
              onClick={close}
              component={Link}
              label={list.name}
              leftSection={<IconList size={16} />}
              rightSection={
                <Indicator
                  // We are using the disabled prop to disable the indicator when the user is not on the list page
                  disabled={location.pathname !== `/lists/${list._id}`}
                />
              }
            />
          ))}
          <Divider my="md" />
          <NavLink
            active
            component={Button}
            onClick={handleAddList}
            loading={isAdding}
            disabled={isAdding}
            label="Add new list"
            leftSection={<IconPlus size={16} />}
          />
        </AppShell.Section>
        <AppShell.Section>
          <Card shadow="md">
            <Group mb="md">
              <Avatar
                alt="User profile picture"
                radius="xl"
                src={user.picture}
              />
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
};

export default Layout;
