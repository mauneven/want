import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Box,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Login() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Box maw={340} mx="auto">
          <TextInput
            mt="md"
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />

          <Group justify="center" mt="xl">
            <Button variant="outline">Login</Button>
          </Group>
        </Box>
      </Modal>

      <Button onClick={open}>Login</Button>
    </>
  );
}
