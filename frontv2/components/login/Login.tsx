'use client'

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
} from "@mantine/core";
import { useForm, isNotEmpty, matchesField } from "@mantine/form";
import endpoints from "@/app/connections/enpoints/endpoints";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const toggleForm = () => setIsLogin(!isLogin);

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
    
    const { email, password, confirmPassword, firstName, lastName, phone, birthdate } = form.values;
    
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        window.scrollTo(0, 0); // Scroll to the top
        return;
      }
    
      if (!passwordRegex.test(password)) {
        window.scrollTo(0, 0); // Scroll to the top
        return;
      }
    }
    
    const data = {
      email,
      password,
      ...(isLogin ? {} : { firstName, lastName, phone, birthdate }),
    };
    const response = await fetch(
      isLogin ? endpoints.login : endpoints.register,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      if (!responseData.isVerified) {
        
      } else {
        localStorage.setItem("mainCategoryPreferences", JSON.stringify(responseData.mainCategoryCounts));
        localStorage.setItem("subCategoryPreferences", JSON.stringify(responseData.subCategoryCounts));
        localStorage.setItem("thirdCategoryPreferences", JSON.stringify(responseData.thirdCategoryCounts));
        close();
        window.location.replace('/');
    }
    } else {
      if (response.status === 409) {
      } else if (response.headers.get("Content-Type") === "application/json") {
        const responseData = await response.json();
      } else {
      }

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
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
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
      </Modal>
    </>
  );
};

export default Login;
