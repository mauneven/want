import '@mantine/core/styles.css';
import '@mantine/carousel';
import '@mantine/code-highlight'
import '@mantine/dates'
import '@mantine/hooks'
import '@mantine/tiptap'

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/footer/Footer';
export const metadata = {
  title: 'Want',
  description: 'Want',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme='dark'>
            <Navbar/>{children}
            <Footer/>
        </MantineProvider>
      </body>
    </html>
  );
}