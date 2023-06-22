import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import categoriesData from '../../data/categories.json';

export default function CategorySlider({ onCategorySelected }) {
  const { t } = useTranslation();
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showLeftButton, setShowLeftButton] = useState(true);
  const [showRightButton, setShowRightButton] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const sliderContainer = sliderRef.current;
    if (sliderContainer) {
      sliderContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Verificar los botones al cargar el componente

      return () => {
        sliderContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleScroll = () => {
    const sliderContainer = sliderRef.current;
    if (sliderContainer) {
      const scrollLeft = sliderContainer.scrollLeft || 0;
      const scrollWidth = sliderContainer.scrollWidth || 0;
      const clientWidth = sliderContainer.clientWidth || 0;
      const maxScrollLeft = scrollWidth - clientWidth;
  
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < maxScrollLeft || maxScrollLeft === 0);
    }
  };  

  const handleSubcategoryClick = (mainCategory, subcategory) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory('');
      if (onCategorySelected) {
        onCategorySelected('', '');
      }
    } else {
      setSelectedSubcategory(subcategory);
      if (onCategorySelected) {
        onCategorySelected(mainCategory, subcategory);
      }
    }
  };

  const getSubcategoryTranslation = (mainCategory, subcategoryId) => {
    return t(`categories.${mainCategory}.subcategories.${subcategoryId}.name`);
  };

  const allSubcategories = categoriesData.reduce(
    (acc, category) => [...acc, ...category.subcategories],
    []
  );

  const handleLeftButtonClick = () => {
    const sliderContainer = sliderRef.current;
    if (sliderContainer) {
      const clientWidth = sliderContainer.clientWidth || 0;
      sliderContainer.scrollLeft -= clientWidth / 2;
    }
  };

  const handleRightButtonClick = () => {
    const sliderContainer = sliderRef.current;
    if (sliderContainer) {
      const clientWidth = sliderContainer.clientWidth || 0;
      sliderContainer.scrollLeft += clientWidth / 2;
    }
  };

  return (
    <div className="category-slider-container categories-slider">
      <button
        className="slider-button left-button"
        onClick={handleLeftButtonClick}
        disabled={!showLeftButton}
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <div className="category-slider" ref={sliderRef}>
        {allSubcategories.map((subcategory) => (
          <button
            className={`subcategory-button btn rounded-5 border ${
              selectedSubcategory === subcategory.id ? 'active' : ''
            }`}
            key={subcategory.id}
            onClick={() =>
              handleSubcategoryClick(
                categoriesData.find((category) =>
                  category.subcategories.find((sub) => sub.id === subcategory.id)
                ).id,
                subcategory.id
              )
            }
          >
            {getSubcategoryTranslation(
              categoriesData.find((category) =>
                category.subcategories.find((sub) => sub.id === subcategory.id)
              ).id,
              subcategory.id
            )}
          </button>
        ))}
      </div>
      <button
        className="slider-button right-button"
        onClick={handleRightButtonClick}
        disabled={!showRightButton}
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}
