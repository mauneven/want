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
  Input,
  FileInput,
  Fieldset,
  TextInput,
} from "@mantine/core";
import endpoints from "@/app/connections/enpoints/endpoints";
import { IconStarFilled } from "@tabler/icons-react";
import MyPostCard, { Post } from "@/components/account/MyPostCard";
import { useRouter } from "next/navigation";
import { environments } from "@/app/connections/environments/environments";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  reports: Array<any>;
  photo: string;
  totalPosts: number;
  totalOffers: number;
  phone: number;
  birthdate: Date;
};

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string>(""); // <-- New state
  const [lastName, setLastName] = useState<string>(""); // <-- New state
  const [phone, setPhone] = useState<number | string>(""); // <-- New state
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string>("");
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
        setFirstName(data.user.firstName); // <-- Initialize state with user data
        setLastName(data.user.lastName); // <-- Initialize state with user data
        setPhone(data.user.phone); // <-- Initialize state with user data
        const date = new Date(data.user.birthdate);
        setDay(date.getDate().toString());
        setMonth((date.getMonth() + 1).toString());
        setYear(date.getFullYear().toString());
        setPhotoURL(data.user.photo);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName); // <-- Use the state directly
    formData.append("lastName", lastName); // <-- Use the state directly
    formData.append("phone", phone.toString()); // <-- Use the state directly
    formData.append(
      "birthdate",
      new Date(`${year}-${month}-${day}`).toISOString()
    );
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }
    console.log(selectedFile)

    fetch(endpoints.updateuser, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (
          response.headers.get("Content-Type")?.includes("application/json")
        ) {
          return response.json();
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };
  return (
    <Container fluid>
      <Divider
        label={
          <Title fw={900} size="h2" mt={10} mb={10} ta="center">
            Your Account
          </Title>
        }
        labelPosition="center"
        m={20}
      />
      <Group align="center" justify="center">
        <Paper radius="md" withBorder p="xl" shadow="xl" miw={300}>
          <Group justify="center" align="center" mb={20}>
            <Avatar
              src={`${environments.BASE_URL}/${user?.photo}` || null}
              size={120}
              radius={120}
            />
            <Stack align="left" justify="left">
              <FileInput
                placeholder="Change photo"
                variant="default"
                onChange={(file: File | null) => {
                  setSelectedFile(file);
                }}
              >
                Change photo
              </FileInput>
              <Button variant="light" color="red">
                Delete Photo
              </Button>
            </Stack>
          </Group>
          <Stack>
            <Text>Name</Text>
            <Input
              defaultValue={user?.firstName}
              value={firstName} // <-- Bind input to state
              onChange={(e) => setFirstName(e.target.value)} // <-- Update state on change
            />
            <Text>Last Name</Text>
            <Input
              defaultValue={user?.lastName}
              value={lastName} // <-- Bind input to state
              onChange={(e) => setLastName(e.target.value)} // <-- Update state on change
            />
            <Text>Phone</Text>
            <Input
              defaultValue={user?.phone}
              value={phone} // <-- Bind input to state
              onChange={(e) => setPhone(e.target.value)} // <-- Update state on change
            />
            <Text>Email</Text>
            <Input defaultValue={user?.email} disabled />
            <Text>Birthday</Text>
            <Group>
              <Input
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
              <Input
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <Input
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Group>
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </Stack>
        </Paper>
      </Group>
    </Container>
  );
}
