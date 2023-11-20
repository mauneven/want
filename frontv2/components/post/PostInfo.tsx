import React, { useState } from "react";
import {
  SimpleGrid,
  NumberFormatter,
  Text,
  Title,
  Badge,
  Paper,
  Stack,
  Divider,
  Group,
} from "@mantine/core";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { environments } from "@/app/connections/environments/environments";
import UserInfoModal from "../user/UserInfo";

interface User {
  createdAt: Date;
  firstName: string;
  lastName: string;
  photo: string;
  totalPosts: number;
  reports: Array<any>;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  latitude: number;
  longitude: number;
  mainCategory: string;
  price: number;
  photos: string[];
}

interface PostInfoProps {
  post: Post;
}

const PostInfo: React.FC<PostInfoProps> = ({ post }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 10, sm: "xl" }}>
      <Group>
        <Carousel withIndicators>
          {post.photos.map((photo, index) => (
            <Carousel.Slide key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  src={`${environments.BASE_URL}/${photo}`}
                  alt={`Slide ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Group>
      <Paper withBorder shadow="lg" p="xl">
        <Stack gap="xl">
          <Title>{post.title}</Title>
          <Badge>{post.mainCategory}</Badge>
          <Title>
            <NumberFormatter prefix="$ " value={post.price} thousandSeparator />
          </Title>
          <Divider />
          <Text>{post.description}</Text>
        </Stack>
        <UserInfoModal user={post.createdBy} />
      </Paper>
    </SimpleGrid>
  );
};

export default PostInfo;
