import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'react-bootstrap';
import DetailsModal from '@/components/offer/DetailsModal';
import { validations } from '@/utils/validations';
import { useTranslation } from 'react-i18next';

export default function SentOffers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const router = useRouter();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { t } = useTranslation();

  const handleShowDetailsModal = (offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    validations(router); 
  }, []);

  useEffect(() => {
    const fetchMyOffers = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-offers`, {
        credentials: 'include',
      });
  
      if (response.ok) {
        const offersData = await response.json();
        const sortedOffersData = offersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOffers(sortedOffersData);
      }
    };
  
    fetchMyOffers();
  }, []);  

  const handleDeleteOffer = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${selectedOfferId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setOffers(offers.filter((offer) => offer._id !== selectedOfferId));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting offer:', error.message);
    }
  };

  const handleShowModal = (offerId) => {
    setSelectedOfferId(offerId);
    setShowModal(true);
  };

  return (
    <>
      <DetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        offer={selectedOffer}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('sentOffers.deleteOfferTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('sentOffers.deleteOfferConfirmation')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('sentOffers.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDeleteOffer}>
            {t('sentOffers.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1 className='my-4'>{t('sentOffers.yourOffers')}</h1>
        <div className="row">
          {offers.map((offer) => (
            <div key={offer._id} className="col-12 col-md-6">
              <div className="card post rounded-4 mb-4">
                <div>
                  <div className="card-body d-flex flex-column">
                    <div className="card-body d-flex flex-row align-items-center">
                      {offer.photos && offer.photos.length > 0 && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${offer.photos[0]}`}
                          className="d-block me-3"
                          alt="Offer"
                          style={{ objectFit: "cover", width: "100px", height: "100px" }}
                        />
                      )}
                      <div className="d-flex flex-column flex-grow-1">
                        <div>
                          <h5 className="card-title">{offer.title}</h5>
                          <p className="card-text">{offer.description}</p>
                          <p className="card-text">{t('sentOffers.price')}: ${offer.price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-buttons-container d-flex flex-column justify-content-end mt-auto">
                      <button
                        className="btn btn-success mb-2"
                        onClick={() => handleShowDetailsModal(offer)}
                      >
                        {t('sentOffers.viewDetails')}
                        <i className="bi bi-eye ms-2"></i>
                      </button>
                      <button
                        className="btn btn-secondary mb-2"
                        onClick={() => handleShowModal(offer._id)}
                      >
                        {t('sentOffers.delete')}
                        <i className="bi bi-trash3 ms-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
