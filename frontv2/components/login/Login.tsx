import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, gql } from "@apollo/client";
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
  Alert,
} from "@mantine/core";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetErrors();
  };
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [dayError, setDayError] = useState("");
  const [monthError, setMonthError] = useState("");
  const [yearError, setYearError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const icon = <IconInfoCircle />;
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      birthdate: "",
    },
  });

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setFirstNameError("");
    setLastNameError("");
    setDayError("");
    setMonthError("");
    setYearError("");
    setPhoneError("");
  };
  
  const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
      login(input: { email: $email, password: $password }) {
        id
        email
      }
    }
  `;

  const [loginUser] = useMutation(LOGIN_USER);

  const REGISTER_USER = gql`
    mutation RegisterUser(
      $email: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $birthdate: String!
    ) {
      register(
        input: {
          email: $email
          password: $password
          firstName: $firstName
          lastName: $lastName
          birthdate: $birthdate
        }
      ) {
        id
        email
        firstName
        lastName
        birthdate
        isVerified
      }
    }
  `;

  const [registerUser] = useMutation(REGISTER_USER);

  const handleForgotPassword = () => {
    router.push("/forgotPassword");
    close();
  };

  const handleLogin = async () => {
    const { email, password } = form.values;

    if (!email || !password) {
      setEmailError(!email ? "Email is required" : "");
      setPasswordError(!password ? "Password is required" : "");
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { email, password },
      });

      console.log("Inicio de sesión exitoso:", data.login);
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  };

  const handleRegister = async () => {
    function isValidDate(year: number, month: number, day: number | undefined) {
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }

    const { email, password, firstName, lastName, phone } = form.values;

    if (!isValidDate(parseInt(year), parseInt(month), parseInt(day))) {
      setAlertTitle("You have entered an inexisting date");
      setAlertDescription("Check if your birthday already exists");
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
      return;
    }
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !day ||
      !month ||
      !year ||
      !phone
    ) {
      setEmailError(!email ? "Email is required" : "");
      setPasswordError(!password ? "Password is required" : "");
      setFirstNameError(!firstName ? "First Name is required" : "");
      setLastNameError(!lastName ? "Last Name is required" : "");
      setDayError(!day ? "A day is required" : "");
      setMonthError(!month ? "A month is required" : "");
      setYearError(!year ? "A year is required" : "");
      setPhoneError(!phone ? "Phone is required" : "");
      setAlertTitle("Incomplete Fields");
      setAlertDescription(
        "Please ensure all required fields are filled out."
      );
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
      return;
    }

  if (
    emailError ||
    passwordError ||
    firstNameError ||
    lastNameError ||
    dayError ||
    monthError ||
    yearError ||
    phoneError
  ) {
    return;
  }

  const birthdate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T00:00:00.000+00:00`;
  loadDevMessages();
  loadErrorMessages();

  try {
    const { data } = await registerUser({
      variables: {
        email,
        password,
        firstName,
        lastName,
        birthdate,
      },
    });

    console.log("Registro exitoso:", data.register);
  } catch (error) {
    console.error("Error en el registro:", error);
  }

  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
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
            label="Email"
            placeholder="Email"
            value={form.values.email}
            onChange={(event) => {
              form.setFieldValue("email", event.currentTarget.value);
              setEmailError("");
            }}
            error={emailError}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={form.values.password}
            onChange={(event) => {
              form.setFieldValue("password", event.currentTarget.value);
              setPasswordError("");
            }}
            error={passwordError}
          />
          {!isLogin && (
            <>
              <TextInput
                label="First Name"
                placeholder="First Name"
                value={form.values.firstName}
                onChange={(event) => {
                  form.setFieldValue("firstName", event.currentTarget.value);
                  setFirstNameError("");
                }}
                error={firstNameError}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                value={form.values.lastName}
                onChange={(event) => {
                  form.setFieldValue("lastName", event.currentTarget.value);
                  setLastNameError("");
                }}
                error={lastNameError}
              />
              <Group justify="space_between" grow={true}>
                <Stack gap={4}>
                  <Text size="xs">Day</Text>
                  <NumberInput
                    min={1}
                    max={31}
                    allowDecimal={false}
                    clampBehavior="strict"
                    allowNegative={false}
                    placeholder="DD"
                    hideControls
                    maxLength={2}
                    value={day}
                    onChange={(value) => {
                      setDay(value.toString());
                      setDayError("");
                    }}
                    error={dayError}
                  />
                </Stack>
                <Stack gap={4}>
                  <Text size="xs">Month</Text>
                  <NumberInput
                    min={1}
                    max={12}
                    allowDecimal={false}
                    clampBehavior="strict"
                    allowNegative={false}
                    placeholder="MM"
                    hideControls
                    maxLength={2}
                    value={month}
                    onChange={(value) => {
                      setMonth(value.toString());
                      setMonthError("");
                    }}
                    error={monthError}
                  />
                </Stack>
                <Stack gap={4}>
                  <Text size="xs">Year</Text>
                  <NumberInput
                    min={1905}
                    max={2006}
                    allowDecimal={false}
                    placeholder="YYYY"
                    clampBehavior="blur"
                    allowNegative={false}
                    hideControls
                    maxLength={4}
                    value={year}
                    onChange={(value) => {
                      setYear(value.toString());
                      setYearError("");
                    }}
                    error={yearError}
                  />
                </Stack>
              </Group>
              <TextInput
                label="Phone"
                placeholder="Phone"
                value={form.values.phone}
                onChange={(event) => {
                  form.setFieldValue("phone", event.currentTarget.value);
                  setPhoneError("");
                }}
                error={phoneError}
              />
            </>
          )}
          {alertVisible && (
            <Alert variant="light" color="red" title={alertTitle} icon={icon}>
              {alertDescription}
            </Alert>
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
          <Button onClick={handleForgotPassword} variant="transparent">
            Forgot your password?
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default Login;
