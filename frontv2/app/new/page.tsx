"use client";

import React, { useState } from "react";
import {
  Button,
  TextInput,
  NumberInput,
  Title,
  Textarea,
  Paper,
  Text,
  Flex
} from "@mantine/core";
import "@mantine/dropzone/styles.css";
import CateogoryModal from "@/components/new/CategoryModal";
import { PhotoDropzone } from "@/components/new/PhotoDropzone";
import PostLocation from "@/components/new/PostLocation";

const New = () => {
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: { en: string } } | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSelectCategory = (category: { id: string; name: { en: string } }) => {
    setSelectedCategory(category);
  };

  return (
    <Paper shadow="xl" p={20} maw={700} mx="auto" withBorder radius={"md"}>
      <Title ta="center" size="h2">
        {"Post what you Want !"}
      </Title>
      <TextInput
        label="Title"
        placeholder="Give a title to what you Want"
        withAsterisk
        mt="md"
      />
      <NumberInput
        label="Price"
        placeholder="How much would you pay for what you Want?"
        prefix="$ "
        thousandSeparator=","
        withAsterisk
        mt="md"
      />
      <CateogoryModal onSelectCategory={handleSelectCategory} selectedCategoryName={selectedCategory?.name.en ?? null}/>
      <Flex mt={10}>
      <Text fw={500} size="sm">Location</Text><Text ml={5} size="md" c={"red"}>*</Text>
      </Flex>
      <PostLocation onLocationSelect={handleLocationSelect} />
      <Textarea
        mb={20}
        size="sm"
        label="Description"
        autosize
        minRows={4}
        maxRows={8}
        placeholder="Discribe what you Want"
      />
      <Text fw={500} mb={4} size="sm">Add upto 4 photos if you Want</Text>
      <PhotoDropzone/>
      <Button mt={20} variant="light" fullWidth type="submit">
        Post what i want!
      </Button>
    </Paper>
  );
};

export default New;