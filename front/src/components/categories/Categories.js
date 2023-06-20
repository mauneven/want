import React, { useState, useEffect } from 'react';
import categoriesData from '../../data/categories.json';
import { useTranslation } from 'react-i18next';

export default function PostCategory({
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  initialMainCategory = '',
  initialSubcategory = '',
  initialThirdCategory = '',
  isRequired = false
}) {
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedThirdCategory, setSelectedThirdCategory] = useState('');

  useEffect(() => {
    setSelectedCategory(initialMainCategory);
    setSelectedSubcategory(initialSubcategory);
    setSelectedThirdCategory(initialThirdCategory);
  }, [initialMainCategory, initialSubcategory, initialThirdCategory]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setSelectedThirdCategory('');

    if (onMainCategoryChange) {
      onMainCategoryChange(category);
    }

    if (onSubcategoryChange) {
      onSubcategoryChange('');
    }

    if (onThirdCategoryChange) {
      onThirdCategoryChange('');
    }
  };

  const handleSubcategoryChange = (event) => {
    const subcategory = event.target.value;
    setSelectedSubcategory(subcategory);
    setSelectedThirdCategory('');

    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }

    if (onThirdCategoryChange) {
      onThirdCategoryChange('');
    }
  };

  const handleThirdCategoryChange = (event) => {
    const thirdCategory = event.target.value;
    setSelectedThirdCategory(thirdCategory);

    if (onThirdCategoryChange) {
      onThirdCategoryChange(thirdCategory);
    }
  };

  const getCategoryOptions = () => {
    return categoriesData.categories.map((category) => (
      <option key={category.id} value={category.id}>
        {t(`categories.${category.id}`)}
      </option>
    ));
  };

  const getSubcategoryOptions = () => {
    const selectedCategoryData = categoriesData.categories.find((category) => category.id === selectedCategory);
    if (selectedCategoryData && selectedCategoryData.subcategories) {
      return selectedCategoryData.subcategories.map((subcategory) => (
        <option key={subcategory.id} value={subcategory.id}>
          {t(`categories.${subcategory.name}`)}
        </option>
      ));
    } else {
      return null;
    }
  };

  const getThirdCategoryOptions = () => {
    const selectedCategoryData = categoriesData.categories.find((category) => category.id === selectedCategory);
    if (selectedCategoryData && selectedCategoryData.subcategories) {
      const selectedSubcategoryData = selectedCategoryData.subcategories.find((subcategory) => subcategory.id === selectedSubcategory);
      if (selectedSubcategoryData && selectedSubcategoryData.thirdCategories) {
        return selectedSubcategoryData.thirdCategories.map((thirdCategory) => (
          <option key={thirdCategory.id} value={thirdCategory.id}>
            {t(`categories.${thirdCategory.name}`)}
          </option>
        ));
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      <select
        id="category-select"
        className="form-select me-4"
        value={selectedCategory}
        onChange={handleCategoryChange}
        required={isRequired}
      >
        <option value="">{t('navbar.selectCategory')}</option>
        {getCategoryOptions()}
      </select>

      {selectedCategory && (
        <select
          id="subcategory-select"
          className="form-select mt-2"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          required={isRequired}
        >
          <option value="">{t('navbar.selectCategory')}</option>
          {getSubcategoryOptions()}
        </select>
      )}

      {selectedSubcategory && (
        <select
          id="thirdcategory-select"
          className="form-select mt-2"
          value={selectedThirdCategory}
          onChange={handleThirdCategoryChange}
          required={isRequired}
        >
          <option value="">{t('navbar.selectCategory')}</option>
          {getThirdCategoryOptions()}
        </select>
      )}
    </div>
  );
}