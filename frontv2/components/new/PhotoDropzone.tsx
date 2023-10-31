import React, { useState } from 'react';
import { Group, Text, rem, Image, SimpleGrid, ActionIcon } from '@mantine/core';
import { IconCloudUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, MIME_TYPES, FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export function PhotoDropzone(props: Partial<DropzoneProps>) {
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index} style={{ position: 'relative' }}>
        <Image
          src={imageUrl}
          alt={`Preview ${index}`}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          width={160}
          height={160}
          style={{ marginRight: '10px', marginBottom: '10px' }}
        />
        <ActionIcon
          size="md"
          radius="xl"
          variant="gradient"
          gradient={{ from: 'red', to: 'orange', deg: 90 }}
          style={{ position: 'absolute', top: 5, right: 5 }}
          onClick={() => removeFile(index)}
        >
          <IconX />
        </ActionIcon>
      </div>
    );
  });

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    const availableSlots = 4 - files.length;
    const filesToAdd = acceptedFiles.slice(0, availableSlots);

    if (filesToAdd.length < acceptedFiles.length) {
      notifications.show({
        title: 'Attention',
        message: 'Only a maximum of 4 photos are allowed. Extra photos have been ignored.',
        color: 'red'
      });
    }

    setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
  };

  return (
    <>
      {files.length <= 3 && ( 
        <Dropzone
          onDrop={handleDrop}
          maxSize={3 * 1024 ** 2}
          accept={[MIME_TYPES.jpeg, MIME_TYPES.webp, MIME_TYPES.png]}
          {...props}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconCloudUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
      <SimpleGrid cols={2} mt={20}>
        {previews}
      </SimpleGrid>
    </>
  );
}
