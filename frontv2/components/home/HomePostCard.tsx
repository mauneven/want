"use client";

import React from "react";
import { Image, Card, Text, Group, Button, rem, Flex } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight, IconStar } from "@tabler/icons-react";
import classes from "./HomePostCard.module.css";
import "@mantine/carousel/styles.css";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const slides = post.photos.map((photo) => (
    <Carousel.Slide key={photo}>
      <Image
        onClick={() => router.push(`/post/${post._id}`)}
        src={`http://localhost:4000/${photo}`}
        height={150}
      />
    </Carousel.Slide>
  ));

  return (
    <Card radius="md" withBorder padding="sm" className={classes.HomePostCard} >
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

      <Group onClick={() => router.push(`/post/${post._id}`)}>
        <Text fz="xl" span fw={500} className={classes.price}>
          ${post.price}
        </Text>
        <Text fw={500} fz="lg">
          {post.title}
        </Text>
      </Group>
    </Card>
  );
}
