import React from "react";
import ReactDOM from "react-dom/client";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import LogInProvider from "./providers/LogInProvider.jsx";
import ListProvider from "./providers/ListProvider.jsx";
import List from "./pages/List.jsx";
import "@mantine/core/styles.css";

// We are using the createBrowserRouter function to display our routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Home</h1>,
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
      isDangerouslyUseLocalStorage={import.meta.env.DEV}
    >
      <MantineProvider
        defaultColorScheme="dark"
        theme={{ primaryColor: "violet" }}
      >
        {/*  We are using the LoginProvider to only show the app if we are logged in */}
        <LogInProvider>
          {/*  We are using the ListProvider to load our lists */}
          <ListProvider>
            <RouterProvider router={router} />
          </ListProvider>
        </LogInProvider>
      </MantineProvider>
    </KindeProvider>
  </React.StrictMode>,
);
