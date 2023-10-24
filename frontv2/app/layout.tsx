import { MantineProvider, ColorSchemeScript, Container } from '@mantine/core';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/footer/Footer';
import classes from './globals.module.css'
export const metadata = {
  title: 'Want',
  description: 'Want',
};
import '@mantine/core/styles.css';
import '@mantine/carousel';
import '@mantine/code-highlight';
import '@mantine/dates';
import '@mantine/hooks';
import '@mantine/tiptap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider defaultColorScheme='dark'>
        <Navbar />
        <Container fluid pt={70} pb={40} classNames={{ root: classes.globalContainer }}>
          {children}
        </Container>
        <Footer />
      </MantineProvider>
    </>
  );
}