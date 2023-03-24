import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      // Llama a la API para obtener el post por ID.
      const response = await fetch(`http://localhost:4000/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (!post) {
    return <p className="container mt-5">Cargando...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{post.title}</h1>
      <h5>{post.description}</h5>
      <p>País: {post.country}</p>
      <p>Estado: {post.state}</p>
      <p>Ciudad: {post.city}</p>
      <p>Categoría principal: {post.mainCategory}</p>
      <p>Subcategoría: {post.subCategory}</p>
      {/* Agrega aquí más campos si es necesario */}
    </div>
  );
};

export default PostDetails;
