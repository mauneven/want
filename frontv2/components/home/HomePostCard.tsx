"use client";

import React from "react";
import { Image, Card, Text, rem, Stack, Group } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight, IconStar } from "@tabler/icons-react";
import classes from "./HomePostCard.module.css";
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
  const hasPhotos = post.photos.length > 0;
  const slides = hasPhotos
    ? post.photos.map((photo) => (
        <Carousel.Slide key={photo}>
          <Image
            onClick={() => router.push(`/post/${post._id}`)}
            src={`http://localhost:4000/${photo}`}
            height={150}
          />
        </Carousel.Slide>
      ))
    : null;

  return (
    <Card radius="md" withBorder padding="sm" className={classes.HomePostCard}>
      {hasPhotos ? (
        <Card.Section className={classes.carousel}>
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
      ) : (
        <Group justify="center" style={{ height: "135px" }} onClick={() => router.push(`/post/${post._id}`)}>
          <Text className={classes.title}>{post.title}</Text>
        </Group>
      )}

      <Stack gap="xs" onClick={() => router.push(`/post/${post._id}`)}>
        <Text fz="xl" span fw={500} className={classes.price}>
          ${post.price}
        </Text>
        <Text fw={500} fz="lg" className={classes.title}>
          {post.title}
        </Text>
      </Stack>
    </Card>
  );
}
