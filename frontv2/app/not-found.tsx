"use client";

import { Image, Container, Title, Text, Button, SimpleGrid, Paper } from '@mantine/core';
import Lottie from "lottie-react";
import animationData from "../assets/404.json";
import classes from './notFound/NotFound.module.css';
import { useRouter } from 'next/navigation';

export default function Custom404() {

  const router = useRouter();
  return (
    <Container className={classes.container}>
      <Paper p={"xl"} withBorder>


      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <div className={classes.lottieContainer}>
          <Lottie 
            animationData={animationData} 
            loop={false} 
            autoplay={true}
            height={"100%"}
            width={"100%"}
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
          />
        </div>
        <div>
          <Title size={"md"} className={classes.title}>Something is not right...</Title>
          <Text size="md" className={classes.text}>
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Button
            variant="light"
            size="md"
            mt="xs"
            className={classes.button}
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        </div>
      </SimpleGrid>
      </Paper>
    </Container>
  );
}