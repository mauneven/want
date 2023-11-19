"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import endpoints from "@/app/connections/enpoints/endpoints";
import {
  Flex,
  NumberInput,
  Paper,
  TextInput,
  Title,
  Text,
  Textarea,
  Button,
  Tooltip,
} from "@mantine/core";
import PostLocation from "@/components/update/PostLocation";
import { PhotoDropzone } from "@/components/update/PhotoDropzone";
import CategoryModal from "@/components/update/CategoryModal";
import { FileWithPath } from "@mantine/dropzone";
import { environments } from "@/app/connections/environments/environments";

interface ImageFile {
  file: FileWithPath | string;
  id: string;
  isNew?: boolean;
}

const UpdatePost = () => {
  const router = useRouter();
  const searchParams = useParams();
  const id = searchParams.id;
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [photoOrder, setPhotoOrder] = useState<string[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [initialLatitude, setInitialLatitude] = useState<number | null>(null);
  const [initialLongitude, setInitialLongitude] = useState<number | null>(null);
  const [initialCategory, setInitialCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: { en: string };
  } | null>(null);

  const [post, setPost] = useState({
    title: "",
    description: "",
    latitude: 0,
    longitude: 0,
    mainCategory: "",
    price: 0,
    deletedImages: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${endpoints.getPost}/${id}`);
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data = await response.json();
        setPost(data);
        setTitle(data.title || "");
        setPrice(data.price.toString() || "");
        setDescription(data.description || "");
        setInitialLatitude(Number(data.latitude) || null);
        setInitialLongitude(Number(data.longitude) || null);
        const initialImageUrls = data.photos.map(
          (photo: any) => `${environments.BASE_URL}/${photo}`
        );
        setInitialImages(initialImageUrls);
        setInitialCategory(data.mainCategory || "");
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    console.log("la localizacion es", lat, lng);
  };

  const handleSelectCategory = (category: {
    id: string;
    name: { en: string };
  }) => {
    setSelectedCategory(category);
    console.log("la categoria es", category.id);
  };

  const handleUploadPhotos = (photos: FileWithPath[], deleted: string[]) => {
    setUploadedPhotos(photos);
    setDeletedPhotos(deleted);
    const newOrder = photos.map((_, index) => `new-${index}`); // Generar IDs para nuevas fotos
    setPhotoOrder([
      ...initialImages.map((_, index) => `initial-${index}`),
      ...newOrder,
    ]);
  };

  const handlePhotoOrderChange = (newOrder: ImageFile[]) => {
    const order = newOrder.map((file) => file.id);
    setPhotoOrder(order);
  };

  const isDataValid =
    !!title &&
    !!price &&
    (selectedCategory
      ? selectedCategory.id !== post.mainCategory
      : !!initialCategory) &&
    (location
      ? location.lat !== initialLatitude || location.lng !== initialLongitude
      : initialLatitude !== null && initialLongitude !== null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "latitude",
      location
        ? location.lat.toString()
        : initialLatitude
        ? initialLatitude.toString()
        : ""
    );
    formData.append(
      "longitude",
      location
        ? location.lng.toString()
        : initialLongitude
        ? initialLongitude.toString()
        : ""
    );
    formData.append(
      "mainCategory",
      selectedCategory ? selectedCategory.id : initialCategory
    );
    formData.append("price", price);
    formData.append("deletedImages", deletedPhotos.join(","));

    photoOrder.forEach((photoId) => {
      let file;
      if (photoId.startsWith("new-")) {
        const index = parseInt(photoId.split("-")[1]);
        file = uploadedPhotos[index];
      }
      if (file && file instanceof File) {
        formData.append("photos[]", file, file.name);
      }
    });

    try {
      const response = await fetch(`${endpoints.updatePost}/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error updating post");
      }

      router.push("/account");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let tooltipMessage = isDataValid
    ? "Click to post your request"
    : "You need to complete: ";

  const missingFields = [];
  if (!title) missingFields.push("Title");
  if (!price) missingFields.push("Price");

  if (missingFields.length === 1) {
    tooltipMessage += missingFields[0];
  } else if (missingFields.length > 1) {
    tooltipMessage += missingFields.join(", ");
  }

  return (
    <>
      <Button variant="light">Volver a mi perfil</Button>
      <Paper
        shadow="xl"
        mt={"5"}
        p={20}
        maw={700}
        mx="auto"
        withBorder
        radius={"md"}
      >
        <Title ta="center" size="h2">
          {"Update what you Want !"}
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
          value={price.toString()}
          onChange={(value) => setPrice(value.toString())}
        />
        <CategoryModal
          onSelectCategory={handleSelectCategory}
          initialCategory={initialCategory ?? undefined}
        />
        <Flex mt={10}>
          <Text fw={500} size="sm">
            Location
          </Text>
          <Text ml={5} size="md" c={"red"}>
            *
          </Text>
        </Flex>
        <PostLocation
          onLocationSelect={handleLocationSelect}
          initialLatitude={initialLatitude ?? undefined}
          initialLongitude={initialLongitude ?? undefined}
        />
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
        <Text fw={500} mb={4} size="sm">
          Add up to 4 photos if you Want
        </Text>
        <PhotoDropzone
          onUploadPhotos={handleUploadPhotos}
          initialImages={initialImages ?? null}
          onOrderChange={handlePhotoOrderChange}
          deletedPhotos={deletedPhotos}
        />
        {isDataValid ? (
          <Button
            mt={20}
            variant="light"
            fullWidth
            type="submit"
            disabled={!isDataValid}
            onClick={handleSubmit}
          >
            Update what I want!
          </Button>
        ) : (
          <Tooltip label={tooltipMessage}>
            <Button mt={20} variant="light" fullWidth disabled={!isDataValid}>
              Update what I want!
            </Button>
          </Tooltip>
        )}
      </Paper>
    </>
  );
};

export default UpdatePost;
