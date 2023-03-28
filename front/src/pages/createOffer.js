import { useRouter } from 'next/router';
import { useState, useEffect,  } from 'react';

const CreateOffer = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
        const response = await fetch('http://localhost:4000/api/is-logged-in', {
            credentials: 'include',
        });

        if (!response.ok) {
            router.push('/login');
        }
    };

    checkLoggedIn();
}, []);

  useEffect(() => {
    const fetchPost = async () => {
      // Llama a la API para obtener el post por ID.
      const response = await fetch(`http://localhost:4000/api/posts/${postId}`);
      const data = await response.json();
      setPost(data);
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Preparar los datos de la oferta
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('photo', photo);
    formData.append('postId', postId);

    try {
      // Llama a la API para crear la oferta
      const response = await fetch('http://localhost:4000/api/create', {
        method: 'POST',
        headers: {
            Accept: 'application/json'
          },
          credentials: 'include',
          body: formData
      });      

      if (response.ok) {
        alert('Oferta creada exitosamente');
        router.push(`/post/${postId}`);
      } else {
        alert('Ocurrió un error al crear la oferta');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

if (!post) {
    return <p className="container mt-5">Cargando...</p>;
  }
  
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Título de la oferta</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Descripción de la oferta</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Precio ofrecido</label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              {price ? (
                <small className="form-text text-muted">Precio: {Number(price).toLocaleString()}</small>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Foto opcional</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creando oferta...' : 'Crear oferta'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="card">
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                className="card-img-top"
                alt="Vista previa"
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{title || "Título de la oferta"}</h5>
              <h5 className="text-success">{Number(price).toLocaleString()} USD</h5>
              <p className="card-text">{description || "Descripción de la oferta"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default CreateOffer;

