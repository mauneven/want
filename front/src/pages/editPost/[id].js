import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Location from '@/components/locations/Location';
import PostCategory from '@/components/categories/Categories';
import { Carousel } from 'react-bootstrap';
import { validations } from '@/utils/validations';

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [photos, setPhotos] = useState([]);
  const [price, setPrice] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [subCategory, setSubCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [previewTitle, setPreviewTitle] = useState('');
  const [previewDescription, setPreviewDescription] = useState('');
  const [previewLocation, setPreviewLocation] = useState('');
  const [previewCategory, setPreviewCategory] = useState('');
  const [previewPrice, setPreviewPrice] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    validations(router); 
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const user = await userResponse.json();
        return user;
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchPost = async () => {
      try {
        const postResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${id}`
        );
        const postData = await postResponse.json();
        return postData;
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchData = async () => {
      const [user, postData] = await Promise.all([fetchCurrentUser(), fetchPost()]);

      console.log("Current user:", user);
      console.log("Current user:", user.user._id);
      console.log("Post creator:", postData.createdBy._id);

      if (postData.createdBy._id !== user.user._id) {
        router.push('/404');
      } else {
        setPost(postData);
        setTitle(postData.title);
        setDescription(postData.description);
        setCountry(postData.country);
        setState(postData.state);
        setCity(postData.city);
        setPrice(postData.price);
        setMainCategory(postData.mainCategory);
        setSubCategory(postData.subCategory);
        setImages(
          postData.photos.map((photo) => ({
            file: null,
            preview: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`,
          }))
        );
      }
      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  useEffect(() => {
    setPreviewTitle(title);
    setPreviewDescription(description);
    setPreviewLocation(`${city}, ${state}, ${country}`);
    setPreviewCategory(`${mainCategory} > ${subCategory}`);
    setPreviewPrice(Number(price).toLocaleString());
  }, [title, description, country, state, city, mainCategory, subCategory, price]);

  // Verificar si el objeto 'post' está definido antes de renderizar el contenido del componente
  if (!post) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e) => {
    const newImages = [...e.target.files].map((file) => {
      if (file.size > 50000000) { // 50MB en bytes
        console.log('Selected file is too large.');
        const errorMessage = 'The selected file is too large. Please select a file that is 50MB or smaller.';
        setError(errorMessage);
        alert(errorMessage); // Agregar esta línea
        return null;
      } else if (!/^(image\/jpeg|image\/png|image\/jpg)$/.test(file.type)) {
        console.log('Selected file is not a JPG, JPEG, or PNG.');
        const errorMessage = 'The selected file must be in JPG, JPEG or PNG format.';
        setError(errorMessage);
        alert(errorMessage); // Agregar esta línea
        return null;
      } else {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      }
    }).filter((image) => image !== null);
  
    // Contar el número de imágenes existentes en la base de datos
    const existingImagesCount = images.filter((image) => image.file === null).length;
    const totalImages = existingImagesCount + newImages.length;
  
    if (totalImages > 4) {
      const errorMessage = 'You cannot upload more than 4 images.';
      setError(errorMessage);
      alert(errorMessage); // Agregar esta línea
    } else {
      setError(null);
      setImages((prevState) => [...prevState, ...newImages]);
    }
  };  

  const onDelete = (index) => {
    const deletedImage = images[index].preview;
    setDeletedImages((prevState) => [...prevState, deletedImage]);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const oversizedImages = images.filter((image) => image.file !== null && image.file.size > 50000000); // 50MB en bytes
    if (oversizedImages.length > 0) {
      setError('One or more selected files are too large. Please select files that are 50MB or smaller.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('country', country);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('price', price);
      formData.append('mainCategory', mainCategory);
      formData.append('subCategory', subCategory);
      for (let i = 0; i < images.length; i++) {
        if (images[i].file) {
          formData.append("photos[]", images[i].file);
        }
      }

      // Aquí es donde incluirás las imágenes eliminadas como una cadena separada por comas
      const deletedImagesString = deletedImages.join(',');
      formData.append('deletedImages', deletedImagesString);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setLoading(false);
      router.push('/myPosts'); // Redirige a "Mis Posts" después de editar un post exitosamente
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="mt-5 mb-5">
      <h3 className="text-center mb-4">Edit the post of what you Want</h3>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Give a title to what you Want</label>
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
              <label htmlFor="description" className="form-label">Now describe it in more detail</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">how much would you pay for what you Want</label>
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
              <Location
                onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
                onStateChange={(selectedState) => setState(selectedState)}
                onCityChange={(selectedCity) => setCity(selectedCity)}
                isRequired={true}
                initialCountry={country}
                initialState={state}
                initialCity={city}
              />
            </div>
            <div className="mb-3">
              <PostCategory
                onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
                onSubcategoryChange={(selectedSubCategory) => setSubCategory(selectedSubCategory)}
                initialMainCategory={mainCategory}
                initialSubcategory={subCategory}
                isRequired={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Upload a guide photo of what you want</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={images.length >= 4}
                multiple
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : "Update my post"}
              
              </button>
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
          </form>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
        </div>
        <div className="col-md-3">
          <div className="card post rounded-5 card-preview">
            <Carousel activeIndex={activeIndex} onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                </Carousel.Item>
              ))}
              {images.length < 4 && (
                <Carousel.Item>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                  >
                    <p>Free space for a photo</p>
                  </div>
                </Carousel.Item>
              )}
            </Carousel>
            {images.length > 0 && (
              <button
                type="button"
                className="btn btn-danger delete-image-btn"
                onClick={() => onDelete(activeIndex)}
              >
                Delete this photo
              </button>
            )}
            <div className="card-body">
              <h5 className="card-title post-title mb-2">{previewTitle || "Title"}</h5>
              <h5 className="text-success">${previewPrice}</h5>
              <p className="card-text post-text mb-2">{previewDescription || "Description"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditPost;