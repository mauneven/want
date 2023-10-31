import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Card,
  Text,
  SimpleGrid,
  UnstyledButton,
  Flex,
} from "@mantine/core";
import classes from "./styles/categoryModal.module.css";
import categoriesData from "@/data/categories.json";
import Image from "next/image";
import "./styles/icons.css"

interface CategoryModalProps {
  onSelectCategory: (category: { id: string; name: { en: string } }) => void;
  selectedCategoryName: string | null;
}

export default function CategoryModal({
  onSelectCategory,
  selectedCategoryName,
}: CategoryModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleSelectCategory = (category: {
    id: string;
    name: { en: string };
  }) => {
    onSelectCategory(category);
    close();
  };

  const items = categoriesData.categories.map((category) => (
    <UnstyledButton
      key={category.id}
      className={classes.item}
      onClick={() => handleSelectCategory(category)}
    >
      <Image
        src={category.icon}
        alt={category.name.en}
        width={48}
        height={48}
        className="category-icon"
      />
      <Text size="xs" fw="xl" mt={7}>
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
          <SimpleGrid cols={3} mt="md">
            {items}
          </SimpleGrid>
        </Card>
      </Modal>

      <Flex mt={20}>
        <Text fw={500} size="sm">
          Category
        </Text>
        <Text ml={5} size="md" c={"red"}>
          *
        </Text>
      </Flex>

      <Button variant="light" mt={4} onClick={open}>
        {selectedCategoryName ?? "Select a Category"}
      </Button>
    </>
  );
}
