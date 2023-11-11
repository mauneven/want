'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import endpoints from '@/app/connections/enpoints/endpoints';
import { Flex, NumberInput, Paper, TextInput, Title, Text, Textarea, Button, Tooltip } from '@mantine/core';
import PostLocation from '@/components/update/PostLocation';
import { PhotoDropzone } from '@/components/update/PhotoDropzone';
import CategoryModal from '@/components/update/CategoryModal';
import { FileWithPath } from '@mantine/dropzone';

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
  const [photoOrder, setPhotoOrder] = useState<number[]>([]);
  const [initialLatitude, setInitialLatitude] = useState<number | null>(null);
  const [initialLongitude, setInitialLongitude] = useState<number | null>(null);
  const [initialCategory, setInitialCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: { en: string };
  } | null>(null);

  const [post, setPost] = useState({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    mainCategory: '',
    price: 0,
    deletedImages: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${endpoints.getPost}/${id}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
        setTitle(data.title || "");
        setPrice(data.price.toString() || "");
        setDescription(data.description || "");
        setInitialLatitude(Number(data.latitude) || null);
        setInitialLongitude(Number(data.longitude) || null);
        setInitialCategory(data.mainCategory || "");
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, location]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    console.log("la localizacion es", lat, lng)
  };

  const handleSelectCategory = (category: {
    id: string;
    name: { en: string };
  }) => {
    setSelectedCategory(category);
    console.log("la categoria es", category.id)
  };

  const handleUploadPhotos = (photos: FileWithPath[]) => {
    setUploadedPhotos(photos);
    const newOrder = Array.from({ length: 4 }, (_, i) => i).filter(
      (index) => uploadedPhotos[index] || photos[index]
    );
    setPhotoOrder(newOrder);
  };

  const isDataValid = !!title && !!price && !!selectedCategory && !!location;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${endpoints.updatePost}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Error updating post');
      }

      router.push(`/posts/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  let tooltipMessage = isDataValid
    ? "Click to post your request"
    : "You need to complete: ";

  const missingFields = [];
  if (!title) missingFields.push("Title");
  if (!price) missingFields.push("Price");
  if (!selectedCategory) missingFields.push("Category");
  if (!location) missingFields.push("Location");

  if (missingFields.length === 1) {
    tooltipMessage += missingFields[0];
  } else if (missingFields.length > 1) {
    tooltipMessage += missingFields.join(", ");
  }

  return (
    <>
      <Button variant="light">Volver a mi perfil</Button>
      <Paper shadow="xl" mt={"5"} p={20} maw={700} mx="auto" withBorder radius={"md"}>
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
        <PhotoDropzone onUploadPhotos={handleUploadPhotos} />
        {isDataValid ? (
          <Button
            mt={20}
            variant="light"
            fullWidth
            type="submit"
            disabled={!isDataValid}
          >
            Post what I want!
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