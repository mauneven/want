import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReportOfferModal from '@/components/report/ReportOfferModal';

const DetailsModal = ({ show, onHide, offer }) => {
    if (!offer) return null;

    const [mainImage, setMainImage] = useState('');
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const imageRef = useRef(null);
    const zoomRef = useRef(null);
    const [isZoomVisible, setIsZoomVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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

    return (
        <>
            <Modal show={show} onHide={onHide} dialogClassName="modal-xl">
                <Modal.Header closeButton>
                    <Modal.Title>Offer Details</Modal.Title>
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
                        <div className="col-md-6">
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
                            <h5>{offer.title}</h5>
                            <p>{offer.description}</p>
                            <p>Precio: {offer.price}</p>
                            <p>Post relacionado: {offer.post && offer.post.title}</p>
                            <p>
                                Creado por: {offer.createdBy.firstName}{" "}
                                {offer.createdBy.lastName}
                            </p>
                            <p>Contacto: {offer.contact}</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={onHide}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DetailsModal;