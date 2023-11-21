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
import { useEffect, useState } from "react";

interface CategoryModalProps {
  onSelectCategory: (category: { id: string; name: { en: string } }) => void;
  initialCategory: string | null;
}

export default function CategoryModal({
  onSelectCategory,
  initialCategory,
}: CategoryModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (initialCategory) {
      const category = categoriesData.categories.find(cat => cat.id === initialCategory);
      if (category) {
        setCategoryName(category.name.en);
      }
    }
  }, [initialCategory]);

  const handleSelectCategory = (category: {
    id: string;
    name: { en: string };
  }) => {
    onSelectCategory(category);
    setCategoryName(category.name.en);
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
        {categoryName || "Select a Category"}
      </Button>
    </>
  );
}
