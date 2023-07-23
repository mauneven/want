import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import PostCategory from "@/components/categories/Categories";
import CreatePostLocation from "@/components/locations/createPost/";
import WordsFilter from "@/badWordsFilter/WordsFilter.js";
import { validations } from "@/utils/validations";
import { useTranslation } from "react-i18next";
import GoHomeButton from "@/components/reusable/GoHomeButton";
import { Alert } from "react-bootstrap";

const MAX_PHOTO_SIZE_MB = 5; // Tamaño máximo permitido para cada foto (en megabytes)
const MAX_TOTAL_PHOTOS_MB = 20; // Tamaño máximo total permitido para todas las fotos (en megabytes)

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [thirdCategory, setThirdCategory] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const bwf = new WordsFilter();
  const { t } = useTranslation();
  const alertRef = useRef(null);
  const fileInputRef = useRef(null);

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
      // Verificar el tamaño del archivo
      const fileSizeMB = file.size / (1024 * 1024); // Convertir tamaño a megabytes
      if (fileSizeMB > MAX_PHOTO_SIZE_MB) {
        // Si el tamaño de la foto es mayor al máximo permitido, mostrar alerta y no agregar la foto
        setAlertMessage({
          variant: "danger",
          message: `La foto es demasiado grande. El tamaño máximo permitido es de ${MAX_PHOTO_SIZE_MB} MB.`,
        });
        setTimeout(() => setAlertMessage(null), 5000); // Cerrar la advertencia automáticamente en 5 segundos
        fileInputRef.current.value = null; // Limpiar el input de archivo
        return;
      }

      const newPhotos = [...photos];
      const emptyIndex = newPhotos.findIndex((photo) => photo === null);
      if (emptyIndex !== -1) {
        newPhotos[emptyIndex] = file;
      } else {
        newPhotos.push(file);
      }

      // Verificar el tamaño total de todas las fotos
      const totalPhotosSizeMB =
        newPhotos.reduce((totalSize, photo) => totalSize + (photo ? photo.size : 0), 0) / (1024 * 1024);
      if (totalPhotosSizeMB > MAX_TOTAL_PHOTOS_MB) {
        // Si el tamaño total de las fotos supera el máximo permitido, mostrar alerta y eliminar la última foto agregada
        setAlertMessage({
          variant: "danger",
          message: `El tamaño total de las fotos supera el máximo permitido de ${MAX_TOTAL_PHOTOS_MB} MB.`,
        });
        setTimeout(() => setAlertMessage(null), 5000); // Cerrar la advertencia automáticamente en 5 segundos
        newPhotos.pop(); // Eliminar la última foto agregada
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

  const validateForm = () => {
    const requiredFields = [
      { name: t("createPost.titleField"), value: title },
      { name: t("createPost.descriptionField"), value: description },
      { name: t("createPost.categoriesField"), value: mainCategory && subCategory && thirdCategory },
      { name: t("createPost.priceField"), value: price },
    ];

    const missingFields = requiredFields.filter((field) => !field.value);

    if (missingFields.length > 0) {
      const errorMessage = t("createPost.missingFieldsError", {
        fields: missingFields.map((field) => field.name).join(", "),
      });
      setAlertMessage({ variant: "danger", message: errorMessage });
      return false;
    }

    return true;
  };

  const handleCreatePost = async () => {
    if (!validateForm()) {
      return;
    }

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setLoading(false);
      router.push("/myPosts");
    } catch (error) {
      setLoading(false);
      setAlertMessage({ variant: "danger", message: error.message });
    }
  };

  useEffect(() => {
    if (alertMessage) {
      // Scroll hacia el fondo de la página
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

      // Cerrar la alerta automáticamente después de 5 segundos
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 10000);

      // Limpiar el timer cuando el componente se desmonta o cuando cambia la alerta
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alertMessage]);

  return (
    <div className="mt-3 mb-3 container">
      <GoHomeButton />
      <h1 className="text-center mb-4">{t("createPost.title")}</h1>
      <div className="">
        <div className=" ">
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
                {t("createPost.priceText", { price: Number(price).toLocaleString() })}
              </small>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              {t("createPost.categoriesLabel")}
            </label>
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
            <label htmlFor="price" className="form-label">
              {t("createPost.locationLabel")}
            </label>
            <CreatePostLocation
              onLatitudeChange={handleLatitudeChange}
              onLongitudeChange={handleLongitudeChange}
            />
          </div>
          <label htmlFor="price" className="form-label">
            {t("createPost.photosLabel")}
          </label>
          <div className="row row-cols-xl-2">
            {[1, 2, 3, 4].map((index) => (
              <div className="form-group mt-2 mb-2" key={index}>
                <div className="photo-upload-container col text-center align-items-center">
                  {photos[index - 1] && (
                    <div className="photo-preview">
                      <img
                        src={URL.createObjectURL(photos[index - 1])}
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
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleFileChange}
                        ref={index === 1 ? fileInputRef : null}
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
          {alertMessage && (
            <Alert variant={alertMessage.variant} onClose={() => setAlertMessage(null)} dismissible ref={alertRef}>
              {alertMessage.message}
            </Alert>
          )}
          <button
            type="button"
            className="want-button want-rounded mt-2 border-selected "
            disabled={loading}
            onClick={handleCreatePost}
          >
            {loading ? (
              <span
                className="spinner-border want-rounded spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              t("createPost.createPostButton")
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