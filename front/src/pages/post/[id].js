import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReportPostModal from "@/components/report/ReportPostModal";
import UserModal from "@/components/user/UserModal";
import PostDetailsLocation from "@/components/locations/postDetails/";
import { useTranslation } from "react-i18next";
import GoHomeButton from "@/components/reusable/GoHomeButton";

const PostDetails = ({
  mainCategory,
  subCategory,
  thirdCategory,
  onMainCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [isLogged, setIsLogged] = useState(false);
  const [post, setPost] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const zoomRef = useRef(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [user, setUser] = useState(null);

  const handleCategoryButtonClick = (category) => {
    if (category === "mainCategory") {
      onMainCategoryChange(post.mainCategory);
      onSubcategoryChange("");
      onThirdCategoryChange("");
    } else if (category === "subCategory") {
      onMainCategoryChange(post.mainCategory);
      onSubcategoryChange(post.subCategory);
      onThirdCategoryChange("");
    } else if (category === "thirdCategory") {
      onMainCategoryChange(post.mainCategory);
      onSubcategoryChange(post.subCategory);
      onThirdCategoryChange(post.thirdCategory);
    }
    localStorage.removeItem("cachedPosts");
    localStorage.removeItem("currentPage");
    router.push("/");
  };

  const handleOfferButtonClick = () => {
    // Check if the user is logged in
    if (isLogged) {
      // If logged in, redirect to the "createOffer" page with the postId parameter
      router.push(`/createOffer?postId=${id}`);
    } else {
      // If not logged in, redirect to the login page
      router.push("/login");
    }
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

    } catch (error) {
      console.error("Error al actualizar las preferencias del usuario", error);
    }
  };

  const savePreferencesToLocalStorage = () => {
    const mainCategoryPreferences = JSON.parse(
      localStorage.getItem("mainCategoryPreferences") || "{}"
    );
    const subCategoryPreferences = JSON.parse(
      localStorage.getItem("subCategoryPreferences") || "{}"
    );
    const thirdCategoryPreferences = JSON.parse(
      localStorage.getItem("thirdCategoryPreferences") || "{}"
    );

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

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

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

  useEffect(() => {
    setIsMobile(window.innerWidth < 1000);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!post) {
    return <p className="container mt-5"></p>;
  }

  return (
    <>
      <div className="container">
        <GoHomeButton />
        <div className="row p-2">
          {post.photos && post.photos.length > 0 ? (
            <div className="col-lg-6 p-4 ">
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
              <div className="mt-3 d-flex ">
                {post.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                    className={`img-thumbnail mr-2 ${isMobile ? "post-title" : ""}`}
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
          ) : (
            <div className="col-lg-6 p-4 d-flex justify-content-center align-items-center">
              <div className="text-center">
                <i className="bi bi-images display-1"></i>
                <p>{t("postDetails.noPhotos")}</p>
              </div>
            </div>
          )}
          <div
            className="col-lg-6 p-2 "
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
                  backgroundColor: "white",
                }}
              ></div>
            )}
            <h2>{post.title}</h2>
            <div>
              <span className="want-color fs-1">
                $ {post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
            <div className="d-flex">
              <button
                className="generic-button m-1 post-title post-categories-button"
                onClick={() => handleCategoryButtonClick("mainCategory")}
              >
                {t(`categories.${post.mainCategory}.name`)}
              </button>
              <button
                className="generic-button m-1 post-title post-categories-button"
                onClick={() => handleCategoryButtonClick("subCategory")}
              >
                {t(
                  `categories.${post.mainCategory}.subcategories.${post.subCategory}.name`
                )}
              </button>
              <button
                className="generic-button m-1 post-title post-categories-button"
                onClick={() => handleCategoryButtonClick("thirdCategory")}
              >
                {t(
                  `categories.${post.mainCategory}.subcategories.${post.subCategory}.thirdCategories.${post.thirdCategory}.name`
                )}
              </button>
            </div>
            <p className="description-container-id pt-2">
              {post.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p className="pb-0 mb-0 small-text mt-3">
              <PostDetailsLocation
                latitude={post.latitude}
                longitude={post.longitude}
              />
            </p>
            <div className="d-flex align-items-center text-start mt-5 pt-4 divhover">
              <img
                src={
                  post.createdBy.photo
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                    : "/icons/person-circle.svg"
                }
                alt=""
                className="createdBy-photo-id"
                onClick={() => openUserModal(post.createdBy)}
              />
              <p
                className="mb-0 ps-2 divhover"
                onClick={() => openUserModal(post.createdBy)}
              >
                {post.createdBy.firstName} {post.createdBy.lastName} |{" "}
                <i className="bi bi-star-fill"></i>{" "}
                {post.createdBy.reports
                  ? 5 - 0.3 * post.createdBy.reports.length
                  : ""}
              </p>
              <ReportPostModal postId={post._id} onReport={handleReportPost} />
            </div>
            <div className="mt-3">
              <button
                className="want-rounded want-button"
                onClick={handleOfferButtonClick}
              >
                {t("postDetails.makeAnOffer")}
              </button>
            </div>
          </div>
        </div>
      </div>
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
