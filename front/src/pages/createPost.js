import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PostCategory from "@/components/categories/Categories";
import Location from "@/components/locations/Location";
import WordsFilter from "@/badWordsFilter/WordsFilter.js";
import { validations } from "@/utils/validations";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [thirdCategory, setThirdCategory] = useState("");
  const [price, setPrice] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check for bad words in title and description
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

    console.log("Submitting post with values:", {
      title,
      description,
      country,
      state,
      city,
      mainCategory,
      subCategory,
      thirdCategory,
      price,
      photos,
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
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
      router.push("/"); // Redirige al inicio después de crear un post exitosamente
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="mt-3 mb-3">
      <h1 className="text-center mb-4">Create a post about what you Want</h1>
      <div className="">
        <div className="form-container container">
          <form onSubmit={handleSubmit} className="">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Give a title to what you want*
              </label>
              <input
                type="text"
                className="form-control rounded-4"
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
                className="form-control rounded-4"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                rows={4} // Establece el número de filas iniciales
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                How much would you pay for what you want*
              </label>
              <input
                type="number"
                className="form-control rounded-4"
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
              <Location
                onCountryChange={(selectedCountry) =>
                  setCountry(selectedCountry)
                }
                onStateChange={(selectedState) => setState(selectedState)}
                onCityChange={(selectedCity) => setCity(selectedCity)}
                isRequired={true}
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
                          src={URL.createObjectURL(photos[index - 1])}
                          className="img-thumbnail border-0 uploaded-photos rounded-4"
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
                          onChange={(e) => handleFileChange(e, index - 1)}
                        />
                      </label>
                    )}
                    {photos[index - 1] && (
                      <button
                        className="btn btn-light circle btn-sm delete-photo"
                        onClick={() => handleDeletePhoto(index - 1)}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="btn btn-success rounded-4 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
