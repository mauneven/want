import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import DetailsModal from '@/components/offer/DetailsModal';
import ReportOfferModal from '@/components/report/ReportOfferModal';
import { validations } from '@/utils/validations';

export default function ReceivedOffers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const router = useRouter();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostSelect = (postId) => {
    setSelectedPost(postId);
  };

  const handleShowDetailsModal = (offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    validations(router);
  }, []);

  const handleReportOffer = async (offerId, description) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offers/${offerId}/report`, {
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

  function compareOffersByDate(a, b) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    return 0;
  }

  useEffect(() => {
    const fetchReceivedOffers = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/received`, {
        credentials: 'include',
      });

      if (response.ok) {
        const offersData = await response.json();

        // Ordenar las ofertas por fecha de creación descendente
        offersData.sort(compareOffersByDate);

        const postsWithOffers = offersData.reduce((result, offer) => {
          const postId = offer.post._id;
          if (!result[postId]) {
            result[postId] = {
              post: offer.post,
              offers: [],
            };
          }
          result[postId].offers.push(offer);
          return result;
        }, {});
        setOffers(postsWithOffers);
      }

    };

    fetchReceivedOffers();
  }, []);

  useEffect(() => {
    const fetchReceivedOffers = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/received`, {
        credentials: 'include',
      });

      if (response.ok) {
        const offersData = await response.json();

        // Ordenar las ofertas por fecha de creación descendente
        offersData.sort(compareOffersByDate);

        const postsWithOffers = offersData.reduce((result, offer) => {
          const postId = offer.post._id;
          if (!result[postId]) {
            result[postId] = {
              post: offer.post,
              offers: [],
            };
          }
          result[postId].offers.push(offer);
          return result;
        }, {});
        setOffers(postsWithOffers);
      }
    };

    fetchReceivedOffers();
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

      // Encuentra el post que contiene la oferta que se va a eliminar
      const postToUpdate = Object.values(offers).find(postWithOffers =>
        postWithOffers.offers.some(offer => offer._id === selectedOfferId)
      );

      // Filtra las ofertas para excluir la oferta eliminada
      const updatedOffers = postToUpdate.offers.filter(offer => offer._id !== selectedOfferId);

      // Actualiza el estado de las ofertas
      setOffers({
        ...offers,
        [postToUpdate.post._id]: {
          ...postToUpdate,
          offers: updatedOffers,
        },
      });

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
          <Modal.Title>Delete this offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sure you Want to delete this offer?, that's permanent</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteOffer}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1 className='my-4'>Received offers</h1>
        <div className="row">
          <div className="col-md-3">
            <h3 className='mb-4'>Your posts</h3>
            {Object.values(offers).map((postWithOffers) => (
              <button
                key={postWithOffers.post._id}
                className={`list-group-item-action mt-3 mb-3 btn ${selectedPost === postWithOffers.post._id ? "post-received-selected" : "post-received"}`}
                onClick={() => handlePostSelect(postWithOffers.post._id)}
              >
                <h5 className=''>{postWithOffers.post.title.substring(0, 30)}</h5>
              </button>
            ))}
          </div>
          <div className="col-md-1 d-none d-md-block">
            <div className="separator h-100"></div>
          </div>
          <div className="col-md-8 border-secondary">
            <h3 className='mb-4'>Offers</h3>
            <div className="row">
              {selectedPost && offers[selectedPost].offers
                .slice()
                .sort(compareOffersByDate)
                .map((offer) => (
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
                                <h4 className="card-title">{offer.title}</h4>
                                <span className="text-success h5">
                                  $ {offer.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </span>
                                <p className="card-text">{offer.description}</p>
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
                            <ReportOfferModal offerId={offer._id} onReport={handleReportOffer} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

