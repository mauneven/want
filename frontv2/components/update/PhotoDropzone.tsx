import React, { useState, useEffect } from "react";
import { Group, Text, rem, Image, ActionIcon, Flex } from "@mantine/core";
import { IconCloudUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import "@mantine/notifications/styles.css";

interface PhotoDropzoneProps {
  onUploadPhotos: (photos: FileWithPath[], deleted: string[]) => void;
  initialImages: string[];
  deletedPhotos: string[];
}

interface ImageFile {
  file: FileWithPath | string;
  id: string;
  isNew?: boolean;
}

export function PhotoDropzone(props: Readonly<PhotoDropzoneProps>) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (props.initialImages && props.initialImages.length > 0) {
      const initialFiles = props.initialImages.map((url) => ({
        file: url,
        id: `initial-${url}`,
      }));
      setFiles(initialFiles);
    }
  }, [props.initialImages]);

  const removeFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    const deletedPhoto = files.find((file) => file.id === fileId);
    if (deletedPhoto && typeof deletedPhoto.file !== "string") {
      props.onUploadPhotos(
        files
          .filter((file) => file.id !== fileId && typeof file.file !== "string")
          .map((file) => file.file as FileWithPath),
        [...props.deletedPhotos, (deletedPhoto.file as FileWithPath).name]
      );
    }
  };

  const updateFilesOrder = (newFilesOrder: ImageFile[]) => {
    setFiles(newFilesOrder);
    props.onUploadPhotos(
      newFilesOrder
        .filter((fileWithId) => typeof fileWithId.file !== "string")
        .map((fileWithId) => fileWithId.file as FileWithPath),
      props.deletedPhotos
    );
  };

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    const availableSlots = 4 - files.length;
    const filesToAdd = acceptedFiles.slice(0, availableSlots).map((file) => ({
      file,
      id: `file-${Date.now()}-${file.name}`,
      isNew: true,
    }));

    if (filesToAdd.length < acceptedFiles.length) {
      notifications.show({
        title: "Attention",
        message:
          "Only a maximum of 4 photos are allowed. Extra photos have been ignored.",
        color: "red",
      });
    }

    updateFilesOrder([...files, ...filesToAdd]);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateFilesOrder(items);
  };

  return (
    <>
      {isBrowser && files.length < 4 && (
        <Dropzone
          onDrop={handleDrop}
          maxSize={3 * 1024 ** 2}
          accept={[MIME_TYPES.jpeg, MIME_TYPES.webp, MIME_TYPES.png]}
          {...props}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconCloudUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-blue-6)",
                }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-red-6)",
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dropzone" direction="horizontal">
          {(provided) => (
            <Flex
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: "flex",
                justifyContent: "left",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {files.map((fileWithId, index) => {
                const imageUrl =
                  typeof fileWithId.file === "string"
                    ? fileWithId.file
                    : fileWithId.file instanceof File
                    ? URL.createObjectURL(fileWithId.file)
                    : "";

                return (
                  <Draggable
                    key={fileWithId.id}
                    draggableId={fileWithId.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          position: "relative",
                          width: "160px",
                          height: "160px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Image src={imageUrl} alt={`Preview ${index}`}                           width={160}
                          height={160} />
                        <ActionIcon
                          size="md"
                          radius="xl"
                          variant="gradient"
                          gradient={{ from: "red", to: "orange", deg: 90 }}
                          style={{ position: "absolute", top: 5, right: 5 }}
                          onClick={() => removeFile(fileWithId.id)}
                        >
                          <IconX />
                        </ActionIcon>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
