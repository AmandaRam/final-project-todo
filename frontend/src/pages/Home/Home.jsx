import { Button, Card, Group, Text, Title } from "@mantine/core";
import useListStore from "../../hooks/useListStore";
import { Link } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";

const Home = () => {
  const lists = useListStore((state) => state.lists);
  return (
    <>
      <Title mb="md">Welcome to Listify!</Title>
      {/* If the user doesn´t have any lists we will display below message */}
      {lists.length === 0 && (
        <Card shadow="md">
          <Text>
            You don&apos;t have any lists yet. Create one by clicking on the
            &quot;Add list&quot; button in the sidebar.
          </Text>
        </Card>
      )}
      {/* If the user have lists we will display them */}
      {lists.length > 0 &&
        lists.map((list) => (
          <Card key={list._id} mb="md" shadow="md">
            <Group justify="space-between">
              <Text>{list.name}</Text>
              <Button
                variant="light"
                component={Link}
                to={`/lists/${list._id}`}
                rightSection={<IconChevronRight size={16} />}
              >
                View list
              </Button>
            </Group>
          </Card>
        ))}
    </>
  );
};

export default Home;
