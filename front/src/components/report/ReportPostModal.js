// components/ReportPostModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportPostModal = ({ postId, onReport }) => {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onReport(postId, description);
    setDescription('');
    handleClose();
  };

  return (
    <>
      <Button type='none' variant="danger rounded-circle btn-report" onClick={handleShow}>
      <i className="bi bi-flag"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Report
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReportPostModal;
