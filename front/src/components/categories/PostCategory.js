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
  onSearchTermChange,
  searchTerm,
  keepCategories,
}) {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState(initialMainCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedThirdCategory, setSelectedThirdCategory] = useState(initialThirdCategory);
  const contentRef = useRef(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const clearAllCategories = () => {
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
  };

  const getUserPreferences = async () => {
    try {
      if (userPreferencesLoaded) {
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/preferences`, {
        credentials: "include",
      });
      const data = await response.json();
      setUserPreferences(data);
      setUserPreferencesLoaded(true);
    } catch (error) {
      console.error("Error al obtener las preferencias de usuario:", error);
    }
  };

  useEffect(() => {
    getUserPreferences();
  }, []);

  useEffect(() => {
    setSelectedCategory(initialMainCategory);
    setSelectedSubcategory(initialSubcategory);
    setSelectedThirdCategory(initialThirdCategory);
  }, [initialMainCategory, initialSubcategory, initialThirdCategory]);

  const handleCategoryChange = (category) => {
    if (searchTerm) {
      return;
    }
  
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

  const isSubcategoryVisible = (category) => {
    if (!selectedCategory || selectedCategory === category.id) {
      return true;
    }
    return false;
  };

  const isThirdCategoryVisible = (subcategory) => {
    if (!selectedSubcategory || selectedSubcategory === subcategory.id) {
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
    if (selectedCategory || selectedSubcategory || selectedThirdCategory || searchTerm) {
      if (!keepCategories && searchTerm !== "") {
        clearAllCategories(); // Reset all selected categories
      }
    }
  }, [selectedCategory, selectedSubcategory, selectedThirdCategory, searchTerm, keepCategories]);

  useEffect(() => {
    setSelectedCategory(initialMainCategory);
    setSelectedSubcategory(initialSubcategory);
    setSelectedThirdCategory(initialThirdCategory);
  }, [initialMainCategory, initialSubcategory, initialThirdCategory, searchTerm, keepCategories]);

  useEffect(() => {
    return () => {
      setUserPreferencesLoaded(false);
    };
  }, []);

  return (
    <div className="d-flex">
      <div className="col-auto d-flex align-items-center justify-content-center">
        {showLeftScroll && (
          <i className="bi bi-arrow-left fs-1" onClick={scrollLeft}></i>
        )}
      </div>
      <div className="col" style={{ overflowX: "hidden" }}>
        <div className="slider-container" ref={contentRef} onScroll={handleScroll}>
          <div className="d-flex" style={{ whiteSpace: "nowrap" }}>
            {categoriesData.map((category) => (
              <button
                key={category.id}
                id={category.id}
                className={`want-rounded  m-2 ${
                  selectedCategory === category.id ? " want-button " : "generic-button"
                }`}
                onClick={() => {
                  handleButtonClick(category.id, "", "");
                  handleCategoryChange(category.id);
                }}
                style={{
                  display: isSubcategoryVisible(category) ? "inline-block" : "none",
                }}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <div>{getCategoryTranslation(category.id)}</div>
                  <div
                    className={`${
                      selectedCategory === category.id
                        ? "animate__animated animate__bounceIn d-flex justify-content-center align-items-center"
                        : ""
                    }`}
                  >
                    {selectedCategory === category.id && (
                      <i className="bi bi-x-circle close-button-categories"></i>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {selectedCategory &&
              categoriesData
                .find((cat) => cat.id === selectedCategory)
                .subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    id={`${selectedCategory}_${subcategory.id}`}
                    className={`want-rounded  m-2 ${
                      selectedSubcategory === subcategory.id ? "want-button" : "generic-button"
                    }`}
                    onClick={() => {
                      handleButtonClick(selectedCategory, subcategory.id, "");
                      handleSubcategoryChange(subcategory.id);
                    }}
                    style={{
                      display: isThirdCategoryVisible(subcategory) ? "inline-block" : "none",
                    }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <div>
                        {getSubcategoryTranslation(selectedCategory, subcategory.id)}
                      </div>
                      <div
                        className={`${
                          selectedSubcategory === subcategory.id
                            ? "animate__animated animate__bounceIn d-flex justify-content-center align-items-center"
                            : ""
                        }`}
                      >
                        {selectedSubcategory === subcategory.id && (
                          <i className="bi bi-x-circle close-button-categories"></i>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

            {selectedSubcategory &&
              categoriesData
                .find((cat) => cat.id === selectedCategory)
                .subcategories.find((sub) => sub.id === selectedSubcategory)
                .thirdCategories.map((thirdCategory) => (
                  <button
                    key={thirdCategory.id}
                    id={`${selectedCategory}_${selectedSubcategory}_${thirdCategory.id}`}
                    className={`want-rounded  m-2 ${
                      selectedThirdCategory === thirdCategory.id ? "want-button" : "generic-button"
                    }`}
                    onClick={() => {
                      handleButtonClick(
                        selectedCategory,
                        selectedSubcategory,
                        thirdCategory.id
                      );
                      handleThirdCategoryChange(thirdCategory.id);
                    }}
                    style={{
                      display: isThirdCategoryButtonVisible(thirdCategory) ? "inline-block" : "none",
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
                            ? "animate__animated animate__bounceIn d-flex justify-content-center align-items-center"
                            : ""
                        }`}
                      >
                        {selectedThirdCategory === thirdCategory.id && (
                          <i className="bi bi-x-circle close-button-categories"></i>
                        )}
                      </div>
                    </div>
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
  );
}
