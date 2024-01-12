import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ActionIcon, Card, Checkbox, Group, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import styles from "./Todo.module.css";
import { useState } from "react";

// When User presses the delete button, the following will happen:
// 1. The remove function is called with the todo id
// 2. The remove function will make a DELETE request to the backend
// 3. The backend will remove the todo from the database
// 4. The backend will return a 204 response
// 5. The frontend will remove the todo from the list of todos in our Zustand store

// When User presses the checkbox, the following will happen:
// 1. The toggle function is called with the todo id
// 2. The toggle function will make a PUT request to the backend
// 3. The backend will update the todo in the database
// 4. The backend will return a 200 response
// 5. The frontend will update the todo in the list of todos in our Zustand store

// When User edits the todo text, the following will happen:
// 1. The edit function is called with the todo id and the new todo text
// 2. The edit function will make a PUT request to the backend
// 3. The backend will update the todo in the database
// 4. The backend will return a 200 response
// 5. The frontend will update the todo in the list of todos in our Zustand store

const Todo = ({ todo }) => {
  const { getToken } = useKindeAuth();

  const [isDeleting, setIsDeleting] = useState(false);

  const [todoText, setTodoText] = useState(todo.text);
  const [todoCompleted, setTodoCompleted] = useState(todo.completed);

  const editTodoText = async () => {};

  const toggleTodo = async () => {};

  const removeTodo = async () => {
    try {
      setIsDeleting(true);

      const token = await getToken();
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

      if (response.status === 204) {
        // Remove todo from Zustand store
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card key={todo._id}>
      <Group wrap="nowrap" justify="space-between">
        <Group wrap="nowrap">
          <Checkbox radius="xl" classNames={{ input: styles.input }} />
          <TextInput
            size="md"
            value={todoText}
            variant="unstyled"
            placeholder="Clean the house"
            onChange={(e) => setTodoText(e.target.value)}
          />
        </Group>
        <ActionIcon
          variant="light"
          aria-label="Delete"
          onClick={removeTodo}
          disabled={isDeleting}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default Todo;
