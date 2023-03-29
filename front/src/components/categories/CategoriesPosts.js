import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Categories from './Categories';

const CategoriesModal = ({ onHide, onCategorySelected, onSubcategorySelected }) => {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleAccept = () => {
    if (onCategorySelected && onSubcategorySelected) {
      onCategorySelected(selectedCategory);
      onSubcategorySelected(selectedSubcategory);
    }
    handleClose();
  };

  return (
    <>
      <Button variant="" onClick={handleShow}>
        <i className="bi bi-tags navbar-icon"></i>
      </Button>
      
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose a category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Categories
            onCategoryChange={(selectedCategory) => setSelectedCategory(selectedCategory)}
            onSubcategoryChange={(selectedSubcategory) => setSelectedSubcategory(selectedSubcategory)}
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

export default CategoriesModal;
