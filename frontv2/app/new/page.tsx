"use client"
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
import { FileWithPath } from '@mantine/dropzone';
import endpoints from "../connections/enpoints/endpoints";

const New = () => {
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: { en: string };
  } | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [photoOrder, setPhotoOrder] = useState<number[]>([]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSelectCategory = (category: { id: string; name: { en: string } }) => {
    setSelectedCategory(category);
  };

  const handleUploadPhotos = (photos: FileWithPath[]) => {
    setUploadedPhotos(photos);
    // Generar un nuevo orden para las fotos (0, 1, 2, 3) si se seleccionan fotos nuevas
    const newOrder = Array.from({ length: 4 }, (_, i) => i).filter(
      (index) => uploadedPhotos[index] || photos[index]
    );
    setPhotoOrder(newOrder);
  };

  const handlePostSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", location?.lat.toString() ?? "");
      formData.append("longitude", location?.lng.toString() ?? "");
      formData.append("mainCategory", selectedCategory?.id ?? "");
      formData.append("price", price);

      for (let i = 0; i < photoOrder.length; i++) {
        const index = photoOrder[i];
        if (uploadedPhotos[index]) {
          formData.append("photos[]", uploadedPhotos[index], uploadedPhotos[index].name);
        }
      }

      const response = await fetch(endpoints.createPost, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        // Puedes realizar alguna acción o redirección aquí si es necesario
        console.log("El post se creó exitosamente");
      } else {
        // Manejar errores si es necesario
        console.error("Error al crear el post");
      }
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
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
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <NumberInput
        label="Price"
        placeholder="How much would you pay for what you Want?"
        prefix="$ "
        thousandSeparator=","
        withAsterisk
        mt="md"
        value={price}
        onChange={(value) => setPrice(value)}
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
        placeholder="Describe what you Want"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <Text fw={500} mb={4} size="sm">Add up to 4 photos if you Want</Text>
      <PhotoDropzone onUploadPhotos={handleUploadPhotos} />
      <Button mt={20} variant="light" fullWidth type="submit" onClick={handlePostSubmit}>
        Post what I want!
      </Button>
    </Paper>
  );
};

export default New;