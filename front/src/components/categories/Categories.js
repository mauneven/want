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
    console.log("Maincategory:", category);

    if (onMainCategoryChange) {
      onMainCategoryChange(category ? category.name : '');
    }
  };

  const handleSubcategoryChange = (event) => {
    const subcategory = event.target.value;
    setSelectedSubcategory(subcategory);
    console.log("Subcategory:", subcategory);

    if (onSubCategoryChange) {
      onSubCategoryChange(subcategory);
    }
  };

  const categoryOptions = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  const subcategoryOptions = selectedCategory ? (
    selectedCategory.subcategories.map((subcategory) => (
      <option key={subcategory} value={subcategory}>
        {subcategory}
      </option>
    ))
  ) : (
    <option value="">Choose the subcategory</option>
  );

  return (
    <div className="d-flex flex-wrap align-items-center">
      <label htmlFor="category-select" className="me-2 mb-0">Category of what you Want:</label>
      <select id="category-select" className="form-select me-4" value={selectedCategory?.id} onChange={handleCategoryChange}>
        <option value="">Choose the category</option>
        {categoryOptions}
      </select>

      {selectedCategory && (
        <>
          <label htmlFor="subcategory-select" className="me-2 mb-0">Sub category of what you Want:</label>
          <select id="subcategory-select" className="form-select" value={selectedSubcategory} onChange={handleSubcategoryChange}>
            {subcategoryOptions}
          </select>
        </>
      )}
    </div>
  );
};

export default PostCategory;