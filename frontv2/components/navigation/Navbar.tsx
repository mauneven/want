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
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { useEffect, useState } from "react";
import endpoints from "@/app/connections/enpoints/endpoints";
import { environments } from "@/app/connections/environments/environments";
import { useRouter } from "next/navigation";
import Login from "../login/Login";

interface User {
  photo?: string;
  [key: string]: any;
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [openedModal, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(endpoints.user, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
          console.log("si ves esto 2 veces es normal en DEV", data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "light");
    }

    checkSession();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(endpoints.logout, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
      } else {
        console.error("Error log out:", response.status, response.statusText);
      }

      window.location.replace("/");
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
            gradient={{ from: 'red', to: 'orange', deg: 90 }}
            color="red"
            fullWidth
            justify="center"
            onClick={logout}>Logout</Button>
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
            <>
            <Button variant="light" onClick={() => router.push("/new")}>I Want Something!</Button>
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
                    src={user.photo ? `${environments.BASE_URL}/${user?.photo}` : null}
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
                  <Button p={0} justify="left" variant="transparent" color="default" >
                    <Text size="14">Change theme</Text>
                  </Button>
                </Flex>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14), marginLeft: rem(3) }} />
                  }
                  onClick={open}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            </>
          ) : (
            <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
              <Login />
            </Group>
          )}
        </Group>
      </div>
    </header>
  );
}
