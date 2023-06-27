import React, { useState, useEffect, useRef } from "react";
import categoriesData from "../../data/categories.json";
import { useTranslation } from "react-i18next";

export default function PostCategory({
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  initialMainCategory = "",
  initialSubcategory = "",
  initialThirdCategory = "",
  isRequired = false,
}) {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState(initialMainCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedThirdCategory, setSelectedThirdCategory] = useState(initialThirdCategory);
  const contentRef = useRef(null);

  useEffect(() => {
    setSelectedCategory(initialMainCategory);
    setSelectedSubcategory(initialSubcategory);
    setSelectedThirdCategory(initialThirdCategory);
  }, [initialMainCategory, initialSubcategory, initialThirdCategory]);

  const handleCategoryChange = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedThirdCategory("");

      if (onMainCategoryChange) {
        onMainCategoryChange("");
      }

      if (onSubcategoryChange) {
        onSubcategoryChange("");
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory("");
      setSelectedThirdCategory("");

      if (onMainCategoryChange) {
        onMainCategoryChange(category);
      }

      if (onSubcategoryChange) {
        onSubcategoryChange("");
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
    }
  };

  const handleSubcategoryChange = (subcategory) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory("");
      setSelectedThirdCategory("");

      if (onSubcategoryChange) {
        onSubcategoryChange("");
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
    } else {
      setSelectedSubcategory(subcategory);
      setSelectedThirdCategory("");

      if (onSubcategoryChange) {
        onSubcategoryChange(subcategory);
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
    }
  };

  const handleThirdCategoryChange = (thirdCategory) => {
    if (selectedThirdCategory === thirdCategory) {
      setSelectedThirdCategory("");

      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
    } else {
      setSelectedThirdCategory(thirdCategory);

      if (onThirdCategoryChange) {
        onThirdCategoryChange(thirdCategory);
      }
    }
  };

  const getCategoryTranslation = (categoryId) => {
    return t(`categories.${categoryId}.name`);
  };

  const getSubcategoryTranslation = (categoryId, subcategoryId) => {
    return t(`categories.${categoryId}.subcategories.${subcategoryId}.name`);
  };

  const getThirdCategoryTranslation = (categoryId, subcategoryId, thirdCategoryId) => {
    return t(
      `categories.${categoryId}.subcategories.${subcategoryId}.thirdCategories.${thirdCategoryId}.name`
    );
  };

  const scrollLeft = () => {
    const container = contentRef.current;
    container.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const container = contentRef.current;
    container.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="d-flex">
      <div className="col-auto">
        <i className="bi bi-caret-left" onClick={scrollLeft}></i>
      </div>
      <div className="col" style={{ overflowX: "hidden" }}>
        <div className="slider-container" ref={contentRef}>
          <div className="d-flex" style={{ whiteSpace: "nowrap" }}>
            {categoriesData.map((category) => (
              <button
                key={category.id}
                className={`btn rounded-5 border m-2 animate__fadeIn animate__animated ${
                  selectedCategory === category.id ? " want-button border-0" : ""
                }`}
                onClick={() => handleCategoryChange(category.id)}
                style={{
                  display:
                    selectedCategory !== "" && selectedCategory !== category.id
                      ? "none"
                      : "inline-block",
                }}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <div>{getCategoryTranslation(category.id)}</div>
                  <div
                    className={`${
                      selectedCategory === category.id
                        ? "animate__animated animate__slideInRight"
                        : ""
                    }`}
                  >
                    {selectedCategory === category.id && (
                      <i
                        className="bi bi-arrow-left text-white p-2 fs-5"
                        onClick={() => handleCategoryChange("")}
                      ></i>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {selectedCategory && (
              <>
                {categoriesData
                  .find((cat) => cat.id === selectedCategory)
                  .subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      className={`btn rounded-5 border m-2 animate__fadeIn animate__animated ${
                        selectedSubcategory === subcategory.id ? "want-button" : ""
                      }`}
                      onClick={() => handleSubcategoryChange(subcategory.id)}
                      style={{
                        display:
                          selectedSubcategory !== "" &&
                          selectedSubcategory !== subcategory.id
                            ? "none"
                            : "inline-block",
                      }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <div>
                          {getSubcategoryTranslation(
                            selectedCategory,
                            subcategory.id
                          )}
                        </div>
                        <div
                          className={`${
                            selectedSubcategory === subcategory.id
                              ? "animate__animated animate__slideInRight"
                              : ""
                          }`}
                        >
                          {selectedSubcategory === subcategory.id && (
                            <i
                              className="bi bi-arrow-left text-white p-2 fs-5"
                              onClick={() => handleSubcategoryChange("")}
                            ></i>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
              </>
            )}

            {selectedSubcategory && (
              <>
                {categoriesData
                  .find((cat) => cat.id === selectedCategory)
                  .subcategories.find((subcat) => subcat.id === selectedSubcategory)
                  .thirdCategories.map((thirdCategory) => (
                    <button
                      key={thirdCategory.id}
                      className={`btn rounded-5 border m-2 animate__fadeIn animate__animated ${
                        selectedThirdCategory === thirdCategory.id ? "want-button" : ""
                      }`}
                      onClick={() => handleThirdCategoryChange(thirdCategory.id)}
                      style={{
                        display:
                          selectedThirdCategory !== "" &&
                          selectedThirdCategory !== thirdCategory.id
                            ? "none"
                            : "inline-block",
                      }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <div>
                          {getThirdCategoryTranslation(
                            selectedCategory,
                            selectedSubcategory,
                            thirdCategory.id
                          )}
                        </div>
                        <div
                          className={`${
                            selectedThirdCategory === thirdCategory.id
                              ? "animate__animated animate__slideInRight"
                              : ""
                          }`}
                        >
                          {selectedThirdCategory === thirdCategory.id && (
                            <i
                              className="bi bi-arrow-left text-white p-2 fs-5"
                              onClick={() => handleThirdCategoryChange("")}
                            ></i>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-auto">
        <i className="bi bi-caret-right" onClick={scrollRight}></i>
      </div>
    </div>
  );
}
