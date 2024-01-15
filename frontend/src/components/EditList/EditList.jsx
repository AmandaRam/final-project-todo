import { Button, Divider, Group, SimpleGrid, TextInput } from "@mantine/core";
import useListStore from "../../hooks/useListStore";
import Todo from "../../components/Todo/Todo";
import { useEffect, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import AddTodo from "../AddTodo/AddTodo";
import { notifications } from "@mantine/notifications";

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
        <Button
          size="xs"
          variant="light"
          color="red"
          onClick={handleDelete}
          disabled={isDeleting}
          loading={isDeleting}
        >
          Delete list
        </Button>
      </Group>
      <Divider mb="md" />
      <AddTodo listId={list._id} />
      <SimpleGrid mt="md" cols={{ base: 1, sm: 2, lg: 3 }}>
        {list.todos.map((todo) => (
          <Todo key={todo._id} todo={todo} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default EditList;
