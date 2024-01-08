import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import { LoadingOverlay } from "@mantine/core";

export default function Layout() {
  const { isLoading, isAuthenticated } = useKindeAuth();

  if (isLoading) {
    return (
      <LoadingOverlay visible zIndex={1000} loaderProps={{ type: "dots" }} />
    );
  }

  return isAuthenticated ? <LoggedIn /> : <LoggedOut />;
}
