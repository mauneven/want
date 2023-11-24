"use client";

import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from "react-query";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import classes from "./globals.module.css";
import '@mantine/notifications/styles.css';
import "@mantine/core/styles.css";
import "@mantine/code-highlight";
import "@mantine/carousel";
import "@mantine/tiptap";
import "@mantine/dates";
import "@mantine/hooks";
import WelcomeModal from "@/components/home/WelcomeModal";
import "@mantine/carousel/styles.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="bottom-right" />
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
