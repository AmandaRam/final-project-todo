import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import List from "./pages/List/List.jsx";
import Error from "./pages/Error/Error.jsx";
import Layout from "./components/Layout/Layout.jsx";
import ListProvider from "./providers/ListProvider.jsx";
import LogInProvider from "./providers/LogInProvider.jsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// We are using the createBrowserRouter function to display our routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/lists/:listId",
        element: <List />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_DOMAIN}
      logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URL}
      redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URL}
      // We are using the isDangerouslyUseLocalStorage prop to store the token in localStorage. This is not recommended for production apps, but it was annoying to log in every time we refreshed the page when testing.
      isDangerouslyUseLocalStorage={true}
    >
      <MantineProvider
        defaultColorScheme="dark"
        theme={{ primaryColor: "violet", cursorType: "pointer" }}
      >
        <Notifications />
        {/*  We are using the LoginProvider to only show the app if we are logged in */}
        <ModalsProvider>
          <LogInProvider>
            {/*  We are using the ListProvider to load our lists */}
            <ListProvider>
              <RouterProvider router={router} />
            </ListProvider>
          </LogInProvider>
        </ModalsProvider>
      </MantineProvider>
    </KindeProvider>
  </React.StrictMode>,
);
