import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ReportOfferModal = ({ offerId, onReport }) => {
  const { t } = useTranslation();
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
      <button onClick={handleShow}>
        {t('reportOfferModal.report')}
        <i className="bi bi-flag ms-2"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('reportOfferModal.reportOffer')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>{t('reportOfferModal.describe')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <button type="submit">
              {t('reportOfferModal.sendReport')}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReportOfferModal;
