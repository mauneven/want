import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PostCategory from './Categories';

export default function CategoriesModal({ isShown, onHide, onCategorySelected, onMainCategoryChange, onSubcategoryChange }) {

  const [show, setShow] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubcategory] = useState('');
  const [displayCategory, setDisplayCategory] = useState('All Categories'); // Nuevo estado para almacenar el texto a mostrar

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleAccept = () => {
    if (onCategorySelected) {
      onCategorySelected(mainCategory, subCategory);
    }
  
    // Actualiza el texto a mostrar en base a la categoría y subcategoría seleccionadas
    if (subCategory) {
      setDisplayCategory(subCategory);
    } else if (mainCategory) {
      setDisplayCategory(mainCategory);
    } else {
      setDisplayCategory('All Categories');
    }
  
    // Restablece los valores de mainCategory y subCategory si se muestra "Todas las categorias"
    if (displayCategory === 'All Categories') {
      setMainCategory('');
      setSubcategory('');
      if (onMainCategoryChange) {
        onMainCategoryChange('');
      }
      if (onSubcategoryChange) {
        onSubcategoryChange('');
      }
    }
  
    handleClose();
  };  

  return (
    <>
      <Button variant="" onClick={handleShow}>
        {displayCategory} {/* Muestra el texto almacenado en displayCategory */}
      </Button>

      <Modal show={show || isShown} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose a category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostCategory
            onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
            onSubcategoryChange={(selectedSubcategory) => setSubcategory(selectedSubcategory)}
            selectedSubcategory={subCategory} // Agrega esta línea
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleAccept}>Accept</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};