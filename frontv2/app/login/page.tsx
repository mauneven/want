"use client";

import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Box,
  PasswordInput,
  Text,
  Title,
  Paper,
} from "@mantine/core";
import { useForm, isNotEmpty, matchesField } from "@mantine/form";
import endpoints from "@/app/connections/enpoints/endpoints";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);
  const router = useRouter();
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

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      birthdate,
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
      // Registration or Login successful
      const responseData = await response.json();
      
      router.back();
      location.reload();
    } else {
      // Registration or Login failed
      if (!isLogin && response.status === 409) {
        // User already exists (for registration)
        // Handle the error message or UI feedback here
      } else if (response.headers.get("Content-Type") === "application/json") {
        // Handle other server-side errors here
        const responseData = await response.json();
        // You can show error messages to the user based on the responseData
      } else {
        // Handle unexpected errors
      }

      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Paper>
        <Title ta="center" size="h2">
          {isLogin ? "Welcome back to Want!" : "Join Want!"}
        </Title>
        <Box maw={340} mx="auto">
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
              <TextInput
                label="Phone"
                placeholder="Phone"
                {...form.getInputProps("phone")}
              />
              <TextInput
                label="Birthdate"
                placeholder="Birthdate"
                {...form.getInputProps("birthdate")}
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
        </Box>
      </Paper>
    </>
  );
};

export default Login;
