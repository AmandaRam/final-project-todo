import { Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import useListStore from "../../hooks/useListStore";
import EditList from "../../components/EditList/EditList";

const List = () => {
  // We are using the useParams hook to get the listId from the URL
  const { listId } = useParams();
  // We are using the useListStore hook to get the lists from the store
  const lists = useListStore((state) => state.lists);
  // We are using the find method to find the list with the same id as the one in the URL
  const list = lists.find((list) => list._id === listId);

  if (!list) {
    return (
      <>
        <Title>List not found</Title>
        <Text>The list you were looking for does not exist.</Text>
      </>
    );
  }

  return <EditList list={list} />;
};

export default List;
