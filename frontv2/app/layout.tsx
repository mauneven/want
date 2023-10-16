import '@mantine/core/styles.css';
import '@mantine/carousel';
import '@mantine/code-highlight'
import '@mantine/dates'
import '@mantine/hooks'
import '@mantine/tiptap'

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { HeaderSearch } from '@/components/navigation/Navbar2';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme='dark'><HeaderSearch/>{children}</MantineProvider>
      </body>
    </html>
  );
}