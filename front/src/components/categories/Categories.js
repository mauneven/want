import { useState } from 'react';
import { useEffect } from 'react';

const categories = [
  { id: 1, nombre: 'Tecnología', subcategorias: ['Portátiles', 'PC de escritorio', 'Celulares', 'Tablets', 'Smartwatches', 'Accesorios para Dispositivos', 'Cámaras y Fotografía', 'Audio y Sonido', 'Consolas de Videojuegos'] },
  { id: 2, nombre: 'Ropa', subcategorias: ['Camisas', 'Camisetas', 'Chaquetas', 'Abrigos', 'Pantalones', 'Faldas', 'Vestidos', 'Zapatos', 'Tenis', 'Botas', 'Sandalias', 'Zapatillas', 'Sombreros'] },
  { id: 3, nombre: 'Electrodomésticos', subcategorias: ['Refrigeradores', 'Lavadoras', 'Secadoras', 'Cafeteras', 'Microondas', 'Licuadoras', 'Aspiradoras', 'Planchas'] },
  { id: 4, nombre: 'Salud y Belleza', subcategorias: ['Maquillaje', 'Cuidado de la Piel', 'Cuidado del Cabello', 'Fragancias', 'Suplementos y Vitaminas', 'Masajeadores y Relajación'] },
  { id: 5, nombre: 'Vehículos', subcategorias: ['Automóviles', 'Motocicletas', 'Camionetas', 'Bicicletas', 'Botes'] },
  { id: 6, nombre: 'Del Hogar', subcategorias: ['Muebles', 'Decoración', 'Iluminación', 'Baño', 'Cocina y Comedor', 'Exterior y Jardín', 'Suministros de Limpieza'] },
  { id: 7, nombre: 'Vivienda y Hospedaje', subcategorias: ['Casas en Arriendo', 'Casas en Venta', 'Apartamentos en Arriendo', 'Apartamentos en Venta', 'Apartaestudios', 'Casa Quinta en Arriendo', 'Habitaciones', 'Terrenos'] },
  { id: 8, nombre: 'Suscripciones', subcategorias: ['Netflix', 'Spotify', 'Apple Music', 'HBO Max', 'Crunchyroll', 'Tidal', 'Amazon Prime Video', 'Disney+', 'Xbox Game Pass', 'Play Station Plus', 'Discord Nitro'] },
  { id: 9, nombre: 'Maquinaria Pesada', subcategorias: ['Volquetas', 'Excavadoras', 'Motoniveladoras', 'Retroexcavadoras', 'Montacargas', 'Grúas', 'Bulldozers', 'Cargadores Frontales'] },
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
    <option value="">Elije la subcategoría</option>
  );

  return (
    <div className="d-flex flex-wrap align-items-center">
      <label htmlFor="category-select" className="me-2 mb-0">Categoría</label>
      <select id="category-select" className="form-select me-4" value={selectedCategory?.id} onChange={handleCategoryChange} required={isRequired}>
        <option value="">Elije una categoría</option>
        {categoryOptions}
      </select>

      {selectedCategory && (
        <>
          <label htmlFor="subcategory-select" className="me-2 mb-0">Sub categoría</label>
          <select id="subcategory-select" className="form-select" value={selectedSubcategory} onChange={handleSubcategoryChange} required={isRequired}>
          <option value="">Elije la sub categoría</option>
            {subcategoryOptions}
          </select>
        </>
      )}
    </div>
  );
};