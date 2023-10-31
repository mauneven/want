"use client";

import React from "react";
import {
  Button,
  TextInput,
  NumberInput,
  Title,
  Textarea,
  Paper,
} from "@mantine/core";
import "@mantine/dropzone/styles.css";
import CateogoryModal from "@/components/new/CategoryModal";
import { PhotoDropzone } from "@/components/new/PhotoDropzone";
import PostLocation from "@/components/new/PostLocation";

const New = () => {

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
      <CateogoryModal />
      <Textarea
        pt={10}
        size="sm"
        label="Description"
        autosize
        minRows={4}
        maxRows={8}
        placeholder="Discribe what you Want"
      />
      <PostLocation/>
      <PhotoDropzone/>
      <Button mt={20} variant="light" w={100} type="submit">
        Submit
      </Button>
    </Paper>
  );
};

export default New;