import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PostCategory from "@/components/categories/Categories";
import EditPostLocation from "@/components/locations/editPost/";
import WordsFilter from "@/badWordsFilter/WordsFilter.js";
import { validations } from "@/utils/validations";
import GoHomeButton from "@/components/reusable/GoHomeButton";
import { Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [thirdCategory, setThirdCategory] = useState("");
  const [price, setPrice] = useState("");
  const [postData, setPostData] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();
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
    // Load post data and check session
    const loadPostAndCheckSession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${router.query.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        const postData = await response.json();
        setPostData(postData); // Set the postData state
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
        setLatitude(postData.latitude);
        setLongitude(postData.longitude);

        const checkSessionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (checkSessionResponse.ok) {
          const data = await checkSessionResponse.json();
          setUser(data.user || null);
          console.log(data);
          console.log(postData);
          if (data.user._id && data.user._id !== postData.createdBy._id) {
            router.push("/");
          }
        } else if (checkSessionResponse.status === 401) {
          setUser(null);
          console.log("not logged in");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    loadPostAndCheckSession();
  }, [router.query.id, router.pathname]);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const handleFileChange = (e) => {
    let selectedImages = Array.from(e.target.files);
    let newImages = [];
    let imageSizeErrorMessage = null;
    let imageFormatErrorMessage = null;

    // Check each file for size and format
    for (let i = 0; i < selectedImages.length; i++) {
      let file = selectedImages[i];
      if (file.size > 5000000) {
        imageSizeErrorMessage = `${t("uploads.fileSizeExceeded")}`;
        continue;
      }
      if (
        !/^(image\/jpeg|image\/png|image\/jpg|image\/webp)$/.test(file.type)
      ) {
        imageFormatErrorMessage = `${t("uploads.incorrectFile")}`;
        continue;
      }
      newImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    // Display any error messages
    if (imageSizeErrorMessage || imageFormatErrorMessage) {
      setErrorMessage(imageSizeErrorMessage || imageFormatErrorMessage);
      setShowErrorAlert(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowErrorAlert(false);
      }, 10000);
    }

    // Check total number of images
    const totalImages = photos.length + newImages.length;
    if (totalImages > 4) {
      const errorMessage = `${t("uploads.maxImages")}`;
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowErrorAlert(false);
      }, 10000);
      newImages = newImages.slice(0, 4 - photos.length); // Keep only enough images to reach the limit
    }

    setPhotos((prevState) => [...prevState, ...newImages]);
    // Clear the input value after processing the files
    e.target.value = null;
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

    if (bwf.containsBadWord(title)) {
      const errorMessage = `${t("wordsFilter.badWordInTitle")} ${bwf.badWordIs(
        title
      )}`;
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowErrorAlert(false);
      }, 10000);
      return;
    }

    if (bwf.containsBadWord(description)) {
      const errorMessage = `${t(
        "wordsFilter.badWordInDescription"
      )} ${bwf.badWordIs(description)}`;
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
      setTimeout(() => {
        setErrorMessage("");
        setShowErrorAlert(false);
      }, 10000);
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

  useEffect(() => {
    // Scroll to the bottom of the page when the error alert is shown
    if (showErrorAlert) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [showErrorAlert]);

  return (
    <div className="mt-3 mb-3">
      <div className="">
        <div className="container">
          <GoHomeButton />
          <h3 className="text-center mb-4">{t("createPost.editPost")}</h3>
          <form onSubmit={handleSubmit} className="">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                {t("createPost.titleLabel")}
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
                {t("createPost.descriptionLabel")}
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
                {t("createPost.priceLabel")}
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
                  {t("createPost.priceText", {
                    price: Number(price).toLocaleString(),
                  })}
                </small>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                {t("createPost.categoriesLabel")}
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
              {t("createPost.locationLabel")}
              </label>
              <EditPostLocation
                latitude={latitude}
                longitude={longitude}
                onLatitudeChange={handleLatitudeChange}
                onLongitudeChange={handleLongitudeChange}
              />
            </div>
            <label htmlFor="price" className="form-label">
            {t("createPost.photosLabel")}
            </label>
            {photos.length < 4 && (
              <div
                className="border want-border p-4 row d-flex justify-content-center align-items-center text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <label className="photo-upload">
                  <div>
                    <i className="bi bi-image divhover display-1"></i>
                  </div>

                  <input
                    type="file"
                    multiple
                    className="form-control visually-hidden"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                  />
                </label>
                {t("uploads.loadImagesHere")}
              </div>
            )}
            <div
              className="row row-cols-xl-2"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {[1, 2, 3, 4].map((index) => (
                <div
                  className="form-group justify-content-center align-items-center d-flex p-2 want-rounded mt-2 mb-2"
                  key={index}
                >
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
            {showErrorAlert && (
              <Alert
                variant="danger"
                onClose={() => setShowErrorAlert(false)}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}
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
                `${t("createPost.updatePost")}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
