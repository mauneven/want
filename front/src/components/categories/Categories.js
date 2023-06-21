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

  const [selectedCategory, setSelectedCategory] = useState(initialMainCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedThirdCategory, setSelectedThirdCategory] = useState('');

  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [thirdCategoryOptions, setThirdCategoryOptions] = useState([]);

  useEffect(() => {
    setSelectedCategory(initialMainCategory);
    setSelectedSubcategory(initialSubcategory);
    setSelectedThirdCategory(initialThirdCategory);
  }, [initialMainCategory, initialSubcategory, initialThirdCategory]);

  useEffect(() => {
    if (selectedCategory) {
      const category = categoriesData.find((cat) => cat.id === selectedCategory);
      setSubcategoryOptions(category ? category.subcategories : []);
      setSelectedSubcategory(initialSubcategory !== '' ? initialSubcategory : '');
      setSelectedThirdCategory('');
    } else {
      setSubcategoryOptions([]);
      setSelectedSubcategory('');
      setSelectedThirdCategory('');
    }
  }, [selectedCategory]);  

  useEffect(() => {
    if (selectedSubcategory) {
      const category = categoriesData.find((cat) => cat.id === selectedCategory);
      const subcategory = category.subcategories.find((subcat) => subcat.id === selectedSubcategory);
      setThirdCategoryOptions(subcategory ? subcategory.thirdCategories : []);
      setSelectedThirdCategory(initialThirdCategory !== '' ? initialThirdCategory : '');
    } else {
      setThirdCategoryOptions([]);
      setSelectedThirdCategory('');
    }
  }, [selectedSubcategory]);  

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

    const selectedCategoryData = categoriesData.find((cat) => cat.id === category);
    setSubcategoryOptions(selectedCategoryData ? selectedCategoryData.subcategories : []);
  };

  const handleSubcategoryChange = (event) => {
    const subcategory = event.target.value;
    setSelectedSubcategory(subcategory);

    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }

    const category = categoriesData.find((cat) => cat.id === selectedCategory);
    const selectedSubcategoryData = category.subcategories.find((subcat) => subcat.id === subcategory);
    setThirdCategoryOptions(selectedSubcategoryData ? selectedSubcategoryData.thirdCategories : []);

    setSelectedThirdCategory('');
  };

  const handleThirdCategoryChange = (event) => {
    const thirdCategory = event.target.value;
    setSelectedThirdCategory(thirdCategory);

    if (onThirdCategoryChange) {
      onThirdCategoryChange(thirdCategory);
    }
  };

  const getCategoryTranslation = (categoryId) => {
    return t(`categories.${categoryId}.name`);
  };

  const getSubcategoryTranslation = (categoryId, subcategoryId) => {
    return t(`categories.${categoryId}.subcategories.${subcategoryId}.name`);
  };

  const getThirdCategoryTranslation = (categoryId, subcategoryId, thirdCategoryId) => {
    return t(`categories.${categoryId}.subcategories.${subcategoryId}.thirdCategories.${thirdCategoryId}.name`);
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      <select
        id="category-select"
        className="form-select mt-2 rounded-4"
        value={selectedCategory}
        onChange={handleCategoryChange}
        required={isRequired}
      >
        <option value="">{t('categories.selectMainCategory')}</option>
        {categoriesData.map((category) => (
          <option key={category.id} value={category.id}>
            {getCategoryTranslation(category.id)}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <select
          id="subcategory-select"
          className="form-select mt-2 rounded-4"
          value={selectedSubcategory || initialSubcategory}
          onChange={handleSubcategoryChange}
          required={isRequired}
        >
          <option value="">{t('categories.selectSubCategory')}</option>
          {subcategoryOptions.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {getSubcategoryTranslation(selectedCategory, subcategory.id)}
            </option>
          ))}
        </select>
      )}

      {selectedSubcategory && (
        <select
          id="thirdcategory-select"
          className="form-select mt-2 rounded-4"
          value={selectedThirdCategory}
          onChange={handleThirdCategoryChange}
          required={isRequired}
        >
          <option value="">{t('categories.selectThirdCategory')}</option>
          {thirdCategoryOptions.map((thirdCategory) => (
            <option key={thirdCategory.id} value={thirdCategory.id}>
              {getThirdCategoryTranslation(selectedCategory, selectedSubcategory, thirdCategory.id)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}