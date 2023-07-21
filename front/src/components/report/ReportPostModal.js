import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ReportPostModal = ({ postId, onReport }) => {
  const { t } = useTranslation();
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
      <button className='want-button-danger ms-3' onClick={handleShow}>
        <i className="bi bi-flag"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('reportPostModal.reportPost')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>{t('reportPostModal.describe')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <button type="submit" className='want-button-danger mt-2'>
              {t('reportPostModal.sendReport')}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReportPostModal;