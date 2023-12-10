"use client";

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { TextInput, Button, Title, Box, Paper, Group, Text, Container } from '@mantine/core';
import { useForm } from '@mantine/form';

const SEND_RESET_PASSWORD_EMAIL = gql`
  mutation SendResetPasswordEmail($email: String!) {
    sendResetPasswordEmail(email: $email) {
      message
    }
  }
`;

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [sendResetPasswordEmail] = useMutation(SEND_RESET_PASSWORD_EMAIL);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await sendResetPasswordEmail({
        variables: { email: form.values.email },
      });

      if (data.sendResetPasswordEmail) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Error sending reset password email:', error);
    }
  };

  return (
    <Container fluid >
    <Paper radius="md" withBorder p="xl" shadow="xl">
      <Title ta="center" size="h2">
        Forgot Password
      </Title>
      <Box maw={340} mx="auto">
        <form onSubmit={handleSubmit}>
          {!emailSent ? (
            <>
              <Text mt="md">Enter your email to reset your password.</Text>
              <TextInput
                mt="md"
                label="Email"
                placeholder="Email"
                {...form.getInputProps('email')}
              />
              <Group justify="center" mt="xl">
                <Button type="submit" variant="light">
                  Send Reset Link
                </Button>
              </Group>
            </>
          ) : (
            <Text mt="md">
              If an account with that email exists, we sent a password reset link to it.
            </Text>
          )}
        </form>
      </Box>
    </Paper>
    </Container>
  );
};

export default ForgotPassword;
