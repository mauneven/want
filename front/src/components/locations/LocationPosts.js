import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Location from './Location';
import { useEffect } from 'react';

const LocationModal = ({ onHide, onLocationSelected }) => {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [locationType, setLocationType] = useState('Location');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setState('');
    setCity('');
  };
  
  const handleStateChange = (selectedState) => {
    setState(selectedState);
    setCity('');
  };

  useEffect(() => {
    const locationFilterString = localStorage.getItem("locationFilter");
    if (locationFilterString) {
      const parsedLocationFilter = JSON.parse(locationFilterString);
      if (parsedLocationFilter.city) {
        setLocationType(parsedLocationFilter.city);
      } else if (parsedLocationFilter.state) {
        setLocationType(parsedLocationFilter.state);
      } else if (parsedLocationFilter.country) {
        setLocationType(parsedLocationFilter.country);
      }
    }
  }, []);  

  const handleAccept = () => {
    if (onLocationSelected) {
      onLocationSelected(country, state, city);
      if (city) {
        setLocationType(city);
      } else if (state) {
        setLocationType(state);
      } else if (country) {
        setLocationType(country);
      }
    }
    handleClose();
  };

  return (
    <>
      <Button variant="" onClick={handleShow} className=' mundi-btn'>
        <div className="selected-location">{locationType}</div>
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Elije la ubicación hasta donde desees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Location
           onCountryChange={handleCountryChange}
           onStateChange={handleStateChange}
           onCityChange={(selectedCity) => setCity(selectedCity)}
           onLocationSelected={(country, state, city) => onLocationSelected(country, state, city)}
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