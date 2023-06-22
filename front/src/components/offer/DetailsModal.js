import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import UserModal from "../user/UserModal";
import { useTranslation } from 'react-i18next';

const DetailsModal = ({ show, onHide, offer }) => {
  if (!offer) return null;

  const [mainImage, setMainImage] = useState('');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (offer.photos && offer.photos.length > 0) {
      setMainImage(offer.photos[0]);
    }
  }, [offer]);

  const isMobile = () => {
    return (
      typeof window !== 'undefined' &&
      (window.navigator.userAgent.match(/Mobile/) ||
        window.navigator.userAgent.match(/Tablet/) ||
        window.navigator.userAgent.match(/iPad|iPod|iPhone|Android|BlackBerry|IEMobile/))
    );
  };

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const handleThumbnailMouseOver = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleMouseMove = (event) => {
    if (!zoomRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    let x = ((event.clientX - left) / width) * 100;
    let y = ((event.clientY - top) / height) * 100;

    x = Math.max(0, Math.min(90, x));
    y = Math.max(0, Math.min(90, y));

    setCursorPosition({ x, y });

    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handleMouseEnter = () => {
    setIsZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setIsZoomVisible(false);
  };

  const overlayStyle = {
    position: 'absolute',
    border: '2px solid #000',
    width: '100px',
    height: '100px',
    left: `calc(${cursorPosition.x}% - 50px)`,
    top: `calc(${cursorPosition.y}% - 50px)`,
    display: isZoomVisible && !isMobileDevice ? 'block' : 'none',
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  const isContactAvailable = offer.countryCode && offer.phoneNumber && offer.contact;

  return (
    <>
      <Modal show={show} onHide={onHide} dialogClassName="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>{t('detailsModal.offerForPost', { title: offer.post.title })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div
                ref={imageRef}
                className="img-container"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: 'relative',
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL}/${mainImage})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '420px',
                }}
              >
                {!isMobileDevice && <div style={overlayStyle}></div>}
              </div>
              <div className="mt-3">
                {offer.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                    className="img-thumbnail mr-2"
                    onMouseOver={() => handleThumbnailMouseOver(photo)}
                    alt={offer.title}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
            <div className="col-lg-6 p-0" style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
              {!isMobileDevice && isZoomVisible && (
                <div
                  ref={zoomRef}
                  className="zoom"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL}/${mainImage})`,
                    backgroundSize: '200%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                    width: '500px',
                    height: '500px',
                  }}
                ></div>
              )}
              <h2 className='mt-2'>{offer.title}</h2>
              <p>
                <span className="text-success h3">
                  $ {offer.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </p>
              <p>{offer.description}</p>
              <p className='mb-2'>
                {t('detailsModal.offerBy')}{' '}
                <span className="text-success" style={{ cursor: 'pointer' }} onClick={() => openUserModal(offer.createdBy)}>
                  {offer.createdBy.firstName} {offer.createdBy.lastName}
                </span>
              </p>
              {isContactAvailable && (
                <>
                <div>
                  <button
                    className="btn rounded-5 btn-success mt-2 mb-2"
                    onClick={() => window.open(`https://wa.me/${offer.countryCode}${offer.phoneNumber}`, '_blank')}
                  >
                    <i className="bi bi-whatsapp mt-2"></i>{`+${offer.countryCode} ${offer.phoneNumber}`}
                  </button>
                  </div>
                  <div>
                  <button
                    className="btn-warning btn rounded-5 mt-2 mb-2"
                    onClick={() => window.open(`tel:+${offer.countryCode}${offer.phoneNumber}`, '_blank')}
                  >
                    <i className="bi bi-telephone-forward"></i> {`+${offer.countryCode} ${offer.phoneNumber}`}
                  </button>
                  </div>
                  <p>
                    {t('detailsModal.otherWaysToContact', { firstName: offer.createdBy.firstName, contact: offer.contact })}
                  </p>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={onHide}>
            {t('detailsModal.closeButton')}
          </button>
        </Modal.Footer>
      </Modal>

      <UserModal selectedUser={selectedUser} showModal={showUserModal} closeModal={closeUserModal} />
    </>
  );
};

export default DetailsModal;