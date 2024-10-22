import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import WordsFilter from "@/badWordsFilter/WordsFilter";
import { Button, Modal } from "react-bootstrap";
import { validations } from "@/utils/validations";
import countriesData from "../../data/countries.json";
import { useTranslation } from "react-i18next";

const CreateOfferModal = ({ postId, showModal, closeModal }) => {
  const router = useRouter();
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

  const countries = countriesData.countries;

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

  const handleCloseClick = () => {
    closeModal();
  };

  const handleShowModal = () => {
    showModal();
  };

  const handleCloseModal = () => {
    closeModal();
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

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newPhotos = [...photos];
      newPhotos[index] = file;
      setPhotos(newPhotos);
    }
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
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
      alert(`${t("badWordTitle")}: ${bwf.badWordIs(title)}`);
      setIsSubmitting(false);
      return;
    }

    if (bwf.containsBadWord(description)) {
      alert(
        `${t("badWordDescription")}: ${bwf.badWordIs(description)}`
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
        alert(t("offerCreated"));
        router.push(`/post/${postId}`);
      } else {
        alert(t("createError"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <p className="container mt-5">{t("loading")}</p>;
  }

  return (
    <>
     <button className="want-button" onClick={handleShowModal}>
        {t("createOfferModal.offerTitle")}
      </button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="modal-dialog modal-fullscreen"
        animation={false}
      >
        <Modal.Body>
          <div className="container">
            <button className="close-modal-button" onClick={handleCloseClick}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div
              className=""
              style={{ maxWidth: "100%", overflowWrap: "break-word" }}
            >
              <h2 className="mt-3 text-center">
                {t("createOfferModal.creatingOfferFor")} {post.title} 
              </h2>

              <h3 className="mt-3 text-center">
                {t("createOfferModal.paymentAmount")} $ { Number(post.price).toLocaleString()} 
              </h3>
              <h4 className="mt-3 text-center want-color">
                {t("createOfferModal.doYourBestOffer")}
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    {t("createOfferModal.offerTitle")}
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
                    {t("createOfferModal.offerDescription")}
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
                    {t("createOfferModal.phoneContact")}
                  </label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      id="phone-country"
                      value={selectedCountryCode}
                      onChange={handleCountryChange}
                    >
                      <option value="">{t("createOfferModal.chooseCountryCode")}</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.phoneCode}>
                          {`${country.name} +${country.phoneCode}`}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control no-spinners"
                      placeholder={t("createOfferModal.phoneNumber")}
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="contact" className="form-label">
                    {t("createOfferModal.otherContact")}
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
                    {t("createOfferModal.offerPrice")}
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
                      {t("createOfferModal.priceLabel", { price: Number(price).toLocaleString() })}
                    </small>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="photo" className="form-label">
                    {t("createOfferModal.uploadPhotos")}
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
                              className=" btn-light circle btn-sm delete-photo"
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
                            accept="image/jpeg,image/png,image/gif"
                            onChange={(e) => handleFileChange(e, index - 1)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="want-button want-rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("createOfferModal.creating") : t("createOfferModal.createOffer")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateOfferModal;
