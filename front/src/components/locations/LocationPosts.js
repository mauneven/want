import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Location from './Location';

const LocationModal = ({ onHide, onLocationSelected, onLocationFilterChange, selectedLocation }) => {
  const { country, state, city } = selectedLocation;
  const [show, setShow] = useState(false);
  const [locationType, setLocationType] = useState('Location');
  const [confirmedLocationType, setConfirmedLocationType] = useState('Location');

  const [selectedCountry, setCountry] = useState('');
  const [selectedState, setState] = useState('');
  const [selectedCity, setCity] = useState('');

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

  const handleAccept = () => {
    onLocationSelected(selectedCountry, selectedState, selectedCity);
    onLocationFilterChange({ country: selectedCountry, state: selectedState, city: selectedCity });

    // Update confirmedLocationType
    if (selectedCity) {
      setConfirmedLocationType(selectedCity);
    } else if (selectedState) {
      setConfirmedLocationType(selectedState);
    } else if (selectedCountry) {
      setConfirmedLocationType(selectedCountry);
    } else {
      setConfirmedLocationType('Location');
    }

    // Save the selection to localStorage
    localStorage.setItem("selectedLocation", JSON.stringify({ country: selectedCountry, state: selectedState, city: selectedCity }));

    handleClose();
  };

  // Load the selection from localStorage on component mount
  useEffect(() => {
    const storedSelection = localStorage.getItem("selectedLocation");
    if (storedSelection) {
      const parsedSelection = JSON.parse(storedSelection);
      setCountry(parsedSelection.country);
      setState(parsedSelection.state);
      setCity(parsedSelection.city);
      setConfirmedLocationType(parsedSelection.city || parsedSelection.state || parsedSelection.country || 'Location');
    }
  }, []);

  return (
    <>
      <Button variant="" onClick={handleShow} className=' mundi-btn'>
        <div className="selected-location">{confirmedLocationType}</div>
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