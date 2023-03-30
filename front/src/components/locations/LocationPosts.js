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

  useEffect(() => {
    const storedLocationFilter = JSON.parse(localStorage.getItem('locationFilter'));
    if (storedLocationFilter) {
      const { country, state, city } = storedLocationFilter;
      if (city) {
        setLocationType(city);
      } else if (state) {
        setLocationType(state);
      } else if (country) {
        setLocationType(country);
      }
    }
  }, []);  

  return (
    <>
      <Button variant="" onClick={handleShow} className=' mundi-btn'>
        <div className="selected-location">{locationType}</div>
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Where do you want to see the posts?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Location
            onCountryChange={(selectedCountry) => setCountry(selectedCountry)}
            onStateChange={(selectedState) => setState(selectedState)}
            onCityChange={(selectedCity) => setCity(selectedCity)}
            onLocationSelected={(country, state, city) => onLocationSelected(country, state, city)}
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

export default LocationModal;
