import { useState } from 'react';
import { useEffect } from 'react';

const categories = [
  { id: 1, name: 'Technology', subcategories: ['Laptops', 'Desktop PCs', 'Mobile Phones', 'Tablets', 'Smartwatches', 'Device Accessories', 'Cameras and Photography', 'Audio and Sound', 'Video Game Consoles'] },
  { id: 2, name: 'Clothing', subcategories: ['Shirts', 'T-Shirts', 'Jackets', 'Coats', 'Pants', 'Skirts', 'Dresses', 'Shoes', 'Sneakers', 'Boots', 'Sandals', 'Slippers', 'Hats'] },
  { id: 3, name: 'Appliances', subcategories: ['Refrigerators', 'Washing Machines', 'Dryers', 'Coffee Makers', 'Microwaves', 'Blenders', 'Vacuum Cleaners', 'Irons'] },
  { id: 4, name: 'Health and Beauty', subcategories: ['Makeup', 'Skin Care', 'Hair Care', 'Fragrances and Perfumes', 'Supplements and Vitamins', 'Massagers and Relaxation'] },
  { id: 5, name: 'Vehicles', subcategories: ['Cars', 'Motorcycles', 'Trucks', 'Bicycles', 'Boats'] },
  { id: 6, name: 'Home', subcategories: ['Furniture', 'Decoration', 'Lighting', 'Bathroom', 'Kitchen and Dining', 'Outdoor and Garden', 'Cleaning Supplies'] },
  { id: 7, name: 'Housing and Accommodation', subcategories: ['Houses for Rent', 'Houses for Sale', 'Apartments for Rent', 'Apartments for Sale', 'Studio Apartments', 'Country Houses for Rent', 'Rooms', 'Land'] },
  { id: 8, name: 'Subscriptions', subcategories: ['Netflix', 'Spotify', 'Apple Music', 'HBO Max', 'Crunchyroll', 'Tidal', 'Amazon Prime Video', 'Disney+', 'Xbox Game Pass', 'PlayStation Plus', 'Discord Nitro'] },
  { id: 9, name: 'Heavy Machinery', subcategories: ['Dump Trucks', 'Excavators', 'Motor Graders', 'Backhoe Loaders', 'Forklifts', 'Cranes', 'Bulldozers', 'Front Loaders'] },
];

export default function PostCategory({ 
  onMainCategoryChange, 
  onSubcategoryChange, 
  initialMainCategory = "", 
  initialSubcategory = "", 
  isRequired = false
}) {

  const [selectedCategory, setSelectedCategory] = useState(categories.find(category => category.name === initialMainCategory) || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    const category = categories.find((cat) => cat.id === categoryId);
    setSelectedCategory(category);
  
    // Establece el valor de la subcategoría en null cada vez que se cambia la categoría principal
    setSelectedSubcategory(null);
  
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
  
    // Cambia "onSubCategoryChange" a "onSubcategoryChange"
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }
  };   

  useEffect(() => {
    if (initialSubcategory && initialSubcategory !== selectedSubcategory) {
      setSelectedSubcategory(initialSubcategory);
    }
  }, [initialSubcategory]);  

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
    <option value="">Select subcategory</option>
  );

  return (
    <div className="d-flex flex-wrap align-items-center">
      <select id="category-select" className="form-select me-4" value={selectedCategory?.id} onChange={handleCategoryChange} required={isRequired}>
        <option value="">Select a category</option>
        {categoryOptions}
      </select>

      {selectedCategory && (
        <>
          <select id="subcategory-select" className="form-select mt-2" value={selectedSubcategory} onChange={handleSubcategoryChange} required={isRequired}>
          <option value="">Select subcategory</option>
            {subcategoryOptions}
          </select>
        </>
      )}
    </div>
  );
};