import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import PostCategory from '@/components/categories/Categories';
import Location from '@/components/locations/Location';
import WordsFilter from '@/badWordsFilter/WordsFilter.js';
import { validations } from '@/utils/validations';
import { Modal } from 'react-bootstrap';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [thirdCategory, setThirdCategory] = useState('');
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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    validations(router);
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

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 60) {
      setTitle(value);
    } else {
      setTitle(value.slice(0, 60));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 600) {
      setDescription(value);
    } else {
      setDescription(value.slice(0, 600));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value.length <= 11) {
      setPrice(value);
    } else {
      setPrice(value.slice(0, 11));
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
    setPreviewCategory(`${mainCategory} > ${subCategory} > ${thirdCategory}`);
    setPreviewPrice(Number(price).toLocaleString());
  }, [title, description, country, state, city, mainCategory, subCategory, thirdCategory, price]);

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

    console.log('Submitting post with values:', { title, description, country, state, city, mainCategory, subCategory, thirdCategory, price, photo });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('mainCategory', mainCategory);
    formData.append('subCategory', subCategory);
    formData.append('thirdCategory', thirdCategory);
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
    <div className="mt-3 mb-3">
      <h3 className="text-center mb-4">Create a post about what you Want</h3>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        <div className="col-md-6">
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Info about when you create a post</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-0'>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">1. Your post will be available 30 days, after this time it will be deleted including its related offers</li>
                <li className="list-group-item">2. Your post will be public and visible to anyone who searches among the selected locations and categories.</li>
                <li className="list-group-item">3. You are free to delete or edit the post at any time or delete the offers you receive from the post.</li>
                <li className="list-group-item">4. If you decide to manually delete the post, the offers related to the post will also be deleted.</li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Ok
              </button>
            </Modal.Footer>
          </Modal>
          <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Give a title to what you want*</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Now describe it in more detail*</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">How much would you pay for what you want*</label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={handlePriceChange}
                required
              />
              {price ? (
                <small className="form-text text-muted">Price: {Number(price).toLocaleString()}</small>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Give an approximate location of where you want this*</label>
              <Location
                onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
                onStateChange={(selectedState) => setState(selectedState)}
                onCityChange={(selectedCity) => setCity(selectedCity)}
                isRequired={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Select a category according to what you want*</label>
              <PostCategory
                onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
                onSubcategoryChange={(selectedSubCategory) => setSubCategory(selectedSubCategory)}
                onThirdCategoryChange={(selectedThirdCategory) => setThirdCategory(selectedThirdCategory)}
                initialMainCategory={mainCategory}
                initialSubcategory={subCategory}
                initialThirdCategory={thirdCategory}
                isRequired={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Upload up to 4 photos if you want</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={photos.length >= 4}
              />
            </div>
            <button type="submit" className="btn btn-success rounded-5" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                "Create Post"
              )}
            </button>
            <button type="button" className="btn" onClick={handleShowModal}>
              <i className="bi bi-info-circle-fill"></i>
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
                className="btn btn-danger delete-image-btn m-2 rounded-5"
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