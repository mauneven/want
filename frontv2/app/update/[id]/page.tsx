"use client"

import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  NumberInput,
  Title,
  Textarea,
  Paper,
  Text,
  Flex,
} from "@mantine/core";
import CateogoryModal from "@/components/new/CategoryModal";
import { PhotoDropzone } from "@/components/new/PhotoDropzone";
import PostLocation from "@/components/new/PostLocation";
import { FileWithPath } from "@mantine/dropzone";
import endpoints from "@/app/connections/enpoints/endpoints";

const Update = () => {
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
  const [postId, setPostId] = useState<string | null>(null); // Add postId state

  // Fetch post data based on the postId when the component mounts
  useEffect(() => {
    // You can fetch the post data using postId from the URL
    const postIdFromURL = window.location.pathname.split("/").pop();
    setPostId(postIdFromURL);

    // Use postId to fetch the post data and populate the form fields
    // You can make a fetch request to the backend to get the post data
    // and populate the form fields with the fetched data
    if (postIdFromURL) {
      // Fetch the post data based on postIdFromURL and populate the form fields
      // Example:
      // fetch(`${endpoints.getPost}/${postIdFromURL}`)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     setTitle(data.title);
      //     setPrice(data.price);
      //     setDescription(data.description);
      //     // Set other fields as needed
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching post data: ", error);
      //   });
    }
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSelectCategory = (category: {
    id: string;
    name: { en: string };
  }) => {
    setSelectedCategory(category);
  };

  const handleUploadPhotos = (photos: FileWithPath[]) => {
    setUploadedPhotos(photos);
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
          formData.append(
            "photos[]",
            uploadedPhotos[index],
            uploadedPhotos[index].name
          );
        }
      }

      const response = await fetch(`${endpoints.updatePost}/${postId}`, {
        method: "PUT", // Use the appropriate HTTP method for updating a post
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        console.log("The post was updated successfully");
      } else {
        console.error("Error updating the post");
      }
    } catch (error) {
      console.error("Error updating the post:", error);
    }
  };

  return (
    <Paper shadow="xl" p={20} maw={700} mx="auto" withBorder radius={"md"}>
      <Title ta="center" size="h2">
        {"Update Post"}
      </Title>
      <TextInput
        label="Title"
        placeholder="Give a title to your post"
        withAsterisk
        mt="md"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <NumberInput
        label="Price"
        placeholder="Enter the price"
        prefix="$ "
        thousandSeparator=","
        withAsterisk
        mt="md"
        value={price.toString()}
        onChange={(value) => setPrice(value.toString())}
      />
      <CateogoryModal
        onSelectCategory={handleSelectCategory}
        selectedCategoryName={selectedCategory?.name.en ?? null}
      />
      <Flex mt={10}>
        <Text fw={500} size="sm">
          Location
        </Text>
        <Text ml={5} size="md" c={"red"}>
          *
        </Text>
      </Flex>
      <PostLocation onLocationSelect={handleLocationSelect} />
      <Textarea
        mb={20}
        size="sm"
        label="Description"
        autosize
        minRows={4}
        maxRows={8}
        placeholder="Describe your post"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <Text fw={500} mb={4} size="sm">
        Add up to 4 photos
      </Text>
      <PhotoDropzone onUploadPhotos={handleUploadPhotos} />
      <Button
        mt={20}
        variant="light"
        fullWidth
        type="submit"
        onClick={handlePostSubmit}
      >
        Update Post
      </Button>
    </Paper>
  );
};

export default Update;