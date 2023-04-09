import { useState } from 'react';
import { useEffect } from 'react';

const categories = [  { id: 1, name: 'Technology', subcategories: ['Computers', 'Tablets', 'Cell Phones', 'Device Accessories', 'Cameras & Photography', 'Audio & Sound', 'Video Games Consoles'] },
  { id: 2, name: 'Clothing', subcategories: ['Shirts', 'T-Shirts', 'Jackets', 'Coats', 'Pants', 'Skirts', 'Dresses', 'Shoes', 'Tennis', 'Boots', 'Sandals', 'Sneakers'] },
  { id: 3, name: 'Appliances', subcategories: ['Refrigerators', 'Washing Machines', 'Dryers', 'Coffee Makers', 'Microwaves', 'Blenders', 'Vacuum Cleaners', 'Irons'] },
  { id: 4, name: 'Health & Beauty', subcategories: ['Makeup', 'Skin Care', 'Hair Care', 'Fragrances', 'Personal Hygiene', 'Supplements & Vitamins', 'Medical Equipment', 'Massagers & Relaxation'] },
  { id: 5, name: 'Vehicles', subcategories: ['Cars', 'Motorcycles', 'SUVs', 'Trucks', 'Bicycles', 'Boats', 'Airplanes', 'Helicopters'] },
  { id: 6, name: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Lighting', 'Bathroom', 'Kitchen & Dining', 'Outdoor & Garden', 'Cleaning Supplies'] },
  { id: 7, name: 'Subscriptions', subcategories: ['Netflix', 'Spotify', 'Apple Music', 'HBO Max', 'Crunchyroll', 'Tidal', 'Amazon Prime Video', 'Disney+', 'Xbox Game Pass', 'Play Station Plus', 'Discord Nitro'] },
  { id: 8, name: 'Heavy Machinery', subcategories: ['Tippers', 'Excavators', 'Motor Graders', 'Backhoes', 'Forklifts', 'Cranes', 'Bulldozers', 'Front-End Loaders'] },
];

export default function PostCategory({ onMainCategoryChange, onSubcategoryChange, externalSelectedSubcategory, isRequired = false  }) {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    const category = categories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
  
    // Establece el valor de la subcategoría en null cada vez que se cambia la categoría principal
    setSelectedSubcategory(null);
  
    console.log("Maincategory:", category);
  
    if (onMainCategoryChange) {
      onMainCategoryChange(category ? category.name : '');
    }
  
    // Borra la subcategoría seleccionada en el componente padre cuando se cambia la categoría principal
    if (onSubcategoryChange) {
      onSubcategoryChange('');
    }
  };   

  const handleSubcategoryChange = (event) => {
    const subcategory = event.target.value;
    setSelectedSubcategory(subcategory);
    console.log("Subcategory:", subcategory);
  
    // Cambia "onSubCategoryChange" a "onSubcategoryChange"
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }
  };   

  useEffect(() => {
    // Utiliza `externalSelectedSubcategory` en lugar de `selectedSubcategory`
    if (externalSelectedSubcategory && externalSelectedSubcategory !== selectedSubcategory) {
      setSelectedSubcategory(externalSelectedSubcategory);
    }
  }, [externalSelectedSubcategory]);

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
      <label htmlFor="category-select" className="me-2 mb-0">Category</label>
      <select id="category-select" className="form-select me-4" value={selectedCategory?.id} onChange={handleCategoryChange} required={isRequired}>
        <option value="">Choose the category</option>
        {categoryOptions}
      </select>

      {selectedCategory && (
        <>
          <label htmlFor="subcategory-select" className="me-2 mb-0">Sub Category</label>
          <select id="subcategory-select" className="form-select" value={selectedSubcategory} onChange={handleSubcategoryChange} required={isRequired}>
          <option value="">Choose the subcategory</option>
            {subcategoryOptions}
          </select>
        </>
      )}
    </div>
  );
};