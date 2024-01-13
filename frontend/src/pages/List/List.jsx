import { Button, Divider, Group, SimpleGrid, TextInput } from "@mantine/core";
import { useParams } from "react-router-dom";
import useListStore from "../../hooks/useListStore";
import Todo from "../../components/Todo/Todo";
import { useEffect, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const List = () => {
  // We are using the useParams hook to get the listId from the URL
  const { listId } = useParams();
  // We are using the useListStore hook to get the lists from the store
  const lists = useListStore((state) => state.lists);
  // We are using the find method to find the list with the same id as the one in the URL
  const list = lists.find((list) => list._id === listId);

  const { getToken } = useKindeAuth();

  const editList = useListStore((state) => state.editList);
  const deleteList = useListStore((state) => state.deleteList);

  const [listName, setListName] = useState(list.name);
  useEffect(() => setListName(list.name), [list.name]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async () => {
    try {
      setIsEditing(true);

      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${list._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: listName }),
        },
      );
      if (response.ok) {
        const editedList = await response.json();
        editList(list._id, editedList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${list._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        deleteList(list._id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const todos = list.todos;
  // We are using the map method to render all the todos in the list
  return (
    <>
      <Group justify="space-between">
        <TextInput
          size="xl"
          variant="unstyled"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="List name"
          aria-label="List name"
          onBlur={handleEdit}
          disabled={isEditing}
        />
        <Button
          size="xs"
          variant="light"
          onClick={handleDelete}
          disabled={isDeleting}
          loading={isDeleting}
        >
          Delete list
        </Button>
      </Group>
      <Divider mb="md" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {todos.map((todo) => (
          <Todo key={todo._id} todo={todo} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default List;
