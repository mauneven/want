import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PostCategory from './Categories';

export default function CategoriesModal({ isShown, onHide, onCategorySelected, onMainCategoryChange, onSubcategoryChange }) {

  const [show, setShow] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubcategory] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleAccept = () => {
    if (onCategorySelected) {
      onCategorySelected(mainCategory, subCategory);
    }
  
    // Borra la categoría principal y la subcategoría al hacer clic en Aceptar
    setMainCategory('');
    setSubcategory('');
  
    // Llama a onMainCategoryChange y onSubcategoryChange si están presentes
    if (onMainCategoryChange) {
      onMainCategoryChange('');
    }
    if (onSubcategoryChange) {
      onSubcategoryChange('');
    }
  
    handleClose();
  };    

  return (
    <>
      <Button variant="" onClick={handleShow}>
        <i className="bi bi-list navbar-icon"></i>
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