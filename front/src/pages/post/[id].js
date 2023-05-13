import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import RelatedPosts from '@/components/posts/RelatedPosts';
import ReportPostModal from '@/components/report/ReportPostModal';

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isMobile = () => {
    return (
      typeof window !== 'undefined' &&
      (window.navigator.userAgent.match(/Mobile/) ||
        window.navigator.userAgent.match(/Tablet/) ||
        window.navigator.userAgent.match(/iPad|iPod|iPhone|Android|BlackBerry|IEMobile/))
    );
  };

  const [mobileDevice, setMobileDevice] = useState(false);

  const handleReportPost = async (postId, description) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/post/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
        credentials: 'include', // Añade esta línea
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reporte de post exitoso:', data);
      } else {
        console.error('Error al reportar el post:', response);
      }
    } catch (error) {
      console.error('Error al reportar el post:', error);
    }
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseClick = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setMobileDevice(isMobile());
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
      if (data.photos && data.photos.length > 0) {
        setMainImage(data.photos[0]);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

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
    display: isZoomVisible && !mobileDevice ? 'block' : 'none',
  };

  if (!post) {
    return <p className="container mt-5">Loading...</p>;
  }

  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-lg-6">
            <div
              ref={imageRef}
              className="img-container"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
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
              {!mobileDevice && <div style={overlayStyle}></div>}
            </div>
            <div className="mt-3">
              {post.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                  className="img-thumbnail mr-2"
                  onMouseOver={() => handleThumbnailMouseOver(photo)}
                  alt={post.title}
                  style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                />
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            {!mobileDevice && isZoomVisible && (
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
            <h1 className="mb-4">{post.title}</h1>
            <h5>{post.description}</h5>
            <p><strong>Price: </strong>{post.price}</p>
            <p><strong>Country: </strong>{post.country}</p>
            <p><strong>State: </strong>{post.state}</p>
            <p><strong>City: </strong>{post.city}</p>
            <p><strong>Main category: </strong>{post.mainCategory}</p>
            <p><strong>Sub category: </strong>{post.subCategory}</p>
            {/* Agrega aquí más campos si es necesario */}
            <Link href={`/createOffer?postId=${id}`}>
              <button className="btn btn-offer">Make an offer</button>
            </Link>
            <ReportPostModal postId={post._id} onReport={handleReportPost} />
          </div>
        </div>
      </div>
      <RelatedPosts
        locationFilter={{ country: post.country }}
        categoryFilter={{ mainCategory: post.mainCategory, subCategory: post.subCategory }}
        post={post} // Añade esta línea
      />
    </>
  );
};

export default PostDetails;