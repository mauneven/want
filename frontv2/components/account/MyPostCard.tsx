import React from "react";
import {
  Image,
  Card,
  Text,
  Group,
  Button,
  rem
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import classes from "./MyPostCard.module.css";
import "@mantine/carousel/styles.css";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

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

export interface Post {
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

export default function MyPostCard({ post }: { post: Post }) {

  const slides = post.photos.map((photo) => (
    <Carousel.Slide key={photo}>
      <Image src={`https://want.com.co/${photo}`} height={150} />
    </Carousel.Slide>
  ));

  return (
        <Card
          radius="md"
          withBorder
          padding="xl"
          shadow="sm"
        >
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

          <Group justify="space-between" mt="lg">
            <Text fw={500} fz="lg">
              {post.title}
            </Text>
          </Group>

          <Group justify="space-between" mt="md">
            <div>
              <Text fz="xl" span fw={500} className={classes.price}>
                ${post.price}
              </Text>
              <Text span fz="sm" c="dimmed">
                {" "}
              </Text>
            </div>
            <Button radius="md">Offer</Button>
          </Group>
        </Card>
  );
}