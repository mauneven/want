"use client";

import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import { ApolloProvider } from "@apollo/client";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import classes from "./globals.module.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@mantine/code-highlight";
import "@mantine/carousel";
import "@mantine/tiptap";
import "@mantine/dates";
import "@mantine/hooks";
import WelcomeModal from "@/components/home/WelcomeModal";
import "@mantine/carousel/styles.css";
import createApolloClient from "@/components/apollo/ApolloClient";
import { UserContextProvider } from "@/components/provider/UserContext";
const queryClient = new QueryClient();

const client = createApolloClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ApolloProvider client={client}>
          <MantineProvider defaultColorScheme="dark">
            <Notifications position="bottom-right" />
            <QueryClientProvider client={queryClient}>
              <UserContextProvider>
              <WelcomeModal />
              <Navbar />
              <Container
                fluid
                pt={70}
                pb={40}
                classNames={{ root: classes.globalContainer }}
              >
                {children}
              </Container>
              <Footer />
              </UserContextProvider>
            </QueryClientProvider>
          </MantineProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
