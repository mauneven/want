import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Location from './';

const LocationModal = ({
  onHide,
  onLocationSelected,
  initialLatitude,
  initialLongitude,
}) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    onHide();
  };

  const handleLocationChange = (latitude, longitude) => {
    onLocationSelected(latitude, longitude);
  };

  return (
    <>
      <div onClick={handleShow} className="p-2 me-1 ms-2 center divhover rounded fs-5">
        <i className="bi bi-geo-alt"></i>
      </div>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose your location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="p-2">Choose a location on the map:</p>
          <Location
            onLocationChange={handleLocationChange}
            initialLatitude={initialLatitude}
            initialLongitude={initialLongitude}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success rounded-5" onClick={handleClose}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LocationModal;
