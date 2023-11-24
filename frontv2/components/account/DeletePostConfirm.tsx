import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { environments } from "@/app/connections/environments/environments";

interface DeletePostConfirmProps {
  postId: string;
  onDelete: () => void;
}

export default function DeletePostConfirm({
  postId,
  onDelete,
}: Readonly<DeletePostConfirmProps>) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${environments.BASE_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }

      close();
      onDelete();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Confirm Delete">
        Are you sure you want to delete this post?
        <Button variant="light" color="red" onClick={handleDelete}>Yes, delete the post</Button>
      </Modal>

      <Button variant="light" color="red" onClick={open}>
        Delete Post
      </Button>
    </>
  );
}
