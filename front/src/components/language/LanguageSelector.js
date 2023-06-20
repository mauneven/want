import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'react-bootstrap';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    setShowModal(false);
    localStorage.setItem('selectedLanguage', language);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        {selectedLanguage ? selectedLanguage.toUpperCase() : 'Choose Language'}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" onClick={() => handleChangeLanguage('en')}>
            English
          </Button>
          <Button variant="primary" onClick={() => handleChangeLanguage('es')}>
            Español
          </Button>
          <Button variant="primary" onClick={() => handleChangeLanguage('fr')}>
            Français
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}