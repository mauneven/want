"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { environments } from "../connections/environments/environments";
import {
  Paper,
  Title,
  Text,
  Group,
  NumberInput,
  Divider,
  Stack,
  Button,
} from "@mantine/core";

interface UserData {
  user: {
    email: string;
  };
}

export default function Verify() {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [verificationCode, setVerificationCode] = useState<
    number | undefined
  >();

  const router = useRouter();

  useEffect(() => {
    fetch(`${environments.BASE_URL}/api/user`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        }
        return response.json();
      })
      .then((data: UserData) => {
        if (data) {
          setUserData(data);
        }
      });
  }, [router]);

  useEffect(() => {
    const checkVerifiedStatus = async () => {
      const verifiedResponse = await fetch(
        `${environments.BASE_URL}/api/check-verified`,
        {
          credentials: "include",
        }
      );

      if (verifiedResponse.ok) {
        router.push("/");
      }
    };

    checkVerifiedStatus();
  }, [router]);

  useEffect(() => {
    const verifyUser = async () => {
      const response = await fetch(`${environments.BASE_URL}/api/verify`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
      } else {
        const responseData = await response.json();
        setAlertMessage(
          responseData.error || "Invalid token. Please try again."
        );
      }
    };

    verifyUser();
  }, [router]);

  const handleResendVerification = async () => {
    const response = await fetch(
      `${environments.BASE_URL}/api/resend-verification`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData?.user.email }),
      }
    );

    if (response.ok) {
      setAlertMessage("Verification code has been resent.");
    } else {
      const responseData = await response.json();
      setAlertMessage(
        responseData.error || "Error resending verification. Please try again."
      );
    }
  };

  const handleLogout = async () => {
    router.back();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const data = {
      verificationCode,
    };
  
    const response = await fetch(`${environments.BASE_URL}/api/verify`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      // Verifica si hay una página anterior en el historial y que no sea la misma página actual
      if (window.history.length > 1 && document.referrer.indexOf(window.location.host) !== -1) {
        router.back();
      } else {
        router.push('/'); // Redirige a la página de inicio si no hay historial previo
      }
    } else if (response.status === 400) {
      setAlertMessage("Incorrect code. Please try again.");
    } else {
      const responseData = await response.json();
      setAlertMessage(responseData.error || "Invalid token. Please try again.");
    }
  };  

  return (
    <Group align="center" justify="center">
      <Paper radius="md" withBorder p="xl" shadow="xl" miw={300}>
          <Stack>
            <Title fw={600} maw={400}>
              You created your account! but you need to verify it.
            </Title>
            <Text size="sm" maw={400}>
              We have sent you a 6-digit verification code on your mail, please
              enter it.
            </Text>
            <Text c="dimmed" maw={400} size="xs">
              These codes only work for 30 minutes. If this time passes, you
              will need to request a new one.
            </Text>
            <form onSubmit={handleSubmit}>
            <NumberInput
              label="Verification Code"
              withAsterisk
              placeholder="123456"
              hideControls
              clampBehavior="strict"
              min={0}
              max={999999}
              required
              value={verificationCode}
              onChange={(value) => setVerificationCode(value)}
            />
            <Button type="submit" variant="light">Verify my account!</Button>
          </form>

          <Divider label="Need a new code?" />
          <Button variant="light" color="grey" onClick={handleResendVerification}>
            Send a new verification code
          </Button>

          <Divider label="Danger zone" />
          <Button color="red" variant="light" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Paper>
    </Group>
  );
}
