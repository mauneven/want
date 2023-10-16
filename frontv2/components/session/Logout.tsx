import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text } from '@mantine/core';

export default function Logout() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Sure you want to logout?"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        content
      </Modal>

      <Text onClick={open}>Logout</Text>
    </>
  );
}