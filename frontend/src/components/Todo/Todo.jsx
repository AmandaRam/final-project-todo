import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ActionIcon, Card, Checkbox, Group, TextInput } from "@mantine/core";
import useListStore from "../../hooks/useListStore";
import styles from "./Todo.module.css";

const Todo = ({ todo }) => {
  const { getToken } = useKindeAuth();
  // We are using the useListStore hook to get the editTodo and removeTodo functions from the Zustand store
  const editTodo = useListStore((state) => state.editTodo);
  const deleteTodo = useListStore((state) => state.deleteTodo);

  // We are using useState to tell that we are making an API call to the backend after editing or deleting a todo
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Copy of the text and completed state of the todo. We make a copy of these fields so that we can edit them without changing the original todo until after the API call is successful
  const [todoText, setTodoText] = useState(todo.text);
  const [todoCompleted, setTodoCompleted] = useState(todo.completed);

  // When User edits the todo text, the following will happen:
  const handleEdit = async (text, completed) => {
    try {
      setIsEditing(true);

      // We are getting the token from the Kinde Auth React hook
      const token = await getToken();
      // We are making a PUT request to the backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/todos/${todo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, completed }),
        },
      );

      // If the response is ok, then we will update the todo in our Zustand store
      if (response.ok) {
        const editedTodo = await response.json();
        editTodo(todo._id, editedTodo);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);

      // If the API call fails, then we will reset the todo text and completed state to the original values
      setTodoText(todo.text);
      setTodoCompleted(todo.completed);

      notifications.show({
        title: "Error!",
        color: "red",
        message: "Could not edit todo ... 🤥",
      });
    } finally {
      setIsEditing(false);
    }
  };

  // When user presses the delete button, the following will happen:
  // API call to backend to delete the todo
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // We are getting the token from the Kinde Auth React hook
      const token = await getToken();
      // We are making a DELETE request to the backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/todos/${todo._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // If the response is ok, then we will delete the todo from our Zustand store
      if (response.ok) {
        deleteTodo(todo._id);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        color: "red",
        message: "Could not delete todo ... 🤥",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card key={todo._id} shadow="md">
      <Group wrap="nowrap" justify="space-between">
        <Group wrap="nowrap">
          <Checkbox
            radius="xl"
            disabled={isEditing}
            checked={todoCompleted}
            onChange={(e) => {
              setTodoCompleted(e.target.checked);
              handleEdit(todoText, e.target.checked);
            }}
            classNames={{ input: styles.input }}
          />
          <TextInput
            td={todoCompleted ? "line-through" : "none"}
            size="md"
            value={todoText}
            disabled={isEditing}
            variant="unstyled"
            placeholder="Clean the house"
            onChange={(e) => setTodoText(e.target.value)}
            onBlur={() => handleEdit(todoText, todoCompleted)}
          />
        </Group>
        <ActionIcon
          variant="light"
          aria-label="Delete"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default Todo;
