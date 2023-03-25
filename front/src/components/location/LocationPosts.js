import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Location from './Location';

const LocationModal = ({ onLocationSelected }) => {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAccept = () => {
    if (onLocationSelected) {
      onLocationSelected(country, state, city);
    }
    handleClose();
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        <i className="bi bi-globe2"></i>
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar ubicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Location
            onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
            onStateChange={(selectedState) => setState(selectedState)}
            onCityChange={(selectedCity) => setCity(selectedCity)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleAccept}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LocationModal;
