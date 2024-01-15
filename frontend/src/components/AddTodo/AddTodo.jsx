import { Card, TextInput, SimpleGrid, ActionIcon } from "@mantine/core";
import useListStore from "../../hooks/useListStore";
import { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { IconPlus } from "@tabler/icons-react";

// Component to add a new todo
const AddTodo = ({ listId }) => {
  const { getToken } = useKindeAuth();
  const [text, setText] = useState("");

  // We are using the useListStore hook to get the addTodo function from the Zustand store
  const addTodo = useListStore((state) => state.addTodo);

  // We are using useState to tell that we are making an API call to the backend when adding a new todo
  const [isAdding, setIsAdding] = useState(false);

  // API call to backend to add a new todo
  const handleAdd = async () => {
    try {
      setIsAdding(true);
      // We are getting the token from the Kinde Auth React hook
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/lists/${listId}/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
            completed: false,
          }),
        },
      );
      // If the response is ok, then we will add the todo in our Zustand store
      if (response.ok) {
        const addedTodo = await response.json();
        addTodo(listId, addedTodo);
        setText("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
      <Card>
        <TextInput
          size="md"
          value={text}
          placeholder="What needs to be done?"
          onChange={(e) => setText(e.target.value)}
          rightSection={
            <ActionIcon
              variant="light"
              disabled={isAdding || text === ""}
              loading={isAdding}
              onClick={handleAdd}
            >
              <IconPlus size={16} />
            </ActionIcon>
          }
        />
      </Card>
    </SimpleGrid>
  );
};

export default AddTodo;