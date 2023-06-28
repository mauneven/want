import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PostCategory from "@/components/categories/Categories";
import CreatePostLocation from "@/components/locations/createPost/";
import WordsFilter from "@/badWordsFilter/WordsFilter.js";
import { validations } from "@/utils/validations";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [thirdCategory, setThirdCategory] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState(null); // Agrega el estado para latitude
  const [longitude, setLongitude] = useState(null); // Agrega el estado para longitude
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const bwf = new WordsFilter();

  useEffect(() => {
    validations(router);
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPhotos = [...photos];
      const emptyIndex = newPhotos.findIndex((photo) => photo === null);
      if (emptyIndex !== -1) {
        newPhotos[emptyIndex] = file;
      } else {
        newPhotos.push(file);
      }
      setPhotos(newPhotos);
    }
  };

  const handleLatitudeChange = (latitude) => {
    setLatitude(latitude);
  };

  const handleLongitudeChange = (longitude) => {
    setLongitude(longitude);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos.slice(0, 4));
  };

  const handleCreatePost = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("latitude", latitude || 0); // Proporcionar un valor predeterminado de 0 si latitude es null
    formData.append("longitude", longitude || 0); // Proporcionar un valor predeterminado de 0 si longitude es null
    formData.append("mainCategory", mainCategory);
    formData.append("subCategory", subCategory);
    formData.append("thirdCategory", thirdCategory);
    formData.append("price", price);

    photos.forEach((photo, index) => {
      if (photo) {
        formData.append("photos[]", photo);
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="mt-3 mb-3 container">
      <h1 className="text-center mb-4">Create a post about what you Want</h1>
      <div className="">
        <div className=" ">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Give a title to what you want*
            </label>
            <input
              type="text"
              className="form-control rounded-5"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Now describe it in more detail*
            </label>
            <textarea
              className="form-control rounded-5"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              How much would you pay for what you want*
            </label>
            <input
              type="number"
              className="form-control rounded-5"
              id="price"
              value={price}
              onChange={handlePriceChange}
              required
            />
            {price ? (
              <small className="form-text text-muted">
                Price: {Number(price).toLocaleString()}
              </small>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Now, organize or define what you Want in 3 categories*
            </label>
            <PostCategory
              onMainCategoryChange={(selectedMainCategory) =>
                setMainCategory(selectedMainCategory)
              }
              onSubcategoryChange={(selectedSubCategory) =>
                setSubCategory(selectedSubCategory)
              }
              onThirdCategoryChange={(selectedThirdCategory) =>
                setThirdCategory(selectedThirdCategory)
              }
              initialMainCategory={mainCategory}
              initialSubcategory={subCategory}
              initialThirdCategory={thirdCategory}
              isRequired={true}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Give an approximate location of where you want this*
            </label>
            <CreatePostLocation
              onLatitudeChange={handleLatitudeChange}
              onLongitudeChange={handleLongitudeChange}
            />
          </div>
          <label htmlFor="price" className="form-label">
            upload upto 4 photos about what you Want*
          </label>
          <div className="row row-cols-xl-2">
            {[1, 2, 3, 4].map((index) => (
              <div className="form-group mt-2 mb-2" key={index}>
                <div className="photo-upload-container col text-center align-items-center">
                  {photos[index - 1] && (
                    <div className="photo-preview">
                      <img
                        src={URL.createObjectURL(photos[index - 1])}
                        className="img-thumbnail border-0 uploaded-photos rounded-5"
                        alt={`Photo ${index}`}
                      />
                    </div>
                  )}
                  {!photos[index - 1] && (
                    <label htmlFor={`photo${index}`} className="photo-upload">
                      <i className="bi bi-image divhover display-1"></i>
                      <i className="bi bi-plus-circle-fill display-6 divhover"></i>
                      <input
                        type="file"
                        className="form-control visually-hidden"
                        id={`photo${index}`}
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                  {photos[index - 1] && (
                    <button
                      className="btn btn-light circle btn-sm delete-photo"
                      onClick={() => handleDeletePhoto(index - 1)}
                      type="button"
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button
            type="button"
            className="btn want-button rounded-5 mt-2"
            disabled={loading}
            onClick={handleCreatePost}
          >
            {loading ? (
              <span
                className="spinner-border rounded-5 spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Create Post"
            )}
          </button>
          <button type="button" className="btn" onClick={handleShowModal}>
            <i className="bi bi-info-circle-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default CreatePost;
