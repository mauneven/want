// components/ReportOfferModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportOfferModal = ({ offerId, onReport }) => {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onReport(offerId, description);
    setDescription('');
    handleClose();
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Report 
        <i className="bi bi-flag ms-2"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report this offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Describe why you're reporting this offer</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="warning" type="submit">
              Send report
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReportOfferModal;