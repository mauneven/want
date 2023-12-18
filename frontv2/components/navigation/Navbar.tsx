"use client";

import {
  Autocomplete,
  Group,
  rem,
  Menu,
  Avatar,
  Text,
  Button,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Flex,
  UnstyledButton,
  Stack,
} from "@mantine/core";
import {
  IconSearch,
  IconLogout,
  IconUser,
  IconSun,
  IconMoon,
  IconHome,
  IconPlus,
  IconBell,
  IconMessage2,
  IconLayoutGrid,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Login from "../login/Login";
import { UseUserContext } from "../provider/UserContext";
import { environments } from "@/app/connections/environments/environments";

interface User {
  photo?: string;
  [key: string]: any;
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
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
      <Login shouldOpen={openLoginModal} onModalClose={handleCloseLoginModal} />
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
            data={["React"]}
            visibleFrom="xs"
          />
        </Group>
        <Group>
          {user ? (
            <Group gap={15}>
              <Button
                variant={pathname === "/" ? "light" : "subtle"}
                onClick={() => router.push("/")}
              >
                <Stack
                  justify="center"
                  onClick={() => router.push("/")}
                  align="center"
                  gap={0}
                >
                  <IconHome size={15} />
                  <Text size="xs">Home</Text>
                </Stack>
              </Button>
              <Button
                variant={pathname === "/chats" ? "light" : "subtle"}
                onClick={() => router.push("/chats")}
              >
                <Stack justify="center" align="center" gap={0}>
                  <IconMessage2 size={15} />
                  <Text size="xs">Messages</Text>
                </Stack>
              </Button>
              <Button
                variant={pathname === "/myposts" ? "light" : "subtle"}
                onClick={() => router.push("/myposts")}
              >
                <Stack
                  justify="center"
                  onClick={() => router.push("/myposts")}
                  align="center"
                  gap={0}
                >
                  <IconLayoutGrid size={15} />
                  <Text size="xs">Posts</Text>
                </Stack>
              </Button>
              <Button
                variant={pathname === "/notifications" ? "light" : "subtle"}
                onClick={() => router.push("/notifications")}
              >
                <Stack justify="center" align="center" gap={0}>
                  <IconBell size={15} />
                  <Text size="xs">Notifications</Text>
                </Stack>
              </Button>
            </Group>
          ) : null}
          <Button
            variant={pathname === "/new" ? "light" : "subtle"}
            onClick={handleWant}
          >
            <Stack justify="center" align="center" gap={0}>
              <IconPlus size={15} />
              <Text size="xs">Create</Text>
            </Stack>
          </Button>

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
              {user ? (
                <Menu.Item
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => router.push("/account")}
                >
                  Account
                </Menu.Item>
              ) : (
                <>
                  <Menu.Item
                    leftSection={
                      <IconUser style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={handleOpenLoginModal}
                  >
                    Login / Register
                  </Menu.Item>
                </>
              )}

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
              {user ? (
                <>
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
                  >
                    Logout
                  </Menu.Item>
                </>
              ) : null}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </header>
  );
}
