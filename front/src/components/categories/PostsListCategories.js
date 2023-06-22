import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import SwiperCore, { Navigation } from "swiper";

import { useTranslation } from "react-i18next";
import categoriesData from "../../data/categories.json";

SwiperCore.use([Navigation]);

export default function PostsListCategories({
  onCategorySelected,
  initialSubcategory = "",
 }) {
  const { t } = useTranslation();
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(initialSubcategory);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const [slidesPerView, setSlidesPerView] = useState(3);

  const getSubcategoryTranslation = (subcategory) => {
    const { categoryId, id } = subcategory;
    const translationKey = `categories.${categoryId}.subcategories.${id}.name`;
    return t(translationKey);
  };

  useEffect(() => {
    const subcategories = categoriesData.reduce((acc, category) => {
      return acc.concat(
        category.subcategories.map((subcategory) => ({
          ...subcategory,
          categoryId: category.id,
        }))
      );
    }, []);
    setSubcategoryOptions(subcategories);
  }, []);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    const categoryWidth = 150; // Ancho estimado de cada categoría
    const categoriesToShow = Math.floor(containerWidth / categoryWidth);
    setSlidesPerView(categoriesToShow);
  }, []);

  return (
    <div className="post-category-slider" ref={containerRef}>
      <Swiper
        navigation
        slidesPerView={slidesPerView}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {subcategoryOptions.map((subcategory) => (
          <SwiperSlide key={subcategory.id}>
            <button
              className={`btn rounded-5 border text-center ${
                selectedSubcategory === subcategory.id ? "active" : ""
              }`}
            >
              {getSubcategoryTranslation(subcategory)}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
