"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Text,
  Paper,
  Container,
  Group,
  Title,
  Divider,
  Button,
  Flex,
  Stack,
} from "@mantine/core";
import endpoints from "../connections/enpoints/endpoints";
import { IconStarFilled } from "@tabler/icons-react";
import MyPostCard, { Post } from "@/components/account/MyPostCard";
import classes from "../globals.module.css";
import { useRouter } from "next/navigation";
import { environments } from "../connections/environments/environments";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  reports: Array<any>;
  photo: string;
  totalPosts: number;
  totalOffers: number;
};

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(endpoints.user, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching user profile");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(endpoints.myposts, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setMyPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching user posts:", error);
      });
  }, []);

  const refreshPosts = () => {
    fetch(endpoints.myposts, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setMyPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching user posts:", error);
      });
  };

  return (
    <Container fluid>
      <Divider
        label={
          <Title fw={900} size="h1" mt={10} mb={10} ta="center">
            Your Posts
          </Title>
        }
        labelPosition="center"
        m={20}
      />
      <Container mt="10" p={0} fluid>
        <Flex gap={30} classNames={{ root: classes.container }}>
          {myPosts &&
            myPosts.map((post) => (
              <MyPostCard
                key={post._id}
                onPostDelete={refreshPosts}
                post={post}
              />
            ))}
            
        </Flex>
      </Container>
    </Container>
  );
}
