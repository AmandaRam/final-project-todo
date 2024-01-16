import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Accordion,
  ActionIcon,
  Text,
  Divider,
  Group,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import AddTodo from "../AddTodo/AddTodo";
import Todo from "../../components/Todo/Todo";
import useListStore from "../../hooks/useListStore";
import { IconTrash } from "@tabler/icons-react";

const EditList = ({ list }) => {
  const { getToken } = useKindeAuth();

  // We are using the useListStore hook to get the editList and deleteList functions from the Zustand store
  const editList = useListStore((state) => state.editList);
  const deleteList = useListStore((state) => state.deleteList);

  // We are using useState to keep track of the list name when we are editing it
  const [listName, setListName] = useState(list.name);
  useEffect(() => setListName(list.name), [list.name]);

  // We are using useState to tell that we are making an API call to the backend when editing or deleting a list
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // API call to backend to edit the list
  const handleEdit = async () => {
    try {
      setIsEditing(true);
      // We are getting the token from the Kinde Auth React hook
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${list._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: listName || "Untitled list" }),
        },
      );
      // If the response is ok, then we will update the list in our Zustand store
      if (response.ok) {
        const editedList = await response.json();
        editList(list._id, editedList);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        color: "red",
        message: "Could not edit list ... 🤥",
      });
    } finally {
      setIsEditing(false);
    }
  };

  // API call to backend to delete the list
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // We are getting the token from the Kinde Auth React hook
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
      // If the response is ok, then we will delete the list from our Zustand store
      if (response.ok) {
        deleteList(list._id);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        color: "red",
        message: "Could not delete list ... 🤥",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
        <ActionIcon
          mr="md"
          color="red"
          variant="light"
          loading={isDeleting}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Divider mb="md" />
      <AddTodo listId={list._id} />
      {/* If there are no todos we will display below text */}
      {list.todos.filter((todo) => !todo.completed).length === 0 && (
        <Text c="dimmed" mt="md">
          You have no active todos, HURRAY!
        </Text>
      )}
      <SimpleGrid my="md" cols={{ base: 1, sm: 2, lg: 3 }}>
        {list.todos
          // Filter out completed todos
          .filter((todo) => !todo.completed)
          .map((todo) => (
            <Todo key={todo._id} todo={todo} />
          ))}
      </SimpleGrid>
      {/* Show the completed tab only if there are completed todos */}
      {list.todos.filter((todo) => todo.completed).length > 0 && (
        <Accordion mb="md" styles={{ content: { padding: 0 } }}>
          <Accordion.Item value="completed">
            <Accordion.Control>Completed</Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid mt="md" cols={{ base: 1, sm: 2, lg: 3 }}>
                {list.todos
                  // Show completed todos
                  .filter((todo) => todo.completed)
                  .map((todo) => (
                    <Todo key={todo._id} todo={todo} />
                  ))}
              </SimpleGrid>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
};

export default EditList;
