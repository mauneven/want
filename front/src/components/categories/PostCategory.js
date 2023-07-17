// postCategory.js

import React, { useState, useEffect, useRef } from "react";
import categoriesData from "../../data/categories.json";
import { useTranslation } from "react-i18next";

export default function PostCategory({
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  onSearchTermChange,
  searchTerm,
  keepCategories,
  mainCategory,
  subCategory,
  thirdCategory,
}) {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState(
    mainCategory || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subCategory || ""
  );
  const [selectedThirdCategory, setSelectedThirdCategory] = useState(
    thirdCategory || ""
  );
  const [searchPerformed, setSearchPerformed] = useState(false);
  const contentRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const clearAllCategories = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedThirdCategory("");
  };

  const handleCategoryChange = (category) => {
    if (selectedCategory !== category) {
      setSelectedCategory(category);
      setSelectedSubcategory("");
      setSelectedThirdCategory("");

      if (onMainCategoryChange && selectedCategory !== category) {
        onMainCategoryChange(category);
      }
      if (onSubcategoryChange) {
        onSubcategoryChange("");
      }
      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
      if (onSearchTermChange) {
        onSearchTermChange("");
      }
    } else {
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
      if (onSearchTermChange) {
        onSearchTermChange("");
      }
    }
  };

  const handleSubcategoryChange = (subCategory) => {
    if (selectedSubcategory !== subCategory) {
      setSelectedSubcategory(subCategory);
      setSelectedThirdCategory("");
      if (onSubcategoryChange && selectedSubcategory !== subCategory) {
        onSubcategoryChange(subCategory);
      }
      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
      if (onSearchTermChange) {
        onSearchTermChange("");
      }
    } else {
      setSelectedSubcategory("");
      setSelectedThirdCategory("");
      if (onSubcategoryChange) {
        onSubcategoryChange("");
      }
      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
      if (onSearchTermChange) {
        onSearchTermChange("");
      }
    }
  };

  const handleThirdCategoryChange = (thirdCategory) => {
    if (selectedThirdCategory !== thirdCategory) {
      setSelectedThirdCategory(thirdCategory);
      if (onThirdCategoryChange && selectedThirdCategory !== thirdCategory) {
        onThirdCategoryChange(thirdCategory);
      }
      if (onSearchTermChange) {
        onSearchTermChange("");
      }
    } else {
      setSelectedThirdCategory("");
      if (onThirdCategoryChange) {
        onThirdCategoryChange("");
      }
      if (onSearchTermChange) {
        onSearchTermChange("");
      }
    }
  };

  const getCategoryTranslation = (categoryId) => {
    return t(`categories.${categoryId}.name`);
  };

  const getSubcategoryTranslation = (categoryId, subcategoryId) => {
    return t(`categories.${categoryId}.subcategories.${subcategoryId}.name`);
  };

  const getThirdCategoryTranslation = (
    categoryId,
    subcategoryId,
    thirdCategoryId
  ) => {
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

  const isSubcategoryVisible = (category) => {
    if (!selectedCategory || selectedCategory === category.id) {
      return true;
    }
    return false;
  };

  const isThirdCategoryVisible = (subCategory) => {
    if (!selectedSubcategory || selectedSubcategory === subCategory.id) {
      return true;
    }
    return false;
  };

  const isThirdCategoryButtonVisible = (thirdCategory) => {
    if (!selectedThirdCategory || selectedThirdCategory === thirdCategory.id) {
      return true;
    }
    return false;
  };

  const handleButtonClick = (categoryId, subcategoryId, thirdCategoryId) => {
    const container = contentRef.current;
    const buttonId = `${categoryId}_${subcategoryId}_${thirdCategoryId}`;
    const buttonElement = document.getElementById(buttonId);

    if (buttonElement) {
      buttonElement.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handleScroll = () => {
    const container = contentRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    handleScroll();
  }, [selectedCategory, selectedSubcategory, selectedThirdCategory]);

  useEffect(() => {
    if (searchTerm && !keepCategories) {
      setSearchPerformed(true);
      clearAllCategories();
    }
  }, [searchTerm, keepCategories]);

  useEffect(() => {
    // Guardar las categorías seleccionadas en el localStorage
    localStorage.setItem("mainCategory", selectedCategory);
    localStorage.setItem("subCategory", selectedSubcategory);
    localStorage.setItem("thirdCategory", selectedThirdCategory);

    // Realizar las peticiones necesarias
    if (onMainCategoryChange) {
      onMainCategoryChange(selectedCategory);
    }
    if (onSubcategoryChange) {
      onSubcategoryChange(selectedSubcategory);
    }
    if (onThirdCategoryChange) {
      onThirdCategoryChange(selectedThirdCategory);
    }
  }, [selectedCategory, selectedSubcategory, selectedThirdCategory]);

  useEffect(() => {
    // Restaurar las categorías seleccionadas del localStorage
    const mainCategory = localStorage.getItem("mainCategory");
    const subCategory = localStorage.getItem("subCategory");
    const thirdCategory = localStorage.getItem("thirdCategory");

    if (mainCategory) {
      setSelectedCategory(mainCategory);
    }
    if (subCategory) {
      setSelectedSubcategory(subCategory);
    }
    if (thirdCategory) {
      setSelectedThirdCategory(thirdCategory);
    }
  }, []);

  return (
    <>
      <div className="d-flex">
        <div className="col-auto d-flex align-items-center justify-content-center">
          {showLeftScroll && (
            <i className="bi bi-arrow-left fs-1" onClick={scrollLeft}></i>
          )}
        </div>
        <div className="col" style={{ overflowX: "hidden" }}>
          <div
            className="slider-container"
            ref={contentRef}
            onScroll={handleScroll}
          >
            <div className="d-flex" style={{ whiteSpace: "nowrap" }}>
              {categoriesData.map((category) => (
                <button
                  key={category.id}
                  id={category.id}
                  className={`want-rounded m-2 ${
                    selectedCategory === category.id
                      ? "want-button border-selected"
                      : searchPerformed && !keepCategories
                      ? "generic-button border"
                      : "generic-button border"
                  }`}
                  onClick={() => {
                    handleButtonClick(category.id, "", "");
                    handleCategoryChange(category.id);
                  }}
                  style={{
                    display: isSubcategoryVisible(category)
                      ? "inline-block"
                      : "none",
                  }}
                >
                  {getCategoryTranslation(category.id)}
                  {selectedCategory && (
                    <>
                      {" "}
                      <i className="bi bi-x-circle"></i>
                    </>
                  )}
                </button>
              ))}

              {selectedCategory &&
                categoriesData
                  .find((cat) => cat.id === selectedCategory)
                  .subcategories.map((subCategory) => (
                    <button
                      key={subCategory.id}
                      id={`${selectedCategory}_${subCategory.id}`}
                      className={`want-rounded m-2 ${
                        selectedSubcategory === subCategory.id
                          ? "want-button border-selected"
                          : searchPerformed && !keepCategories
                          ? "generic-button border"
                          : "generic-button border"
                      }`}
                      onClick={() => {
                        handleButtonClick(selectedCategory, subCategory.id, "");
                        handleSubcategoryChange(subCategory.id);
                      }}
                      style={{
                        display: isThirdCategoryVisible(subCategory)
                          ? "inline-block"
                          : "none",
                      }}
                    >
                      {getSubcategoryTranslation(
                        selectedCategory,
                        subCategory.id
                      )}
                      {selectedSubcategory && (
                        <>
                          {" "}
                          <i className="bi bi-x-circle"></i>
                        </>
                      )}
                    </button>
                  ))}

              {selectedSubcategory &&
                categoriesData
                  .find((cat) => cat.id === selectedCategory)
                  .subcategories.find(
                    (subcat) => subcat.id === selectedSubcategory
                  )
                  ?.thirdCategories.map((thirdCategory) => (
                    <button
                      key={thirdCategory.id}
                      id={`${selectedCategory}_${selectedSubcategory}_${thirdCategory.id}`}
                      className={`want-rounded m-2 ${
                        selectedThirdCategory === thirdCategory.id
                          ? "want-button border-selected"
                          : searchPerformed && !keepCategories
                          ? "generic-button border"
                          : "generic-button border"
                      }`}
                      onClick={() =>
                        handleThirdCategoryChange(thirdCategory.id)
                      }
                      style={{
                        display: isThirdCategoryButtonVisible(thirdCategory)
                          ? "inline-block"
                          : "none",
                      }}
                    >
                      {getThirdCategoryTranslation(
                        selectedCategory,
                        selectedSubcategory,
                        thirdCategory.id
                      )}
                      {selectedThirdCategory && (
                        <>
                          {" "}
                          <i className="bi bi-x-circle"></i>
                        </>
                      )}
                    </button>
                  ))}
            </div>
          </div>
        </div>
        <div className="col-auto d-flex align-items-center justify-content-center">
          {showRightScroll && (
            <i className="bi bi-arrow-right fs-1" onClick={scrollRight}></i>
          )}
        </div>
      </div>
    </>
  );
}