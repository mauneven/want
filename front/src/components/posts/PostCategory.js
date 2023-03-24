import { useState } from 'react';

const categories = [
  { id: 1, name: 'Tecnología', subcategories: ['Tablets', 'Computador', 'Celulares'] },
  { id: 2, name: 'Ropa', subcategories: ['Camisa', 'Camiseta', 'Pantalones', 'Zapatos'] },
  { id: 3, name: 'Hogar', subcategories: ['Muebles', 'Electrodomésticos', 'Decoración'] },
];

const PostCategory = ({ onMainCategoryChange, onSubCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);


  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    const category = categories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
    setSelectedSubcategory(null);

    if (onMainCategoryChange) {
      onMainCategoryChange(category ? category.name : '');
    }
  };

  const handleSubcategoryChange = (event) => {
    const subcategory = event.target.value;
    setSelectedSubcategory(subcategory);

    if (onSubCategoryChange) {
      onSubCategoryChange(subcategory);
    }
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      <label htmlFor="category-select" className="me-2 mb-0">Categoría:</label>
      <select id="category-select" className="form-select me-4" value={selectedCategory?.id} onChange={handleCategoryChange}>
        <option value="">Seleccione una categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <>
          <label htmlFor="subcategory-select" className="me-2 mb-0">Subcategoría:</label>
          <select id="subcategory-select" className="form-select" value={selectedSubcategory} onChange={handleSubcategoryChange}>
            <option value="">Seleccione una subcategoría</option>
            {selectedCategory.subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default PostCategory;
