import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useEffect, useState } from "react";
import useListStore from "../hooks/useListStore";
import { LoadingOverlay } from "@mantine/core";
import Error from "../pages/Error/Error";

// This provider is used to load the lists from the backend
const ListProvider = ({ children }) => {
  const { getToken } = useKindeAuth();

  // State for loading user data and lists
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const setLists = useListStore((state) => state.setLists);

  // Load user data on mount
  useEffect(() => {
    const loadLists = async () => {
      try {
        // Getting our token from the Kinde
        const token = await getToken();
        // Fetching our lists from the backend using the Kinde token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/lists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If the response is not ok, force an error and catch it
        if (!response.ok) {
          throw new Error("Failed to load lists");
        }

        // Parse the response as JSON
        const data = await response.json();
        setLists(data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadLists();
  }, []);

  // If we're loading, show a loading overlay
  if (isLoading) {
    return (
      <LoadingOverlay visible zIndex={1000} loaderProps={{ type: "dots" }} />
    );
  }

  if (!hasError) {
    return <Error />;
  }

  return children;
};

export default ListProvider;
