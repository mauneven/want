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
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string>("");
  const [initialDay, setInitialDay] = useState<string>(""); // Added initial state for day
  const [initialMonth, setInitialMonth] = useState<string>(""); // Added initial state for month
  const [initialYear, setInitialYear] = useState<string>(""); // Added initial state for year
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isUpdateClicked, setIsUpdateClicked] = useState<boolean>(false);
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
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setPhone(data.user.phone.toString());
        const date = new Date(data.user.birthdate);
        setDay(date.getDate().toString());
        setMonth((date.getMonth() + 1).toString());
        setYear(date.getFullYear().toString());
        setInitialDay(date.getDate().toString()); // Store initial day
        setInitialMonth((date.getMonth() + 1).toString()); // Store initial month
        setInitialYear(date.getFullYear().toString()); // Store initial year
        setPhotoURL(data.user.photo);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const isDirty =
      firstName !== user?.firstName ||
      lastName !== user?.lastName ||
      phone !== user?.phone.toString() ||
      selectedFile !== null ||
      day !== initialDay || // Check if day is different from initial value
      month !== initialMonth || // Check if month is different from initial value
      year !== initialYear; // Check if year is different from initial value
    setIsFormDirty(isDirty);
  }, [firstName, lastName, phone, selectedFile, day, month, year]);

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append(
      "birthdate",
      new Date(`${year}-${month}-${day}`).toISOString()
    );
    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    fetch(endpoints.updateuser, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (response.headers.get("Content-Type")?.includes("application/json")) {
          return response.json();
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      })
      .finally(() => {
        setIsUpdateClicked(false);
        setIsFormDirty(false);
        setSelectedFile(null); // Limpiar el archivo seleccionado
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
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : `${environments.BASE_URL}/${user?.photo}` || null
              }
              size={120}
              radius={120}
            />
            <Stack align="left" justify="left">
              <FileInput
                placeholder="Change photo"
                variant="default"
                onChange={(file: File | null) => {
                  setSelectedFile(file);
                  setIsFormDirty(true);
                }}
                accept="image/png,image/jpeg"
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
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setIsFormDirty(true);
              }}
            />
            <Text>Last Name</Text>
            <Input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setIsFormDirty(true);
              }}
            />
            <Text>Phone</Text>
            <Input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsFormDirty(true);
              }}
            />
            <Text>Email</Text>
            <Input defaultValue={user?.email} disabled />
            <Text>Birthday</Text>
            <Group>
              <Stack>
                <Text size="xs">Day</Text>
                <Input
                  placeholder="DD"
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value);
                    setIsFormDirty(true);
                  }}
                />
              </Stack>
              <Stack>
                <Text size="xs">Month</Text>
                <Input
                  placeholder="MM"
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setIsFormDirty(true);
                  }}
                />
              </Stack>
              <Stack>
                <Text size="xs">Year</Text>
                <Input
                  placeholder="YYYY"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setIsFormDirty(true);
                  }}
                />
              </Stack>
            </Group>
            <Stack>
              {isFormDirty && (
                <Button
                  variant="light"
                  color="red"
                  onClick={() => {
                    setFirstName(user?.firstName || "");
                    setLastName(user?.lastName || "");
                    setPhone(user?.phone.toString() || "");
                    setDay(initialDay); // Restore initial day value
                    setMonth(initialMonth); // Restore initial month value
                    setYear(initialYear); // Restore initial year value
                    setSelectedFile(null);
                    setIsFormDirty(false);
                    setIsUpdateClicked(false);
                  }}
                >
                  Cancel
                </Button>
              )}
              {isFormDirty && (
                <Button
                  variant="light"
                  onClick={handleUpdateProfile}
                  disabled={isUpdateClicked}
                >
                  Update Profile
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Group>
    </Container>
  );
}