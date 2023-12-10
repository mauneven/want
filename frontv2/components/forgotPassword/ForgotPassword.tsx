import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, Button, Title, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, gql } from '@apollo/client';
import { IconCheck } from '@tabler/icons-react';

interface FormValues {
    email: string;
  }  

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
    },
  });

  const SEND_RESET_EMAIL = gql`
    mutation SendResetEmail($email: String!) {
      sendResetEmail(email: $email) {
        message
      }
    }
  `;

  const [sendResetEmail] = useMutation(SEND_RESET_EMAIL);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { data } = await sendResetEmail({
        variables: {
          email: values.email,
        },
      });

      console.log('Email sent:', data.sendResetEmail.message);
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Stack align="center" justify="center" gap="md">
      <Title order={2}>Forgot Password</Title>
      <p>Please enter your email address to receive a link to reset your password.</p>

      {!emailSent ? (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Email"
            placeholder="Your email"
            {...form.getInputProps('email')}
          />
          <Button type="submit">Send Reset Link</Button>
        </form>
      ) : (
        <Alert icon={<IconCheck />} color="green">
          Check your email for a link to reset your password.
        </Alert>
      )}
    </Stack>
  );
};

export default ForgotPassword;
