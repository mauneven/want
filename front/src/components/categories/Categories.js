import React, { useState, useEffect } from 'react';

const categories = [
  {
    category: 'Tecnología',
    subcategories: ['Hardware', 'Software', 'Electrónica'],
  },
  {
    category: 'Muebles',
    subcategories: ['Hogar', 'Oficina'],
  },
  {
    category: 'Electrodomésticos',
    subcategories: ['Cocina', 'Lavandería'],
  },
  {
    category: 'Servicios',
    subcategories: ['Limpieza', 'Jardinería', 'Mantenimiento'],
  },
];

const Categories = ({ onCategoryChange, onSubcategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    handleSubcategoryChange();
  }, [selectedSubcategory]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedSubcategory('');
    onCategoryChange && onCategoryChange(category);
  };

  const handleSubcategoryChange = () => {
    onSubcategoryChange && onSubcategoryChange(selectedSubcategory);
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      <label htmlFor="category-select" className="me-2 mb-0">
        Category:
      </label>
      <select id="category-select" className="form-select me-4" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Choose a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category.category}>
            {category.category}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <React.Fragment>
          <label htmlFor="subcategory-select" className="me-2 mb-0">
            Subcategory:
          </label>
          <select
            id="subcategory-select"
            className="form-select"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">Choose a subcategory</option>
            {categories
              .find((category) => category.category === selectedCategory)
              .subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory}
                </option>
              ))}
          </select>
        </React.Fragment>
      )}
    </div>
  );
};

export default Categories;