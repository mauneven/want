import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PostCategory from "@/components/categories/Categories";
import EditPostLocation from "@/components/locations/editPost/";
import WordsFilter from "@/badWordsFilter/WordsFilter.js";
import { validations } from "@/utils/validations";

const EditPost = () => {
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
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const router = useRouter();
  const bwf = new WordsFilter();

  const handleLatitudeChange = (latitude) => {
    setLatitude(latitude);
  };

  const handleLongitudeChange = (longitude) => {
    setLongitude(longitude);
  };

  useEffect(() => {
    validations(router);
  }, []);

  useEffect(() => {
    // Load post data
    const loadPost = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${router.query.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        const postData = await response.json();
        setTitle(postData.title);
        setDescription(postData.description);
        setMainCategory(postData.mainCategory);
        setSubCategory(postData.subCategory);
        setThirdCategory(postData.thirdCategory);
        setPrice(postData.price);
        setPhotos(
          postData.photos.map((photo) => ({
            file: null,
            preview: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`,
          }))
        );
        setLatitude(postData.latitude); // Establecer la latitud inicial
        setLongitude(postData.longitude); // Establecer la longitud inicial
      } catch (error) {
        console.error(error);
      }
    };

    loadPost();
  }, [router.query.id]);

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
    const newImages = [...e.target.files]
      .map((file) => {
        if (file.size > 50000000) {
          // 50MB en bytes
          console.log("Selected file is too large.");
          const errorMessage =
            "The selected file is too large. Please select a file that is 50MB or smaller.";
          setError(errorMessage);
          alert(errorMessage);
          return null;
        } else if (!/^(image\/jpeg|image\/png|image\/jpg)$/.test(file.type)) {
          console.log("Selected file is not a JPG, JPEG, or PNG.");
          const errorMessage =
            "The selected file must be in JPG, JPEG or PNG format.";
          setError(errorMessage);
          alert(errorMessage);
          return null;
        } else {
          return {
            file,
            preview: URL.createObjectURL(file),
          };
        }
      })
      .filter((image) => image !== null);

    const totalImages = photos.length + newImages.length;

    if (totalImages > 4) {
      const errorMessage = "You cannot upload more than 4 images.";
      setError(errorMessage);
      alert(errorMessage);
    } else {
      setError(null);
      setPhotos((prevState) => [...prevState, ...newImages]);
    }
  };

  const handleDeletePhoto = (index) => {
    const deletedImage = photos[index];
    setDeletedPhotos((prevState) => [...prevState, deletedImage]);
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setError(null);
    setDeletedImages((prevState) => [...prevState, deletedImage]); // Actualiza el estado deletedImages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (bwf.containsBadWord(title)) {
      alert(
        `Escribiste una mala palabra en el titulo: ${bwf.devolverPalabra(
          title
        )}`
      );
      setLoading(false);
      return;
    }

    if (bwf.containsBadWord(description)) {
      alert(
        `Escribiste una mala palabra en la descripción: ${bwf.devolverPalabra(
          description
        )}`
      );
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("latitude", latitude || 0); // Proporcionar un valor predeterminado de 0 si latitude es null
    formData.append("longitude", longitude || 0); // Proporcionar un valor predeterminado de 0 si longitude es null
    formData.append("mainCategory", mainCategory);
    formData.append("subCategory", subCategory);
    formData.append("thirdCategory", thirdCategory);
    formData.append("price", price);
    formData.append(
      "deletedImages",
      deletedImages.map((image) => image.preview).join(",")
    );

    photos.forEach((photo, index) => {
      if (photo.file) {
        formData.append("photos[]", photo.file);
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${router.query.id}`,
        {
          method: "PUT",
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
      router.push("/myPosts");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="mt-3 mb-3">
      <h3 className="text-center mb-4">Edit the post of what you Want</h3>
      <div className="">
        <div className="container">
          <form onSubmit={handleSubmit} className="">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Give a title to what you want*
              </label>
              <input
                type="text"
                className="form-control want-rounded"
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
                className="form-control want-rounded"
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
                className="form-control want-rounded"
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
                Give an approximate location of where you want this*
              </label>
              <EditPostLocation
                latitude={latitude}
                longitude={longitude}
                onLatitudeChange={handleLatitudeChange}
                onLongitudeChange={handleLongitudeChange}
              />
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
                          src={photos[index - 1].preview}
                          className="img-thumbnail  uploaded-photos want-rounded"
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
                        className="btn-light circle btn-sm delete-photo"
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
              type="submit"
              className="btn-lg want-button want-rounded"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
