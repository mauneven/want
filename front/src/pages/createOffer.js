import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import WordsFilter from '@/badWordsFilter/WordsFilter';
import { Carousel } from 'react-bootstrap';
import { validations } from '@/utils/validations';

const CreateOffer = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);

  const getActivePhotoIndex = () => {
    const activeItem = document.querySelector(".carousel-item.active");
    return activeItem ? parseInt(activeItem.dataset.index) : -1;
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  useEffect(() => {
    validations(router); 
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      // Llama a la API para obtener el post por ID.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`);
      const data = await response.json();
      setPost(data);
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const bwf = new WordsFilter();

  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
  
    const isFileSizeValid = newPhotos.every((photo) => photo.size <= 50000000);
  
    if (!isFileSizeValid) {
      alert("The file size exceeds the maximum allowed limit of 50MB.");
      return;
    }
  
    const isFileTypeValid = newPhotos.every((photo) => {
      const extension = photo.name.split(".").pop();
      return ["jpg", "jpeg", "png"].includes(extension.toLowerCase());
    });
  
    if (!isFileTypeValid) {
      alert("Only JPEG, JPG, and PNG files are allowed.");
      return;
    }
  
    setPhotos([...photos, ...newPhotos]);
  };  

  const handleDeletePhoto = (e) => {
    const activeIndex = getActivePhotoIndex();
    if (activeIndex !== -1) {
      removePhoto(activeIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (bwf.containsBadWord(title)) {
      alert(`you wrote a bad word in the title: ${bwf.devolverPalabra(title)}`);
      setIsSubmitting(false);
      return;
    }

    if (bwf.containsBadWord(description)) {
      alert(`you wrote a bad word in the description: ${bwf.devolverPalabra(description)}`);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('contact', contact);
    if (photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        formData.append("photos[]", photos[i]);
      }
    }
    formData.append('postId', postId);

    try {
      // Llama a la API para crear la oferta
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        alert('Offer created');
        router.push(`/post/${postId}`);
      } else {
        alert('There was an error, try again later or change the photos');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <p className="container mt-5">Loading...</p>;
  }

  return (
    <div className="container mt-4 mb-4">
      <h1 className='mt-3 mb-3'>Create an offer</h1>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Offert title</label>
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
              <label htmlFor="description" className="form-label">Describe your offer</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">How can this person contact you?</label>
              <textarea
                className="form-control"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price you offer</label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              {price ? (
                <small className="form-text text-muted">Price: {Number(price).toLocaleString()}</small>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Upload upto 4 photos</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={photos.length >= 4}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary position-relative">
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creando oferta...
                </>
              ) : (
                "Crear oferta"
              )}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="post rounded-5 card-preview card">
            {photos.length > 0 && (
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {photos.map((photo, index) => (
                    <div key={index} data-index={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                      <img src={URL.createObjectURL(photo)} className="d-block w-100" alt={`Photo ${index}`} />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            )}
            {photos.length > 0 && (
              <button className="btn btn-danger btn-sm delete-photo" onClick={handleDeletePhoto}>
                <i className="bi bi-trash"></i>
              </button>
            )}
            <div className="card-body">
              <h5 className="card-title">{title || "Título de la oferta"}</h5>
              <h5 className="text-success">{Number(price).toLocaleString()}</h5>
              <p className="card-text">{description || "Descripción de la oferta"}</p>
              <p className="card-text">{contact || "Contacto"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default CreateOffer;