'use client'

import React from 'react';
import { Image, Card, Text, Group, Button, rem } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconStar } from '@tabler/icons-react';
import classes from './HomePostCard.module.css';
import '@mantine/carousel/styles.css';
import endpoints from '@/app/connections/enpoints/endpoints';
import { environments } from '@/app/connections/environments/dev-environments';

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
      <Image src={`https://want.com.co/${photo}`} height={150} />
    </Carousel.Slide>
  ));

  return (
    <Group classNames={{root: classes.HomePostCard}}>
      <Card radius="md" withBorder padding="xl" classNames={{root: classes.singleCard}}>
        <Card.Section>
          <Carousel
            withIndicators
            loop
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

          <Group gap={5}>
            <IconStar style={{ width: rem(16), height: rem(16) }} />
            <Text fz="xs" fw={500}>
              4.78
            </Text>
          </Group>
        </Group>

        <Text fz="sm" c="dimmed" mt="sm">
          {post.description}
        </Text>

        <Group justify="space-between" mt="md">
          <div>
            <Text fz="xl" span fw={500} className={classes.price}>
              {post.price}$
            </Text>
            <Text span fz="sm" c="dimmed">
              {' '}
              / Freedom
            </Text>
          </div>

          <Button radius="md">Offer</Button>
        </Group>
      </Card>
    </Group>
  );
}