'use client'

import { use, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import endpoints from '@/app/connections/enpoints/endpoints';

const UpdatePost = () => {
  const router = useRouter();
  const searchParams = useParams();
  const id = searchParams.id;

  console.log("el id es", id)

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
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

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

  return (
    <div>
      <h1>Update Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={post.description}
          />
        </div>
        <div>
          <label>Latitude</label>
          <input
            type="number"
            name="latitude"
            value={post.latitude}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Longitude</label>
          <input
            type="number"
            name="longitude"
            value={post.longitude}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Main Category</label>
          <input
            type="text"
            name="mainCategory"
            value={post.mainCategory}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={post.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Deleted Images</label>
          <input
            type="text"
            name="deletedImages"
            value={post.deletedImages}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePost;