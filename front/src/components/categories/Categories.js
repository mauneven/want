// PostCategory.js
import React, { useState, useEffect } from 'react';
import categoriesData from '../../data/categories.json';

export default function PostCategory({
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  initialMainCategory = '',
  initialSubcategory = '',
  initialThirdCategory = '',
  isRequired = false
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    categoriesData.categories.find((category) => category.name === initialMainCategory) || null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedThirdCategory, setSelectedThirdCategory] = useState(initialThirdCategory);

  useEffect(() => {
    const category = categoriesData.categories.find((cat) => cat.name === initialMainCategory) || null;
    setSelectedCategory(category);

    const subcategory = category?.subcategories.find((subcat) => subcat.name === initialSubcategory) || null;
    setSelectedSubcategory(subcategory?.name || '');
    setSelectedThirdCategory(initialThirdCategory);

    if (onMainCategoryChange) {
      onMainCategoryChange(category?.name || '');
    }

    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory?.name || '');
    }

    if (onThirdCategoryChange) {
      onThirdCategoryChange(initialThirdCategory);
    }
  }, [initialMainCategory, initialSubcategory, initialThirdCategory, onMainCategoryChange, onSubcategoryChange, onThirdCategoryChange]);

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    const category = categoriesData.categories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
    setSelectedSubcategory('');
    setSelectedThirdCategory('');

    if (onMainCategoryChange) {
      onMainCategoryChange(category?.name || '');
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

  const categoryOptions = categoriesData.categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  const subcategoryOptions = selectedCategory ? (
    selectedCategory.subcategories.map((subcategory) => (
      <option key={subcategory.id} value={subcategory.name}>
        {subcategory.name}
      </option>
    ))
  ) : (
    <option value="">Select a subcategory</option>
  );

  const thirdCategoryOptions = selectedSubcategory && selectedCategory ? (
    selectedCategory.subcategories
      .find((subcategory) => subcategory.name === selectedSubcategory)
      ?.thirdCategories.map((thirdCategory, index) => (
        <option key={index} value={thirdCategory.name}>
          {thirdCategory.name}
        </option>
      ))
  ) : (
    <option value="">Select a third category</option>
  );

  return (
    <div className="d-flex flex-wrap align-items-center">
      <select
        id="category-select"
        className="form-select me-4"
        value={selectedCategory?.id}
        onChange={handleCategoryChange}
        required={isRequired}
      >
        <option value="">Select a category</option>
        {categoryOptions}
      </select>

      {selectedCategory && (
        <>
          <select
            id="subcategory-select"
            className="form-select mt-2"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            required={isRequired}
          >
            <option value="">Select a subcategory</option>
            {subcategoryOptions}
          </select>

          {selectedSubcategory && (
            <select
              id="thirdcategory-select"
              className="form-select mt-2"
              value={selectedThirdCategory}
              onChange={handleThirdCategoryChange}
              required={isRequired}
            >
              <option value="">Select a third category</option>
              {thirdCategoryOptions}
            </select>
          )}
        </>
      )}
    </div>
  );
}