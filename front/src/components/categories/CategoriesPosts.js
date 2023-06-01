import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PostCategory from './Categories';
import { useEffect } from 'react';

export default function CategoriesModal({ isShown, onHide, onCategorySelected, buttonText }) {

  const [show, setShow] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubcategory] = useState('');
  const [displayCategory, setDisplayCategory] = useState('Select a category');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleAccept = () => {
    if (onCategorySelected) {
      onCategorySelected(mainCategory, subCategory);
    }
  
    if (subCategory) {
      setDisplayCategory(subCategory);
    } else if (mainCategory) {
      setDisplayCategory(mainCategory);
    } else {
      setDisplayCategory('Select a category');
    }
  
    handleClose();
  };

  const handleSeeAllCategories = () => {
    setMainCategory('');
    setSubcategory('');
    setDisplayCategory('Select a category');
    if (onCategorySelected) {
      onCategorySelected('', '');
    }
    handleClose();
  };  

  return (
    <>
      <Button variant="" onClick={handleShow} className='btn-categories-navbar'>
        {buttonText}
      </Button>

      <Modal show={show || isShown} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter by categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostCategory
            onMainCategoryChange={(selectedMainCategory) => setMainCategory(selectedMainCategory)}
            onSubcategoryChange={(selectedSubcategory) => setSubcategory(selectedSubcategory)}
            selectedSubcategory={subCategory}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSeeAllCategories}>See all categories</Button>
          <Button variant="primary" onClick={handleClose}>Cancel</Button>
          <Button variant="success" onClick={handleAccept}>Accept</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
