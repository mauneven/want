"use client";

import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  Group,
  PasswordInput,
  Text,
  Title,
  Stack,
  NumberInput,
} from "@mantine/core";
import { useForm, isNotEmpty, matchesField } from "@mantine/form";
import endpoints from "@/app/connections/enpoints/endpoints";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const toggleForm = () => setIsLogin(!isLogin);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      birthdate: "",
    },
    validate: {
      email: isNotEmpty("Email cannot be empty"),
      password: isNotEmpty("Password cannot be empty"),
      confirmPassword: matchesField("password", "Passwords do not match"),
      // Add additional validations as needed
    },
  });

  const handleSubmit = async (event: any) => {

    event.preventDefault();
    const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000+00:00`;

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
    } = form.values;

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(password)) {
      window.scrollTo(0, 0); // Scroll to the top
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      window.scrollTo(0, 0); // Scroll to the top
      return;
    }

    const data = {
      email,
      password,
      firstName,
      lastName,
      phone,
      birthdate,
    };

    const endpoint = isLogin ? endpoints.login : endpoints.register;

    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      if (isLogin) {
        location.reload();
      } else {
        window.location.href = "/verify";
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Button onClick={open}>Login/Register</Button>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"md"}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Title ta="center" size="h2">
          {isLogin ? "Welcome back to Want!" : "Join Want!"}
        </Title>
        <Stack mx="auto">
          <TextInput
            mt="md"
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          {!isLogin && (
            <>
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm Password"
                {...form.getInputProps("confirmPassword")}
              />
              <TextInput
                label="First Name"
                placeholder="First Name"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                {...form.getInputProps("lastName")}
              />
              <Group justify="space-between" grow={true}>
                <Stack gap={4}>
                  <Text size="xs">Day</Text>
                  <NumberInput
                    min={1}
                    max={31}
                    allowDecimal={false}
                    clampBehavior="strict"
                    placeholder="DD"
                    hideControls
                    maxLength={2}
                    onChange={(value) => setDay(value.toString())}
                  />
                </Stack>
                <Stack gap={4}>
                  <Text size="xs">Month</Text>
                  <NumberInput
                    min={1}
                    max={12}
                    allowDecimal={false}
                    clampBehavior="strict"
                    placeholder="MM"
                    hideControls
                    maxLength={2}
                    onChange={(value) => setMonth(value.toString())}
                  />
                </Stack>
                <Stack gap={4}>
                  <Text size="xs">Year</Text>
                  <NumberInput
                    min={1905}
                    max={2006}
                    allowDecimal={false}
                    clampBehavior="blur"
                    placeholder="YYYY"
                    hideControls
                    maxLength={4}
                    onChange={(value) => setYear(value.toString())}
                  />
                </Stack>
              </Group>
              <TextInput
                label="Phone"
                placeholder="Phone"
                {...form.getInputProps("phone")}
              />
            </>
          )}
          <Group justify="center" mt="xl">
            <Button type="submit" variant="light" onClick={handleSubmit}>
              {isLogin ? "Login" : "Register"}
            </Button>
          </Group>
          <Text mt="md">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button onClick={toggleForm} variant="light">
              {isLogin ? "Register" : "Login"}
            </Button>
          </Text>
        </Stack>
      </Modal>
    </>
  );
};

export default Login;
