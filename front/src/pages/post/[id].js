import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import RelatedPosts from "@/components/posts/RelatedPosts";
import ReportPostModal from "@/components/report/ReportPostModal";
import UserModal from "@/components/user/UserModal";
import { useTranslation } from "react-i18next";

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const [post, setPost] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const isMobile = () => {
    return (
      typeof window !== "undefined" &&
      (window.navigator.userAgent.match(/Mobile/) ||
        window.navigator.userAgent.match(/Tablet/) ||
        window.navigator.userAgent.match(
          /iPad|iPod|iPhone|Android|BlackBerry|IEMobile/
        ))
    );
  };

  const [mobileDevice, setMobileDevice] = useState(false);

  const handleReportPost = async (postId, description) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/report/post/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Report success:", data);
      } else {
        console.error("Error al reportar el post:", response);
      }
    } catch (error) {
      console.error("Error al reportar el post:", error);
    }
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseClick = () => {
    setShowModal(false);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  useEffect(() => {
    setMobileDevice(isMobile());
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${id}`
      );
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

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
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
    position: "absolute",
    border: "2px solid #000",
    width: "100px",
    height: "100px",
    left: `calc(${cursorPosition.x}% - 50px)`,
    top: `calc(${cursorPosition.y}% - 50px)`,
    display: isZoomVisible && !mobileDevice ? "block" : "none",
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
                position: "relative",
                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL}/${mainImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "100%",
                height: "420px",
              }}
            >
              {!mobileDevice && <div style={overlayStyle}></div>}
            </div>
            <div className="mt-3 d-flex">
              {post.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                  className="img-thumbnail mr-2"
                  onMouseOver={() => handleThumbnailMouseOver(photo)}
                  alt={post.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
          <div
            className="col-lg-6"
            style={{ maxWidth: "100%", overflowWrap: "break-word" }}
          >
            {!mobileDevice && isZoomVisible && (
              <div
                ref={zoomRef}
                className="zoom"
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL}/${mainImage})`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                  width: "500px",
                  height: "500px",
                }}
              ></div>
            )}
            <h1>{post.title}</h1>
            <p>
              <span className="text-success h2">
                $ {post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </p>
            <p className="description-container-id">{post.description}</p>
            <p className="pb-0 mb-0 small-text mt-3">
              {t("postDetails.publishedIn")} {post.city}, {post.state},{" "}
              {post.country}
            </p>
            <p className="small">
              {t(`categories.${post.mainCategory}.name`)},{" "}
              {t(
                `categories.${post.mainCategory}.subcategories.${post.subCategory}.name`
              )}
              ,{" "}
              {t(
                `categories.${post.mainCategory}.subcategories.${post.subCategory}.thirdCategories.${post.thirdCategory}.name`
              )}
            </p>
            <div
              className="d-flex align-items-center text-start"
              onClick={() => openUserModal(post.createdBy)}
            >
              <img
                src={
                  post.createdBy.photo
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                    : "/icons/person-circle.svg"
                }
                alt=""
                className="createdBy-photo-id"
              />
              <p className="mb-0 p-0" style={{ cursor: "pointer" }}>
                {post.createdBy.firstName} {post.createdBy.lastName} |{" "}
                <i className="bi bi-star-fill"></i>{" "}
                {post.createdBy.reports
                  ? 5 - 0.3 * post.createdBy.reports.length
                  : ""}
              </p>
            </div>
            <div className="mt-3">
              <Link href={`/createOffer?postId=${id}`}>
                <button className="btn rounded-5 btn-offer">
                  {t("postDetails.makeAnOffer")}
                </button>
              </Link>
              <ReportPostModal postId={post._id} onReport={handleReportPost} />
            </div>
          </div>
        </div>
      </div>
      <RelatedPosts
        locationFilter={{
          country: post.country,
          state: post.state,
          city: post.city,
        }}
        categoryFilter={{
          mainCategory: post.mainCategory,
          subCategory: post.subCategory,
        }}
        post={post}
        currentPage={Number(router.query.page) || 1}
      />
      {showUserModal && (
        <UserModal
          selectedUser={selectedUser}
          showModal={showUserModal}
          closeModal={closeUserModal}
        />
      )}
    </>
  );
};

export default PostDetails;
