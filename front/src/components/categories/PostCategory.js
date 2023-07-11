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
  resetAll,
  detailsCategory,
  detailsSubcategory,
  detailsThirdCategory,
  onDetailsCategoryChange,
  onDetailsSubcategoryChange,
  onDetailsThirdCategoryChange,
}) {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedThirdCategory, setSelectedThirdCategory] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const contentRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const handleDetailsCategoryChange = (
    category,
    subcategory,
    thirdCategory
  ) => {
    handleButtonClick(category, subcategory, thirdCategory);
    handleCategoryChange(category);
    handleSubcategoryChange(subcategory);
    handleThirdCategoryChange(thirdCategory);
  };
  
  useEffect(() => {
    if (detailsCategory !== "") {
      handleDetailsCategoryChange(
        detailsCategory,
        detailsSubcategory,
        detailsThirdCategory
      );
    }
  }, [detailsCategory, detailsSubcategory, detailsThirdCategory]);  

  const clearAllCategories = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedThirdCategory("");
    onDetailsCategoryChange("");
    onDetailsSubcategoryChange("");
    onDetailsThirdCategoryChange("");
  };

  const handleCategoryChange = (category) => {
    if (selectedCategory !== category) {
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
  
  const handleSubcategoryChange = (subcategory) => {
    if (selectedSubcategory !== subcategory) {
      setSelectedSubcategory(subcategory);
      setSelectedThirdCategory("");
      if (onSubcategoryChange) {
        onSubcategoryChange(subcategory);
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
      if (onThirdCategoryChange) {
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
    if (searchTerm && !keepCategories) {
      setSearchPerformed(true);
      clearAllCategories();
    }
  }, [searchTerm, keepCategories]);

  useEffect(() => {
    if (resetAll) {
      clearAllCategories();
    }
  }, [resetAll]);

  useEffect(() => {
    if (detailsCategory && detailsSubcategory && detailsThirdCategory) {
      handleButtonClick(
        detailsCategory,
        detailsSubcategory,
        detailsThirdCategory
      );
    }
  }, [detailsCategory, detailsSubcategory, detailsThirdCategory]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("mainCategory");
      localStorage.removeItem("subcategory");
      localStorage.removeItem("thirdCategory");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    // Leer las categorías seleccionadas desde el localStorage
    const storedMainCategory = localStorage.getItem("mainCategory");
    const storedSubcategory = localStorage.getItem("subcategory");
    const storedThirdCategory = localStorage.getItem("thirdCategory");

    if (storedMainCategory) {
      setSelectedCategory(storedMainCategory);
    }
    if (storedSubcategory) {
      setSelectedSubcategory(storedSubcategory);
    }
    if (storedThirdCategory) {
      setSelectedThirdCategory(storedThirdCategory);
    }
  }, []);

  useEffect(() => {
    if (resetAll) {
      localStorage.removeItem("mainCategory");
      localStorage.removeItem("subcategory");
      localStorage.removeItem("thirdCategory");

      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedThirdCategory("");
      onMainCategoryChange("");
      onSubcategoryChange("");
      onThirdCategoryChange("");
    }
  }, [resetAll]);

  useEffect(() => {
    // Guardar las categorías seleccionadas en el localStorage
    localStorage.setItem("mainCategory", selectedCategory);
    localStorage.setItem("subcategory", selectedSubcategory);
    localStorage.setItem("thirdCategory", selectedThirdCategory);
  }, [selectedCategory, selectedSubcategory, selectedThirdCategory]);

  return (
    <>
      <div>
        <p> DC {detailsCategory}</p>
        <p> DS {detailsSubcategory}</p>
        <p> DT {detailsThirdCategory}</p>
      </div>
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
                  .subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      id={`${selectedCategory}_${subcategory.id}`}
                      className={`want-rounded m-2 ${
                        selectedSubcategory === subcategory.id
                          ? "want-button border-selected"
                          : searchPerformed && !keepCategories
                          ? "generic-button border"
                          : "generic-button border"
                      }`}
                      onClick={() => {
                        handleButtonClick(selectedCategory, subcategory.id, "");
                        handleSubcategoryChange(subcategory.id);
                      }}
                      style={{
                        display: isThirdCategoryVisible(subcategory)
                          ? "inline-block"
                          : "none",
                      }}
                    >
                      {getSubcategoryTranslation(
                        selectedCategory,
                        subcategory.id
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
                  .thirdCategories.map((thirdCategory) => (
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