import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

export default function Layout() {
  const { isLoading, isAuthenticated } = useKindeAuth();

  if (isLoading) return <>Loading...</>;

  return isAuthenticated ? <LoggedIn /> : <LoggedOut />;
}
