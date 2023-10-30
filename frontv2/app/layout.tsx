"use client";

import "@mantine/core/styles.css";
import "@mantine/carousel";
import "@mantine/code-highlight";
import "@mantine/dates";
import "@mantine/hooks";
import "@mantine/tiptap";

import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import classes from "./globals.module.css";

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
          <QueryClientProvider client={queryClient}>
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
