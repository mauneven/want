import { useRouter } from "next/router";
import react, { useState, useEffect } from "react";
import WordsFilter from "@/badWordsFilter/WordsFilter";
import { Button, Modal, Alert } from "react-bootstrap";
import { validations } from "@/utils/validations";
import { countries } from "../data/countries.json";
import GoHomeButton from "@/components/reusable/GoHomeButton";
import { useTranslation } from "react-i18next";

const CreateOffer = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);

  const getActivePhotoIndex = () => {
    const activeItem = document.querySelector(".carousel-item.active");
    return activeItem ? parseInt(activeItem.dataset.index) : -1;
  };

  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
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

  const handleContactChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setContact(value);
    } else {
      setContact(value.slice(0, 200));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setPhoneNumber(value);
    } else {
      setPhoneNumber(value.slice(0, 15));
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

  useEffect(() => {
    validations(router);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`
      );
      const data = await response.json();
      setPost(data);
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const bwf = new WordsFilter();

  const findEmptyPhotoIndex = () => {
    for (let i = 0; i < 4; i++) {
      if (!photos[i]) {
        return i;
      }
    }
    return -1;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      e.target.value = null;
      if (file.size > 5 * 1024 * 1024) {
        setErrorAlert(t("createOffer.fileSizeError"));
        e.target.value = "";
      } else {
        setErrorAlert(null);
        const index = findEmptyPhotoIndex();
        if (index !== -1) {
          const newPhotos = [...photos];
          newPhotos[index] = file;
          setPhotos(newPhotos);
        }
      }
    }
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    newPhotos.push(null);
    setPhotos(newPhotos);
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountryCode(countryCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (bwf.containsBadWord(title)) {
      alert(`You wrote a bad word in the title: ${bwf.devolverPalabra(title)}`);
      setIsSubmitting(false);
      return;
    }

    if (bwf.containsBadWord(description)) {
      alert(
        `You wrote a bad word in the description: ${bwf.devolverPalabra(
          description
        )}`
      );
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("contact", contact);
    formData.append("phoneNumber", phoneNumber);
    formData.append("countryCode", selectedCountryCode);

    if (photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        formData.append("photos[]", photos[i]);
      }
    }

    formData.append("postId", postId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Offer created");
        router.push(`/post/${postId}`);
      } else {
        alert("There was an error, try again later or change the photos");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Handle the automatic scroll to the top when an alert is shown
    if (errorAlert) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [errorAlert]);

  if (!post) {
    return <p className="container mt-5">Loading...</p>;
  }

  return (
    <div className="container mt-4 mb-4">
      <GoHomeButton />
      <h1 className="mt-3 text-center">
        {t("createOffer.creatingOfferFor")} "{post.title}"
      </h1>
      <h2 className="mt-3 text-center">
        {t("createOffer.paymentAmount")} ${Number(post.price).toLocaleString()}
      </h2>
      <h4 className="mt-3 text-center want-color">
        {t("createOffer.doYourBestOffer")}
      </h4>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("createOffer.createOffer")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              1. {t("createOffer.offerLifetime")}
            </li>
            <li className="list-group-item">
              2. {t("createOffer.offerRemoved")}
            </li>
            <li className="list-group-item">
              3. {t("createOffer.offerDelete")}
            </li>
            <li className="list-group-item">
              4. {t("createOffer.offerDeleteManually")}
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button className="generic-button" onClick={handleCloseModal}>
            Ok
          </button>
        </Modal.Footer>
      </Modal>
      <div className="">
        <div className=" p-0">
          <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                {t("createOffer.offerTitle")}
              </label>
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
              <label htmlFor="description" className="form-label">
                {t("createOffer.offerDescription")}
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="phone-country" className="form-label">
                {t("createOffer.phoneContact")}
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  id="phone-country"
                  value={selectedCountryCode}
                  onChange={handleCountryChange}
                >
                  <option value="">{t("createOffer.chooseCountryCode")}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.phoneCode}>
                      {`${country.name} +${country.phoneCode}`}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control no-spinners"
                  placeholder={t("createOffer.phoneNumber")}
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">
                {t("createOffer.otherContact")}
              </label>
              <input
                type="text"
                className="form-control"
                id="contact"
                value={contact}
                onChange={handleContactChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                {t("createOffer.offerPrice")}
              </label>
              <input
                type="text"
                className="form-control no-spinners"
                id="price"
                value={price}
                onChange={handlePriceChange}
                onKeyPress={handleKeyPress}
                required
              />
              {price ? (
                <small className="form-text text-muted">
                  {t("createOffer.priceLabel")} {Number(price).toLocaleString()}
                </small>
              ) : null}
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                {t("createOffer.uploadPhotos")}
              </label>
              <div className="row row-cols-xl-2" onDragOver={handleDragOver} onDrop={handleDrop} >
        {[1, 2, 3, 4].map((index) => (
          <div className="form-group border justify-content-center align-items-center d-flex p-2 want-rounded mt-2 mb-2" key={index}>
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
                <label
                  htmlFor={`photo${index}`}
                  className="photo-upload"
                >
                  <i className="bi bi-image divhover display-1"></i>
                  <i className="bi bi-plus-circle-fill display-6 divhover"></i>
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
              <input
                type="file"
                id={`photo${index}`}
                className="form-control visually-hidden"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
              />
            </div>
          </div>
        ))}
      </div>
            </div>
            {errorAlert && (
              <Alert
                variant="danger"
                onClose={() => setErrorAlert(null)}
                dismissible
              >
                {errorAlert}
              </Alert>
            )}
            <div className="mb-3">
              <button
                type="submit"
                className="want-button want-rounded border-selected"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("createOffer.creating")
                  : t("createOffer.createOffer")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;