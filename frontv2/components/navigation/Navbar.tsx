"use client";

import {
  Autocomplete,
  Group,
  rem,
  Menu,
  Avatar,
  Modal,
  Text,
  Button,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Flex,
  UnstyledButton,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconMessageCircle,
  IconLogout,
  IconList,
  IconUser,
  IconSun,
  IconMoon,
  IconHome,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "../login/Login";
import { UseUserContext } from "../provider/UserContext";
import { environments } from "@/app/connections/environments/environments";

interface User {
  photo?: string;
  [key: string]: any;
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [openedModal, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { userInfo, onUserInfoChange } = UseUserContext();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleWant = () => {
    if (!user) {
      handleOpenLoginModal();
    } else {
      router.push("/new");
    }
  };

  useEffect(() => {
    console.log("Información del usuario en navbar:", userInfo);
    if (userInfo && userInfo.getUserData) {
      setUser(userInfo.getUserData);
    } else {
      setUser(null);
    }
  }, [userInfo]);

  const logout = async () => {
    try {
    } catch (error) {
      console.error("Error log out", error);
    }
  };

  return (
    <header className={classes.header}>
      <Modal
        opened={openedModal}
        onClose={close}
        title="Sure you want to logout?"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text>
          You will have to login again if you Want to use your account
        </Text>
        <Group>
          <Button
            variant="gradient"
            gradient={{ from: "red", to: "orange", deg: 90 }}
            color="red"
            fullWidth
            justify="center"
            onClick={logout}
          >
            Logout
          </Button>
        </Group>
      </Modal>
      <div className={classes.inner}>
        <Group>
          <Button p={0} onClick={() => router.push("/")} variant="transparent">
            <h1>Want</h1>
          </Button>
        </Group>
        <Autocomplete
          className={classes.search}
          placeholder="Search"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          data={[
            "React",
            "Angular",
            "Vue",
            "Next.js",
            "Riot.js",
            "Svelte",
            "Blitz.js",
          ]}
          visibleFrom="xs"
        />
        <Group>
          {user ? (
            <Group>
              <Button variant="subtle">
                <Stack p={20} justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Home</Text>
                </Stack>
              </Button>
              <Button variant="subtle">
                <Stack p={20} justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Messages</Text>
                </Stack>
              </Button>
              <Button variant="subtle">
                <Stack p={20} justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Posts</Text>
                </Stack>
              </Button>
              <Button variant="subtle">
                <Stack p={20} justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Notifications</Text>
                </Stack>
              </Button>
            </Group>
          ) : (
            <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
              <Login
                shouldOpen={openLoginModal}
                onModalClose={handleCloseLoginModal}
              />
            </Group>
          )}
          <Button variant="light" onClick={handleWant}>
            <Stack p={20} justify="center" align="center" gap={0}>
              <IconHome size={15} />
              <Text size="xs">Create</Text>
            </Stack>
          </Button>
        </Group>
      </div>
    </header>
  );
}
