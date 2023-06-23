import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PostCategory from './Categories';

export default function CategoriesModal({ isShown, onHide, onCategorySelected, buttonText }) {
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(buttonText);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedThirdCategory, setSelectedThirdCategory] = useState('');
  const [displayCategory, setDisplayCategory] = useState(buttonText);
  const prevIsShownRef = useRef(isShown);

  useEffect(() => {
    setDisplayCategory(buttonText);
  }, [buttonText]);

  useEffect(() => {
    if (!isShown && prevIsShownRef.current) {
      resetCategories();
    }
    prevIsShownRef.current = isShown;
  }, [isShown]);

  const handleShow = () => {
    resetCategories();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleAccept = () => {
    if (onCategorySelected) {
      onCategorySelected(selectedCategory, selectedSubcategory, selectedThirdCategory);
    }

    if (selectedThirdCategory) {
      setDisplayCategory(selectedThirdCategory);
    } else if (selectedSubcategory) {
      setDisplayCategory(selectedSubcategory);
    } else if (selectedCategory) {
      setDisplayCategory(selectedCategory);
    } else {
      setDisplayCategory('Select a category');
    }

    handleClose();
  };

  const handleSeeAllCategories = () => {
    resetCategories();

    if (onCategorySelected) {
      onCategorySelected('', '', '');
    }
    handleClose()

  };

  const resetCategories = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedThirdCategory('');
    setDisplayCategory(buttonText);
  };

  return (
    <>
      <Button variant="" onClick={handleShow} className="bg-white">
      <i class="bi bi-tags fs-4"></i>
      <p className='m-0 small'>Filters</p>
      </Button>

      <Modal
        show={show || isShown}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter by categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='m-2'>filter what people want by categories, remember that you can click accept at any time with the chosen categories</p>
          <PostCategory
            onMainCategoryChange={setSelectedCategory}
            onSubcategoryChange={setSelectedSubcategory}
            onThirdCategoryChange={setSelectedThirdCategory}
            initialMainCategory={selectedCategory}
            initialSubcategory={selectedSubcategory}
            initialThirdCategory={selectedThirdCategory}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark rounded-4" onClick={handleSeeAllCategories}>
            See all categories
          </Button>
          <Button variant="secondary rounded-4" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success rounded-4" onClick={handleAccept}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}