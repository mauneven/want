import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Location from "./Location";

const LocationModal = ({
  onHide,
  onLocationSelected,
  onLocationFilterChange,
  selectedLocation,
}) => {
  const [show, setShow] = useState(false);
  const [confirmedLocationType, setConfirmedLocationType] = useState(
    "Location"
  );

  const [selectedCountry, setCountry] = useState("");
  const [selectedState, setState] = useState("");
  const [selectedCity, setCity] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    setState("");
    setCity("");
  };

  const handleStateChange = (selectedState) => {
    setState(selectedState);
    setCity("");
  };

  const handleAccept = () => {
    onLocationSelected(selectedCountry, selectedState, selectedCity);
    onLocationFilterChange({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    });

    // Update confirmedLocationType
    if (selectedCity) {
      setConfirmedLocationType(selectedCity);
    } else if (selectedState) {
      setConfirmedLocationType(selectedState);
    } else if (selectedCountry) {
      setConfirmedLocationType(selectedCountry);
    } else {
      setConfirmedLocationType("Location");
    }

    // Save the selection to localStorage
    localStorage.setItem(
      "selectedLocation",
      JSON.stringify({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      })
    );

    handleClose();
  };

  useEffect(() => {
    const locationString = localStorage.getItem("selectedLocation");
    if (locationString) {
      const location = JSON.parse(locationString);
      setCountry(location.country);
      setState(location.state);
      setCity(location.city);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry || selectedState || selectedCity) {
      setConfirmedLocationType(selectedCity || selectedState || selectedCountry);
    } else {
      setConfirmedLocationType("Location");
    }
  }, [selectedCountry, selectedState, selectedCity]);

  return (
    <>
      <span onClick={handleShow} className="p-2">{confirmedLocationType}</span>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose your location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="p-2">Choose a location from where you Want to see what do people Want</p>
          <Location
            onCountryChange={handleCountryChange}
            onStateChange={handleStateChange}
            onCityChange={setCity}
            initialCountry={selectedCountry}
            initialState={selectedState}
            initialCity={selectedCity}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAccept}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LocationModal;