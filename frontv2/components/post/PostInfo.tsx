import React from "react";
import {
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
import PostInfoMap from "./InfoPostLocation";

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
  const hasPhotos = post.photos.length > 0;

  return (
    <Group justify="center" grow>
      {hasPhotos && (
        <Group justify="center" style={{ width: "50%" }}>
          <Carousel align="center" withIndicators>
            {post.photos.map((photo, index) => (
              <Carousel.Slide key={index}>
                <Group
                  style={{
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
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
                </Group>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Group>
      )}
      <Group justify="center" grow maw={900}>
        <Paper withBorder shadow="lg" p="xl">
          <Stack gap="xl">
            <Title>{post.title}</Title>
            <Badge>{post.mainCategory}</Badge>
            <Title>
              <NumberFormatter
                prefix="$ "
                value={post.price}
                thousandSeparator
              />
            </Title>
            <Divider />
            <Text>{post.description}</Text>
            <PostInfoMap lat={post.latitude} lng={post.longitude} />
          </Stack>
          <UserInfoModal user={post.createdBy} />
        </Paper>
      </Group>
    </Group>
  );
};

export default PostInfo;
