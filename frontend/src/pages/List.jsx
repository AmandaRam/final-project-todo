import { Card, Checkbox, Group, SimpleGrid, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import useListStore from "../hooks/useListStore";

const List = () => {
  // We are using the useParams hook to get the listId from the URL
  const { listId } = useParams();
  // We are using the useListStore hook to get the lists from the store
  const lists = useListStore((state) => state.lists);
  // We are using the find method to find the list with the same id as the one in the URL
  const list = lists.find((list) => list._id === listId);

  const todos = list.todos;
  // We are using the map method to render all the todos in the list
  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
        {todos.map((todo) => (
          <Card key={todo._id}>
            <Group>
              <Checkbox radius="xl" />
              <Text>{todo.text}</Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};

export default List;
