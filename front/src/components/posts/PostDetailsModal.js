import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import ReportPostModal from "@/components/report/ReportPostModal";
import UserModal from "@/components/user/UserModal";
import PostDetailsLocation from "@/components/locations/postDetails/";
import { useTranslation } from "react-i18next";
import CreateOfferModal from "../offer/CreateOfferModal";

const PostDetailsModal = ({
  postId,
  showModal,
  closeModal,
  applyCategoryFilter,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLogged, setIsLogged] = useState(false);
  const [post, setPost] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);

  const handleCategoryClick = (mainCategory, subCategory, thirdCategory) => {
    closeModal(); // Cerrar el modal de detalles
    applyCategoryFilter({ mainCategory, subCategory, thirdCategory }); // Aplicar el filtro de categoría
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
        setIsLogged(true);
      } else if (response.status === 401) {
        setIsLogged(false);
      }
    };

    checkSession();
  }, [router.pathname]);

  const updateUserPreferences = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateUserPreferences`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId,
            userPreferences: {
              mainCategoryPreferences: [post.mainCategory],
              subCategoryPreferences: [post.subCategory],
              thirdCategoryPreferences: [post.thirdCategory],
            },
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Preferencias del usuario actualizadas");
      } else {
        console.error("Error al actualizar las preferencias del usuario");
      }
    } catch (error) {
      console.error("Error al actualizar las preferencias del usuario", error);
    }
  };

  const savePreferencesToLocalStorage = () => {
    const mainCategoryPreferences =
      JSON.parse(localStorage.getItem("mainCategoryPreferences")) || {};
    const subCategoryPreferences =
      JSON.parse(localStorage.getItem("subCategoryPreferences")) || {};
    const thirdCategoryPreferences =
      JSON.parse(localStorage.getItem("thirdCategoryPreferences")) || {};

    mainCategoryPreferences[post.mainCategory] =
      (mainCategoryPreferences[post.mainCategory] || 0) + 1;
    subCategoryPreferences[post.subCategory] =
      (subCategoryPreferences[post.subCategory] || 0) + 1;
    thirdCategoryPreferences[post.thirdCategory] =
      (thirdCategoryPreferences[post.thirdCategory] || 0) + 1;

    localStorage.setItem(
      "mainCategoryPreferences",
      JSON.stringify(mainCategoryPreferences)
    );
    localStorage.setItem(
      "subCategoryPreferences",
      JSON.stringify(subCategoryPreferences)
    );
    localStorage.setItem(
      "thirdCategoryPreferences",
      JSON.stringify(thirdCategoryPreferences)
    );

    console.log("Preferencias guardadas en el localStorage");
  };

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
    showModal(); // Llamar a la función showModal para abrir el modal
  };

  const handleCloseClick = () => {
    closeModal(); // Llamar a la función closeModal para cerrar el modal
  };

  const handleMakeOfferClick = () => {
    closeModal(); // Cerrar el modal de detalles
    setShowCreateOfferModal(true); // Abrir el modal de creación de oferta
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`
      );
      const data = await response.json();
      setPost(data);
      if (data.photos && data.photos.length > 0) {
        setMainImage(data.photos[0]);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    const updatePreferences = async () => {
      if (!post) return;

      if (user) {
        await updateUserPreferences(post._id);
      } else {
        savePreferencesToLocalStorage();
      }
    };

    updatePreferences();
  }, [post, user]);

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
    return null;
  }

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleCloseClick}
        size="modal-dialog modal-fullscreen"
        animation={false}
      >
        <Modal.Body>
          <div className="justify-content-center align-content-center">
            <button className="close-modal-button" onClick={handleCloseClick}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div
                    ref={imageRef}
                    className="img-container"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
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
                  <h2>{post.title}</h2>
                  <div>
                    <span className="want-color fs-1">
                      ${" "}
                      {post.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                  <div className="grid">
                    <button
                      className="generic-button"
                      onClick={() =>
                        handleCategoryClick(post.mainCategory, null, null)
                      }
                    >
                      {t(`categories.${post.mainCategory}.name`)}
                    </button>
                    <button
                      className="generic-button ms-2"
                      onClick={() =>
                        handleCategoryClick(
                          post.mainCategory,
                          post.subCategory,
                          null
                        )
                      }
                    >
                      {t(
                        `categories.${post.mainCategory}.subcategories.${post.subCategory}.name`
                      )}
                    </button>
                    <button
                      className="generic-button me-2 mt-2 ms-2"
                      onClick={() =>
                        handleCategoryClick(
                          post.mainCategory,
                          post.subCategory,
                          post.thirdCategory
                        )
                      }
                    >
                      {t(
                        `categories.${post.mainCategory}.subcategories.${post.subCategory}.thirdCategories.${post.thirdCategory}.name`
                      )}
                    </button>
                  </div>
                  <p className="description-container-id mt-2">
                    {post.description}
                  </p>
                  <PostDetailsLocation
                    latitude={post.latitude}
                    longitude={post.longitude}
                  />
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
                  <div className="">
                    <button
                      className="want-button mt-2 me-3"
                      onClick={handleMakeOfferClick}
                    >
                      {t("postDetails.makeAnOffer")}
                    </button>
                    <ReportPostModal
                      postId={post._id}
                      onReport={handleReportPost}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {showCreateOfferModal && (
        <CreateOfferModal
          postId={post._id}
          showModal={showCreateOfferModal}
          closeModal={() => setShowCreateOfferModal(false)}
        />
      )}
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

export default PostDetailsModal;