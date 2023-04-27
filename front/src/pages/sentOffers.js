// pages/myOffers.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'react-bootstrap';
import DetailsModal from '@/components/offer/DetailsModal';

export default function sentOffers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const router = useRouter();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleShowDetailsModal = (offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-logged-in`, {
        credentials: 'include',
      });

      if (!loggedInResponse.ok) {
        router.push('/login');
        return;
      }

      const blockedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/is-blocked`, {
        credentials: 'include',
      });

      if (!blockedResponse.ok) {
        router.push('/blocked');
        return;
      }

      const verifiedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/check-verified`, {
        credentials: 'include',
      });

      if (!verifiedResponse.ok) {
        router.push('/is-not-verified');
      }
    };

    checkLoggedInAndBlockedAndVerified();
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
          <Modal.Title>Eliminar oferta</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar esta oferta?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteOffer}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1>Ofertas que he hecho</h1>
        <div className="row">
          {offers.map((offer) => (
            <div key={offer._id} className="col-12 col-md-6">
              <div className="card post rounded-5 mb-4">
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
                          <p className="card-text">Price: ${offer.price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-buttons-container d-flex flex-column justify-content-end mt-auto">
                      <button
                        className="btn btn-success mb-2"
                        onClick={() => handleShowDetailsModal(offer)}
                      >
                        View details
                        <i className="bi bi-eye ms-2"></i>
                      </button>
                      <button
                        className="btn btn-secondary mb-2"
                        onClick={() => handleShowModal(offer._id)}
                      >
                        Delete
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