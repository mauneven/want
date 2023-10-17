"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Text, Paper, Container, Group } from "@mantine/core";
import endpoints from "../connections/enpoints/endpoints";
import { IconStarFilled } from "@tabler/icons-react";
import MyPostCard, { Post } from "@/components/profile/MyPostCard";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  reports: Array<any>;
  photo: string;
  totalPosts: number;
  totalOffers: number;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

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

    fetch(endpoints.myposts, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setMyPosts(data.posts);
      })
      .catch((error) => {
        console.error("Error fetching user posts:", error);
      });
  }, []);

  return (
    <Container>
      <Group align="center" justify="center">
        <Paper radius="md" withBorder p="sm" miw={280} shadow="sm">
          <Group align="center" justify="center">
            <Group>
              <Avatar
                src={`https://want.com.co/${user?.photo}` || null}
                size={120}
                radius={120}
                mx="auto"
              />
            </Group>
            <Group display={"grid"}>
              <Text ta="center" fz="xl" fw={500} mt="md">
                {user ? `${user.firstName} ${user.lastName}` : ""}
              </Text>
              <Text ta="center" c="sm" fz="sm">
                {user ? `${user.email}` : ""}
              </Text>
              <Group align="center" justify="center">
                <IconStarFilled />
                <Text fz="xl" ta="center">
                  {user ? `${5 - user.reports.length * 0.3}` : ""}
                </Text>
              </Group>
              <Group justify="center">
                <div>
                  <Text ta="center" c="sm" fz="sm">
                    Total Posts
                  </Text>
                  <Text ta="center" c="sm" fz="sm">
                    {user ? `${user.totalPosts}` : ""}
                  </Text>
                </div>
                <div>
                  <Text ta="center" c="sm" fz="sm">
                    Total offers
                  </Text>
                  <Text ta="center" c="sm" fz="sm">
                    {user ? `${user.totalOffers}` : ""}
                  </Text>
                </div>
              </Group>
              <Group align="center" justify="center"></Group>
            </Group>
          </Group>
        </Paper>
      </Group>
      <Group>
        {myPosts &&
          myPosts.map((post) => <MyPostCard key={post._id} post={post} />)}
      </Group>
    </Container>
  );
}
