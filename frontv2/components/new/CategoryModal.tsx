import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Card,
  Text,
  SimpleGrid,
  UnstyledButton,
  Anchor,
  Group,
  useMantineTheme,
} from "@mantine/core";
import classes from "./categoryModal.module.css";
import categoriesData from "@/data/categories.json"; // Importa el JSON

export default function CategoryModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const items = categoriesData.categories.map((category) => (
    <UnstyledButton key={category.id} className={classes.item}>
      <Text size="xs" mt={7}>
        {category.name.en}
      </Text>
    </UnstyledButton>
  ));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        title="Select a category"
      >
        <Card withBorder radius="md" className={classes.card}>
          <Group justify="space-between">
            <Text className={classes.title}>Categories</Text>
            <Anchor size="xs" c="dimmed" style={{ lineHeight: 1 }}>
              + 21 other services
            </Anchor>
          </Group>
          <SimpleGrid cols={3} mt="md">
            {items}
          </SimpleGrid>
        </Card>
      </Modal>

      <Button variant="light" mt={20} onClick={open}>
        Select a Category
      </Button>
    </>
  );
}