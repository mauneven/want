import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import categoriesData from '../../data/categories.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

export default function CategorySlider({ onCategorySelected }) {
  const { t } = useTranslation();
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const handleSubcategoryClick = (mainCategory, subcategory) => {
    setSelectedSubcategory(subcategory);

    if (onCategorySelected) {
      onCategorySelected(mainCategory, subcategory);
    }
  };

  const getSubcategoryTranslation = (categoryId, subcategoryId) => {
    return t(`categories.${categoryId}.subcategories.${subcategoryId}.name`);
  };

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={4}
      navigation
      onSlideChange={() => console.log('slide change')}
    >
      {categoriesData.map((category) => (
        <SwiperSlide key={category.id}>
          <div className="category">
            <div className="subcategory-slider">
              {category.subcategories.map((subcategory) => (
                <button
                  className={`subcategory-button btn rounded-5 border ${
                    selectedSubcategory === subcategory.id ? 'active' : ''
                  }`}
                  key={subcategory.id}
                  onClick={() =>
                    handleSubcategoryClick(category.id, subcategory.id)
                  }
                >
                  {getSubcategoryTranslation(category.id, subcategory.id)}
                </button>
              ))}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
