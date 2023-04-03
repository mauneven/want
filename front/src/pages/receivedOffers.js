import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import ReportOfferModal from '@/components/report/ReportOfferModal';

export default function ReceivedOffers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch('https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/is-logged-in', {
        credentials: 'include',
      });
  
      if (!loggedInResponse.ok) {
        router.push('/login');
        return;
      }
  
      const blockedResponse = await fetch('https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/is-blocked', {
        credentials: 'include',
      });
  
      if (!blockedResponse.ok) {
        router.push('/blocked');
        return;
      }
  
      const verifiedResponse = await fetch('https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/is-verified', {
        credentials: 'include',
      });
  
      if (!verifiedResponse.ok) {
        router.push('/verify-email');
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);

  useEffect(() => {
    const fetchReceivedOffers = async () => {
      const response = await fetch('https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/received', {
        credentials: 'include',
      });

      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
      }
    };

    fetchReceivedOffers();
  }, []);

  const handleReportOffer = async (offerId, description) => {
    try {
      const response = await fetch(`https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/offers/${offerId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ description }),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
  
      alert('Offer reported successfully');
    } catch (error) {
      console.error('Error reporting offer:', error.message);
    }
  };  

  const handleDeleteOffer = async () => {
    try {
      const response = await fetch(`https://ec2-100-25-111-207.compute-1.amazonaws.com:4000/api/${selectedOfferId}`, {
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
        <h1>Ofertas recibidas</h1>
        <div className="row">
          {offers.map((offer) => (
            <div key={offer._id} className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{offer.title}</h5>
                  <p className="card-text">{offer.description}</p>
                  <p className="card-text">Precio: {offer.price}</p>
                  <p className="card-text">
                    Post relacionado: {offer.post && offer.post.title}
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleShowModal(offer._id)}
                  >
                    Eliminar
                  </button>
                  <ReportOfferModal offerId={offer._id} onReport={handleReportOffer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
