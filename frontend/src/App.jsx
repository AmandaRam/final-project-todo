import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout";

export default function App() {
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{ primaryColor: "violet" }}
    >
      <Layout />
    </MantineProvider>
  );
}
