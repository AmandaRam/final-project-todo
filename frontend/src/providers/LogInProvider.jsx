import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { LoadingOverlay } from "@mantine/core";
import LoggedOut from "../components/Auth/LoggedOut";

const LogInProvider = ({ children }) => {
  const { isLoading, isAuthenticated } = useKindeAuth();

  // While determening if we are logged in or not, show a loading overlay
  if (isLoading) {
    return (
      <LoadingOverlay visible zIndex={1000} loaderProps={{ type: "dots" }} />
    );
  }
  // If we are not authenticated, show the logged out page
  if (!isAuthenticated) {
    return <LoggedOut />;
  }
  // Otherwise, show the children, in this case the App component
  return children;
};

export default LogInProvider;
