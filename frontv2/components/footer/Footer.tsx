'use client'
import { Container, Group, Anchor, Text } from '@mantine/core';
import classes from './Footer.module.css';

const links = [
  { link: '#', label: 'Terms and Conditions' },
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'About Us' },
  { link: '#', label: 'Languague' },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container fluid className={classes.inner}>
        <Text size='lg' fw={900}>Want</Text>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}