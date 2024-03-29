import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Text,
  Group,
  Divider,
  Accordion,
  TextInput,
  ActionIcon,
  SimpleGrid,
} from "@mantine/core";
import Todo from "../../components/Todo/Todo";
import AddTodo from "../AddTodo/AddTodo";
import useListStore from "../../hooks/useListStore";

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
    if (listName === list.name) return;

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

  // When the user presses the delete button, we will show a confirm modal
  const confirmDelete = () =>
    modals.openConfirmModal({
      title: "Delete your list",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your list? This action cannot be
          reversed.
        </Text>
      ),
      labels: { confirm: "Delete list", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onConfirm: handleDelete,
    });

  // Sort todos by createdAt
  const sortedTodos = [...list.todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <>
      <Group justify="space-between">
        <TextInput
          autoFocus
          size="lg"
          variant="unstyled"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="List name"
          aria-label="List name"
          onBlur={handleEdit}
          disabled={isEditing}
        />
        <ActionIcon
          size="lg"
          color="red"
          variant="light"
          loading={isDeleting}
          disabled={isDeleting}
          onClick={confirmDelete}
          aria-label="Delete list"
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Divider mb="md" />
      <AddTodo listId={list._id} />
      {/* If there are no todos we will display below text */}
      {sortedTodos.filter((todo) => !todo.completed).length === 0 && (
        <Text c="dimmed" mt="md">
          You have no active todos, HURRAY!
        </Text>
      )}
      <SimpleGrid my="md" cols={{ base: 1, sm: 2, lg: 3 }}>
        {sortedTodos
          // Filter out completed todos
          .filter((todo) => !todo.completed)
          .map((todo) => (
            <Todo key={todo._id} todo={todo} />
          ))}
      </SimpleGrid>
      {/* Show the completed tab only if there are completed todos */}
      {sortedTodos.filter((todo) => todo.completed).length > 0 && (
        <Accordion
          mb="md"
          variant="transparent"
          styles={{ content: { padding: 0 } }}
        >
          <Accordion.Item value="completed">
            <Accordion.Control>Show completed</Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid mt="md" cols={{ base: 1, sm: 2, lg: 3 }}>
                {sortedTodos
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
