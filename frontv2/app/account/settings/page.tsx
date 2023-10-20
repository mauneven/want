"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Text,
  Paper,
  Container,
  Group,
  Title,
  Divider,
  Button,
  Stack,
  Input,
  FileButton,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import endpoints from "@/app/connections/enpoints/endpoints";
import { environments } from "@/app/connections/environments/environments";
import "@mantine/notifications/styles.css";

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
  const [initialDay, setInitialDay] = useState<string>("");
  const [initialMonth, setInitialMonth] = useState<string>("");
  const [initialYear, setInitialYear] = useState<string>("");
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isUpdateClicked, setIsUpdateClicked] = useState<boolean>(false);
  const resetFileRef = useRef<() => void>(null);

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
        setInitialDay(date.getDate().toString());
        setInitialMonth((date.getMonth() + 1).toString());
        setInitialYear(date.getFullYear().toString());
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
      day !== initialDay ||
      month !== initialMonth ||
      year !== initialYear;
    setIsFormDirty(isDirty);
  }, [firstName, lastName, phone, selectedFile, day, month, year]);

  useEffect(() => {
    refreshUserProfile();
  }, []);

  const refreshUserProfile = async () => {
    try {
      const response = await fetch(endpoints.user, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Error fetching user profile");
      }
      const data = await response.json();
      setUser(data.user);
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      setPhone(data.user.phone.toString());
      const date = new Date(data.user.birthdate);
      setDay(date.getDate().toString());
      setMonth((date.getMonth() + 1).toString());
      setYear(date.getFullYear().toString());
      setInitialDay(date.getDate().toString());
      setInitialMonth((date.getMonth() + 1).toString());
      setInitialYear(date.getFullYear().toString());
      setPhotoURL(data.user.photo);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

    try {
      const response = await fetch(endpoints.updateuser, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        Notifications.show({
          title: "Success",
          message: "Profile updated successfully",
          color: "green",
          autoClose: 3000,
        });
        await refreshUserProfile();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Error updating profile");
      }
    } catch (error) {
      Notifications.show({
        title: "Error",
        message: "Error updating profile",
        color: "red",
        autoClose: 3000,
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdateClicked(false);
      setIsFormDirty(false);
      setSelectedFile(null);
      resetFileRef.current?.();
    }
  };

  return (
    <Container fluid>
      <Notifications />
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
              <FileButton
                resetRef={resetFileRef}
                onChange={(file: File | null) => {
                  setSelectedFile(file);
                  setIsFormDirty(true);
                }}
                accept="image/png,image/jpeg"
              >
                {(props) => (
                  <Button variant="light" {...props}>
                    Change photo
                  </Button>
                )}
              </FileButton>
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
                <>
                <Divider/>
                <Button
                  variant="light"
                  color="red"
                  onClick={() => {
                    setFirstName(user?.firstName || "");
                    setLastName(user?.lastName || "");
                    setPhone(user?.phone.toString() || "");
                    setDay(initialDay);
                    setMonth(initialMonth);
                    setYear(initialYear);
                    setSelectedFile(null);
                    setIsFormDirty(false);
                    setIsUpdateClicked(false);
                    resetFileRef.current?.();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="light"
                  onClick={handleUpdateProfile}
                  disabled={isUpdateClicked}
                >
                  Update Profile
                </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Group>
    </Container>
  );
}