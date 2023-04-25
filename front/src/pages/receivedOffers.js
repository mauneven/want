import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import DetailsModal from '@/components/offer/DetailsModal';

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
      <div className="container mt-5">
        <h1 className='mt-5 mb-5'>Received offers</h1>
        <div className="row">
          <div className="col-md-3">
            <h3 className='mb-4'>Your posts</h3>
            {Object.values(offers).map((postWithOffers) => (
              <button
                key={postWithOffers.post._id}
                className={`list-group-item-action mt-3 mb-3 btn ${selectedPost === postWithOffers.post._id ? "post-received-selected" : "post-received"}`}
                onClick={() => handlePostSelect(postWithOffers.post._id)}
              >
                <h4 className=''>{postWithOffers.post.title}</h4>

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
                      <div className="card-body d-flex">
                        {offer.photos && offer.photos.length > 0 && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${offer.photos[0]}`}
                            className="d-block"
                            alt="Offer"
                            style={{ objectFit: "cover", width: "100px", height: "100px", marginRight: "15px" }}
                          />
                        )}
                        <div>
                          <h5 className="card-title">{offer.title}</h5>
                          <p className="card-text">{offer.description}</p>
                          <p className="card-text">Precio: {offer.price}</p>
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-danger"
                              onClick={() => handleShowModal(offer._id)}
                            >
                              Eliminar
                            </button>
                            <button
                              className="btn btn-info ms-2"
                              onClick={() => handleShowDetailsModal(offer)}
                            >
                              View Details
                            </button>
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

