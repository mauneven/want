import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      <div className="row">
        <div className="col-lg-6">
          <img
            src={`http://localhost:4000/${post.photo}`}
            className="card-img-top"
            alt={post.title}
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>
        <div className="col-lg-6">
          <h1 className="mb-4">{post.title}</h1>
          <h5>{post.description}</h5>
          <p><strong>Precio: </strong>{post.price} USD</p>
          <p><strong>País: </strong>{post.country}</p>
          <p><strong>Estado: </strong>{post.state}</p>
          <p><strong>Ciudad: </strong>{post.city}</p>
          <p><strong>Categoría principal: </strong>{post.mainCategory}</p>
          <p><strong>Subcategoría: </strong>{post.subCategory}</p>
          {/* Agrega aquí más campos si es necesario */}
          <Link href={`/createOffer?postId=${id}`}>
            <button className="btn btn-primary mt-3">Ofertar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
