import React, { useState } from "react";
import {
  Avatar,
  Text,
  Button,
  Paper,
  Modal,
  Group,
  rem,
  Divider,
  Stack,
} from "@mantine/core";
import { environments } from "@/app/connections/environments/environments";
import { IconChevronRight, IconStarFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

interface User {
  createdAt: Date;
  reports: Array<any>;
  firstName: string;
  lastName: string;
  photo: string;
  totalPosts: number;
}

interface UserInfoModalProps {
  user: User;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ user }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const userSinceYear = new Date(user.createdAt).getFullYear();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`About ${user.firstName}`}
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Stack>
          <Avatar
            src={`${environments.BASE_URL}/${user.photo}`}
            size={120}
            radius={120}
            mx="auto"
          />
          <Text ta="center" fz="lg" fw={500}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Stack gap={5} align="center" justify="center">
            <Text ta="center" c="dimmed" fz="sm">
              {`Has made ${user.totalPosts} Posts`}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              User since {userSinceYear}
            </Text>
            <Group align="center" justify="center">
              <IconStarFilled />
              <Text fz="xl" ta="center">
                {user ? `${5 - user.reports.length * 0.3}` : ""}
              </Text>
            </Group>
          </Stack>
        </Stack>
      </Modal>

      <Button mt={20} size="sm" p={0} variant="transparent" onClick={open}>
        <Group gap={5}>
          <Avatar
            size="sm"
            src={`${environments.BASE_URL}/${user.photo}`}
            radius="xl"
          />

          <Text ml={5} size="sm" fw={500}>
            {`${user.firstName} ${user.lastName}`}
          </Text>

          <IconChevronRight
            style={{ width: rem(10), height: rem(10) }}
            stroke={3}
          />
        </Group>
      </Button>
    </>
  );
};

export default UserInfoModal;
