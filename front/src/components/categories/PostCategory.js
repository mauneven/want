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
  const [selectedThirdCategory, setSelectedThirdCategory] = useState(initialThirdCategory);

  useEffect(() => {
    setSelectedCategory(initialMainCategory);
    setSelectedSubcategory(initialSubcategory);
    setSelectedThirdCategory(initialThirdCategory);
  }, [initialMainCategory, initialSubcategory, initialThirdCategory]);

  const handleCategoryChange = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      setSelectedSubcategory('');
      setSelectedThirdCategory('');

      if (onMainCategoryChange) {
        onMainCategoryChange('');
      }

      if (onSubcategoryChange) {
        onSubcategoryChange('');
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange('');
      }
    } else {
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
    }
  };

  const handleSubcategoryChange = (subcategory) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory('');
      setSelectedThirdCategory('');

      if (onSubcategoryChange) {
        onSubcategoryChange('');
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange('');
      }
    } else {
      setSelectedSubcategory(subcategory);
      setSelectedThirdCategory('');

      if (onSubcategoryChange) {
        onSubcategoryChange(subcategory);
      }

      if (onThirdCategoryChange) {
        onThirdCategoryChange('');
      }
    }
  };

  const handleThirdCategoryChange = (thirdCategory) => {
    if (selectedThirdCategory === thirdCategory) {
      setSelectedThirdCategory('');

      if (onThirdCategoryChange) {
        onThirdCategoryChange('');
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
    return t(`categories.${categoryId}.subcategories.${subcategoryId}.thirdCategories.${thirdCategoryId}.name`);
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      {categoriesData.map((category) => (
        <button
          key={category.id}
          className={`btn btn-outline-primary mx-2 mt-2 ${
            selectedCategory === category.id ? 'active' : ''
          }`}
          onClick={() => handleCategoryChange(category.id)}
          style={{ display: selectedCategory !== '' && selectedCategory !== category.id ? 'none' : 'inline-block' }}
        >
          {getCategoryTranslation(category.id)}
          {selectedCategory === category.id && (
            <button
              className="btn btn-outline-danger btn-sm ms-2"
              onClick={() => handleCategoryChange('')}
            >
              X
            </button>
          )}
        </button>
      ))}

      {selectedCategory && (
        <>
          <span>|</span>
          {categoriesData
            .find((cat) => cat.id === selectedCategory)
            .subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                className={`btn btn-outline-primary mx-2 mt-2 ${
                  selectedSubcategory === subcategory.id ? 'active' : ''
                }`}
                onClick={() => handleSubcategoryChange(subcategory.id)}
                style={{ display: selectedSubcategory !== '' && selectedSubcategory !== subcategory.id ? 'none' : 'inline-block' }}
              >
                {getSubcategoryTranslation(selectedCategory, subcategory.id)}
                {selectedSubcategory === subcategory.id && (
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => handleSubcategoryChange('')}
                  >
                    X
                  </button>
                )}
              </button>
            ))}
        </>
      )}

      {selectedSubcategory && (
        <>
          <span>|</span>
          {categoriesData
            .find((cat) => cat.id === selectedCategory)
            .subcategories.find((subcat) => subcat.id === selectedSubcategory)
            .thirdCategories.map((thirdCategory) => (
              <button
                key={thirdCategory.id}
                className={`btn btn-outline-primary mx-2 mt-2 ${
                  selectedThirdCategory === thirdCategory.id ? 'active' : ''
                }`}
                onClick={() => handleThirdCategoryChange(thirdCategory.id)}
                style={{ display: selectedThirdCategory !== '' && selectedThirdCategory !== thirdCategory.id ? 'none' : 'inline-block' }}
              >
                {getThirdCategoryTranslation(
                  selectedCategory,
                  selectedSubcategory,
                  thirdCategory.id
                )}
                {selectedThirdCategory === thirdCategory.id && (
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => handleThirdCategoryChange('')}
                  >
                    X
                  </button>
                )}
              </button>
            ))}
        </>
      )}
    </div>
  );
}
