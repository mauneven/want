import React from "react";
import {
  SimpleGrid,
  NumberFormatter,
  Text,
  Title,
  Badge,
  Paper,
  Stack,
  UnstyledButton,
  Group,
  Avatar,
  rem,
  Button,
  Divider,
} from "@mantine/core";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { environments } from "@/app/connections/environments/environments";
import { IconChevronRight } from "@tabler/icons-react";

interface User {
  firstName: string;
  lastName: string;
  photo: string;
  totalPosts: number;
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
        <Button mt={20} size="xl" p={0} variant="transparent">
          <Group>
            <Avatar
              size="md"
              src={`${environments.BASE_URL}/${post.createdBy.photo}`}
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {`${post.createdBy.firstName} ${post.createdBy.lastName}`}
              </Text>

              <Text c="dimmed" size="xs">
                {`Has made ${post.createdBy.totalPosts} Posts`}
              </Text>
            </div>

            <IconChevronRight
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
        </Button>
      </Paper>
    </SimpleGrid>
  );
};

export default PostInfo;
