import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import ReportOfferModal from '@/components/report/ReportOfferModal';

export default function ReceivedOffers() {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const router = useRouter();

  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostSelect = (postId) => {
    setSelectedPost(postId);
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
    const fetchReceivedOffers = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/received`, {
        credentials: 'include',
      });

      if (response.ok) {
        const offersData = await response.json();
        setOffers(offersData);
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
              {selectedPost &&
                offers[selectedPost].offers.map((offer) => (
                  <div key={offer._id} className="col-6">
                    <div className="card post rounded-5 mb-4">
                      {offer.photos && offer.photos.length > 0 && (
                        <div
                          id={`carousel-${offer._id}`}
                          className="carousel slide"
                          data-bs-ride="carousel"
                          style={{ height: "200px", overflow: "hidden" }}
                        >
                          <div className="carousel-inner">
                            {offer.photos.map((photos, index) => {
                              console.log(
                                "Image URL:",
                                `${process.env.NEXT_PUBLIC_API_BASE_URL}/${photos}`
                              );
                              return (
                                <div
                                  className={`carousel-item ${index === 0 ? "active" : ""
                                    }`}
                                  key={index}
                                >
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photos}`}
                                    className="d-block w-100"
                                    alt={`Slide ${index}`}
                                    style={{ objectFit: "cover", height: "100%" }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${offer._id}`}
                            data-bs-slide="prev"
                          >
                            <span
                              className="carousel-control-prev-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${offer._id}`}
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{offer.title}</h5>
                        <p className="card-text">{offer.description}</p>
                        <p className="card-text">Precio: {offer.price}</p>
                        <p className="card-text">
                          Post relacionado: {offer.post && offer.post.title}
                        </p>
                        <img
                          src={
                            offer.createdBy.photo
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${offer.createdBy.photo}`
                              : "icons/person-circle.svg"
                          }
                          alt="Profile"
                          style={{
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                          }}
                        />
                        <p className="card-text">
                          offer by: {offer.createdBy.firstName}
                        </p><p className='card-text'>Contact: {offer.contact}</p>
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
        </div>
      </div>
    </>
  );
}
