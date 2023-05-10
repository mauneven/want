import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PostCategory from '@/components/categories/Categories';
import Location from '@/components/locations/Location';
import WordsFilter from '@/badWordsFilter/WordsFilter.js';
import { useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef();

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
  
    const maxAllowedPhotos = 4;
    const availableSlots = maxAllowedPhotos - photos.length;
    const photosToAdd = newPhotos.slice(0, availableSlots);
    setPhotos([...photos, ...photosToAdd]);
  };  

  const handleDeletePhoto = (indexToDelete) => {
    const newPhotos = photos.filter((photo, index) => index !== indexToDelete);

    setPhotos(newPhotos);

    if (indexToDelete === activeIndex) {
      setActiveIndex(0);
    } else if (indexToDelete < activeIndex) {
      setActiveIndex(activeIndex - 1);
    }
  };

  useEffect(() => {
    const handleSlid = (event) => {
      setActiveIndex(event.to);
    };

    if (carouselRef.current) {

      carouselRef.current.addEventListener('slid.bs.carousel', handleSlid);
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('slid.bs.carousel', handleSlid);
      }
    };
  }, [photos]);

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
    if (true) {
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
              <label htmlFor="title" className="form-label">Give a title to what you want</label>
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
              <label htmlFor="description" className="form-label">Now describe it in more detail.</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">how much would you pay for what you want</label>
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
              <label htmlFor="photo" className="form-label">Upload upto 4 photos if you Want</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={photos.length >= 4}
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
              <div ref={carouselRef} id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {[0, 1, 2, 3].map((slot) => (
                    <div key={slot} className={slot === activeIndex ? "carousel-item active" : "carousel-item"}>
                      {photos[slot] ? (
                        <img
                          src={URL.createObjectURL(photos[slot])}
                          className="d-block w-100"
                          alt={`Photo ${slot}`}
                        />
                      ) : (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px', backgroundColor: 'lightgray' }}>
                          <span className="text-muted">Free space for a photo</span>
                        </div>
                      )}
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
                <button
                  className="btn btn-danger delete-image-btn"
                  onClick={() => handleDeletePhoto(activeIndex)}
                >
                  <i className="bi bi-trash"></i>
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


};

export default CreatePost;