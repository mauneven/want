"use client";

import React from "react";
import { Image, Card, Text, Group, Button, rem, Flex } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight, IconStar } from "@tabler/icons-react";
import classes from "./HomePostCard.module.css";
import "@mantine/carousel/styles.css";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  reports: { _id: string }[];
  createdAt: string;
  photo: string;
  totalPosts: number;
  totalOffers: number;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  latitude: number;
  longitude: number;
  mainCategory: string;
  subCategory: string;
  thirdCategory: string;
  price: number;
  photos: string[];
  reports: any[];
  createdAt: string;
  __v: number;
}

export default function HomePostCard({ post }: { post: Post }) {
  const slides = post.photos.map((photo) => (
    <Carousel.Slide key={photo}>
      <Image src={`http://localhost:4000/${photo}`} height={150} />
    </Carousel.Slide>
  ));

  return (
    <Card radius="md" withBorder padding="sm" shadow="sm" >
      <Card.Section>
        <Carousel
          withIndicators
          loop
          nextControlIcon={
            <IconArrowRight style={{ width: rem(16), height: rem(16) }} />
          }
          previousControlIcon={
            <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />
          }
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {slides}
        </Carousel>
      </Card.Section>

      <Group>
        <Text fz="xl" span fw={500} className={classes.price}>
          ${post.price}
        </Text>
        <Text fw={500} fz="lg">
          {post.title}
        </Text>
      </Group>

      <Group justify="space-between" mt="lg">
        <Group gap={5}>
          <IconStar style={{ width: rem(16), height: rem(16) }} />
          <Text fz="xs" fw={500}>
            4.78
          </Text>
        </Group>
      </Group>
    </Card>
  );
}
