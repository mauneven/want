"use client";

import {
  Autocomplete,
  Group,
  Burger,
  rem,
  Menu,
  Avatar,
  Modal,
  Text,
  Button
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconMessageCircle,
  IconLogout,
  IconList,
  IconUser,
} from "@tabler/icons-react";
import classes from "./HeaderSearch.module.css";
import { useEffect, useState } from "react";
import endpoints from "@/app/connections/enpoints/endpoints";
import { useRouter } from "next/navigation";
import Login from "../login/Login";

interface User {
  photo?: string;
  [key: string]: any;
}

const links = [{ link: "/login", label: "Login" }];

export function HeaderSearch() {
  const [user, setUser] = useState<User | null>(null);
  const [openedModal, { open, close }] = useDisclosure(false);
  const router = useRouter();

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
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('user');
      } else {
        console.error('Error log out:', response.status, response.statusText);
      }

      // Redirigimos a la página principal
      window.location.replace('/');
    } catch (error) {
      console.error('Error log out', error);
    }
  };

  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

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
        <Text>You will have to login again if you Want to use your account</Text>
        <Group><Button onClick={logout}>Logout</Button></Group>
      </Modal>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          Want
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
            <Menu
              shadow="md"
              width={200}
              offset={20}
              position="bottom-end"
              withArrow
              trigger="hover"
              openDelay={100}
              closeDelay={100}
            >
              <Menu.Target>
                <Avatar
                  src={user.photo ? `https://want.com.co/${user.photo}` : null}
                  alt="it's me"
                />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Profile
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
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={open}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
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
