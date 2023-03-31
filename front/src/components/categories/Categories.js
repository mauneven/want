import { useState } from 'react';
import { useEffect } from 'react';

const categories = [  { id: 1, name: 'Technology', subcategories: ['Computers', 'Tablets', 'Cell Phones', 'Device Accessories', 'Cameras & Photography', 'Audio & Sound', 'Video Games & Consoles', 'Printers & Scanners', 'Storage Devices'] },
  { id: 2, name: 'Clothing', subcategories: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Sportswear', 'Swimwear', 'Sleepwear'] },
  { id: 3, name: 'Home', subcategories: ['Furniture', 'Décor', 'Appliances', 'Lighting', 'Bathroom', 'Kitchen & Dining', 'Outdoor & Garden', 'Cleaning Supplies'] },
  { id: 4, name: 'Health & Beauty', subcategories: ['Makeup', 'Skin Care', 'Hair Care', 'Fragrances', 'Personal Hygiene', 'Supplements & Vitamins', 'Medical Equipment', 'Massagers & Relaxation'] },
  { id: 5, name: 'Sports & Outdoor Activities', subcategories: ['Camping & Hiking', 'Cycling', 'Fitness & Exercise', 'Water Sports', 'Winter Sports', 'Fishing', 'Hunting', 'Equestrian'] },
  { id: 6, name: 'Pets', subcategories: ['Dogs', 'Cats', 'Fish', 'Birds', 'Reptiles', 'Small Pets', 'Food & Treats', 'Toys & Accessories'] },
  { id: 7, name: 'Toys & Games', subcategories: ['Baby & Toddler Toys', 'Educational Toys', 'Dolls & Accessories', 'Board Games & Puzzles', 'Outdoor Toys', 'Building Toys', 'Action Figures & Vehicles', 'Video Games & Consoles'] },
  { id: 8, name: 'Travel & Luggage', subcategories: ['Luggage', 'Backpacks & Bags', 'Carry-On Luggage', 'Travel Accessories', 'Transportation & Accommodation', 'Activities & Tours', 'Guidebooks & Maps', 'Language & Translators'] },
  { id: 9, name: 'Tools & Home Improvement', subcategories: ['Hand Tools', 'Power Tools', 'Hardware', 'Paints & Coatings', 'Lighting & Electrical', 'Plumbing & HVAC', 'Home Security', 'Organization & Storage'] },
  { id: 10, name: 'Automotive & Motorcycles', subcategories: ['Parts & Accessories', 'Electronics', 'Tools & Equipment', 'Tires & Wheels', 'Car Care', 'Motorcycle Parts & Accessories', 'Riding Gear', 'Tires & Tubes'] },
  { id: 11, name: 'Books, Movies & Music', subcategories: ['Books', 'eBooks', 'Audiobooks', 'Movies & TV Shows', 'Music', 'Musical Instruments', 'Sheet Music & Scores', 'Concert Tickets'] },
];

export default function PostCategory({ onMainCategoryChange, onSubcategoryChange, externalSelectedSubcategory }) {

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
      <select id="category-select" className="form-select me-4" value={selectedCategory?.id} onChange={handleCategoryChange}>
        <option value="">Choose the category</option>
        {categoryOptions}
      </select>

      {selectedCategory && (
        <>
          <label htmlFor="subcategory-select" className="me-2 mb-0">Sub Category</label>
          <select id="subcategory-select" className="form-select" value={selectedSubcategory} onChange={handleSubcategoryChange}>
          <option value="">Choose the subcategory</option>
            {subcategoryOptions}
          </select>
        </>
      )}
    </div>
  );
};