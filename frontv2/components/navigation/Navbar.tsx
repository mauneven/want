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
  IconPlus,
  IconBell,
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
      <div className={classes.inner}>
        <Group>
          <Button p={0} onClick={() => router.push("/")} variant="transparent">
            <h1>Want</h1>
          </Button>
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
          ]}
          visibleFrom="xs"
        />
        </Group>
        <Group>
          {user ? (
            <Group gap={0}>
              <Button variant="subtle">
                <Stack justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Home</Text>
                </Stack>
              </Button>
              <Button variant="subtle">
                <Stack justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Messages</Text>
                </Stack>
              </Button>
              <Button variant="subtle">
                <Stack justify="center" align="center" gap={0}>
                  <IconHome size={15} />
                  <Text size="xs">Posts</Text>
                </Stack>
              </Button>
              <Button variant="subtle">
                <Stack justify="center" align="center" gap={0}>
                  <IconBell size={15} />
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
              <Button variant="light" onClick={() => setOpenLoginModal(true)}>
                <Stack justify="center" align="center" gap={0}>
                  <IconUser size={15} />
                  <Text size="xs">Login / Register</Text>
                </Stack>
              </Button>
            </Group>
          )}
          <Button variant="light" onClick={handleWant}>
            <Stack justify="center" align="center" gap={0}>
              <IconPlus size={15} />
              <Text size="xs">Create</Text>
            </Stack>
          </Button>
        </Group>
        {user ? (
          <Menu
            shadow="md"
            width={200}
            offset={20}
            position="bottom-end"
            withArrow
            openDelay={100}
            closeDelay={100}
          >
            <Menu.Target>
              <UnstyledButton>
                <Avatar
                  src={
                    user?.photo
                      ? `${environments.BASE_URL}/${user?.photo}`
                      : null
                  }
                  alt="it's me"
                />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconUser style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => router.push("/account")}
              >
                Account
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconMessageCircle
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                Messages
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconList style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Posts
              </Menu.Item>
              <Flex
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
                align={"center"}
              >
                <ActionIcon
                  variant="transparent"
                  color="default"
                  size="md"
                  aria-label="Toggle color scheme"
                  p={5}
                  ml={6}
                >
                  <IconSun
                    className={(classes.icon, classes.light)}
                    stroke={1.2}
                  />
                  <IconMoon
                    className={(classes.icon, classes.dark)}
                    stroke={1.2}
                  />
                </ActionIcon>
                <Button
                  p={0}
                  justify="left"
                  variant="transparent"
                  color="default"
                >
                  <Text size="14">Change theme</Text>
                </Button>
              </Flex>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={
                  <IconLogout
                    style={{
                      width: rem(14),
                      height: rem(14),
                      marginLeft: rem(3),
                    }}
                  />
                }
                onClick={open}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : null}
      </div>
    </header>
  );
}
