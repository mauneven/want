import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostCategory from '@/components/categories/Categories';
import Location from '@/components/locations/Location';
import WordsFilter from '@/badWordsFilter/WordsFilter.js';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [photos, setPhotos] = useState([]);

  const [previewTitle, setPreviewTitle] = useState('');
  const [previewDescription, setPreviewDescription] = useState('');
  const [previewLocation, setPreviewLocation] = useState('');
  const [previewCategory, setPreviewCategory] = useState('');
  const [previewPrice, setPreviewPrice] = useState('');

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-logged-in`, {
        credentials: 'include',
      });

      if (!loggedInResponse.ok) {
        router.push('/login');
        return;
      }

      const blockedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-blocked`, {
        credentials: 'include',
      });

      if (!blockedResponse.ok) {
        router.push('/blocked');
        return;
      }

      const verifiedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-verified`, {
        credentials: 'include',
      });

      if (!verifiedResponse.ok) {
        router.push('/is-not-verified');
      }
    };

    checkLoggedInAndBlockedAndVerified();
  }, []);

  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhotos([...photos, ...newPhotos]);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  useEffect(() => {
    setPreviewTitle(title);
    setPreviewDescription(description);
    setPreviewLocation(`${city}, ${state}, ${country}`);
    setPreviewCategory(`${mainCategory} > ${subCategory}`);
    setPreviewPrice(Number(price).toLocaleString());
  }, [title, description, country, state, city, mainCategory, subCategory, price]);

  const bwf = new WordsFilter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check for bad words in title and description
    if (bwf.containsBadWord(title)) {
      alert(`Escribiste una mala palabra en el titulo: ${bwf.devolverPalabra(title)}`);
      setLoading(false);
      return;
    }

    if (bwf.containsBadWord(description)) {
      alert(`Escribiste una mala palabra en la descripción: ${bwf.devolverPalabra(description)}`);
      setLoading(false);
      return;
    }

    console.log('Submitting post with values:', { title, description, country, state, city, mainCategory, subCategory, price, photo });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('mainCategory', mainCategory);
    formData.append('subCategory', subCategory);
    formData.append('price', price);
    if (photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        formData.append("photos[]", photos[i]);
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setLoading(false);
      router.push('/'); // Redirige al inicio después de crear un post exitosamente
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="mt-5 mb-5">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Dale un título a lo que quieres</label>
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
              <label htmlFor="description" className="form-label">Ahora describelo con mas detalle</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Cuanto pagarías por lo que quieres</label>
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
              <Location
                onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
                onStateChange={(selectedState) => setState(selectedState)}
                onCityChange={(selectedCity) => setCity(selectedCity)}
                isRequired={true}
              />
            </div>
            <div className="mb-3">
              <PostCategory
                onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
                onSubcategoryChange={(selectedSubCategory) => setSubCategory(selectedSubCategory)} // Cambia "onSubCategoryChange" a "onSubcategoryChange"
                isRequired={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Sube una foto guía de lo que quieres</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                "Publicar lo que quiero"
              )}
            </button>
          </form>
        </div>
        <div className="col-md-3">
          <div className="card post rounded-5 card-preview">
            {photos.length > 0 && (
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {photos.map((photo, index) => (
                    <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                      <img src={URL.createObjectURL(photo)} className="d-block w-100" alt={`Photo ${index}`} />
                      <button className="btn btn-danger btn-sm delete-photo" onClick={() => handleDeletePhoto(index)}>
                        <i className="bi bi-trash"></i>
                      </button>
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
            <button className="btn btn-danger btn-sm delete-photo" onClick={() => handleDeletePhoto(index)}>
              <i className="bi bi-trash"></i>
            </button>
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


};

export default CreatePost;