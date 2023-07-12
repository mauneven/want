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
      const subCategory = category.subcategories.find((subcat) => subcat.id === selectedSubcategory);
      setThirdCategoryOptions(subCategory ? subCategory.thirdCategories : []);
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
    const subCategory = event.target.value;
    setSelectedSubcategory(subCategory);

    if (onSubcategoryChange) {
      onSubcategoryChange(subCategory);
    }

    const category = categoriesData.find((cat) => cat.id === selectedCategory);
    const selectedSubcategoryData = category.subcategories.find((subcat) => subcat.id === subCategory);
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
        className="form-select mt-2 want-rounded"
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
          id="subCategory-select"
          className="form-select mt-2 want-rounded"
          value={selectedSubcategory || initialSubcategory}
          onChange={handleSubcategoryChange}
          required={isRequired}
        >
          <option value="">{t('categories.selectSubCategory')}</option>
          {subcategoryOptions.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {getSubcategoryTranslation(selectedCategory, subCategory.id)}
            </option>
          ))}
        </select>
      )}

      {selectedSubcategory && (
        <select
          id="thirdcategory-select"
          className="form-select mt-2 want-rounded"
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