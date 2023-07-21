import { useState, useEffect } from "react";
import Link from "next/link";
import { Modal, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { validations } from "@/utils/validations";
import { useTranslation } from "react-i18next";
import GoBackButton from "@/components/reusable/GoBackButton";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    validations(router);
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-posts`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const postsData = await response.json();
        const sortedPostsData = postsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPostsData);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDeletePost = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${selectedPostId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Actualiza la lista de posts después de eliminar un post exitosamente
      setPosts(posts.filter((post) => post._id !== selectedPostId));
      setShowModal(false); // Cierra el modal
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("myPosts.deletePostTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("myPosts.deletePostConfirmation")}</Modal.Body>
        <Modal.Footer>
          <button className="generic-button" onClick={() => setShowModal(false)}>
            {t("myPosts.cancel")}
          </button>
          <button className="want-button-danger" onClick={handleDeletePost}>{t("myPosts.delete")}</button>
        </Modal.Footer>
      </Modal>
      <div className="container">
      <GoBackButton />
        <h1 className="my-4">{t("myPosts.yourPosts")}</h1>
        
        <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 row-cols-xl-4 g-2">
          {posts.map((post) => {
            const userReputation = 5 - 0.3 * post.createdBy.reports.length;
            let photoIndex = 0;
            return (
              <div className='col d-flex p-2 m-1"'>
                <div className="p-0 card post-card divhover w-100 animate__fadeIn animate__animated">
                  {post.photos && post.photos.length > 0 ? (
                    <div
                      id={`carousel-${post._id}`}
                      className="carousel slide img-post"
                      data-bs-ride="carousel"
                      style={{ height: "200px", overflow: "hidden" }}
                    >
                      <Link
                        href={`editPost/${post._id}`}
                        className="carousel-inner"
                      >
                        {post.photos.map((photo, index) => (
                          <div
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                            key={index}
                          >
                            <div href={`editPost/${post._id}`}>
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                                className="d-block w-100"
                                alt={post.title}
                                loading="lazy"
                              />
                            </div>
                          </div>
                        ))}
                      </Link>
                      {post.photos.length > 1 && (
                        <>
                          <button
                            className="carousel-control-prev custom-slider-button ms-1"
                            type="button"
                            data-bs-target={`#carousel-${post._id}`}
                            data-bs-slide="prev"
                            style={{ bottom: "40px" }}
                            disabled={photoIndex === 0}
                            onClick={() => {
                              photoIndex--;
                            }}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                          <button
                            className="carousel-control-next custom-slider-button me-1"
                            type="button"
                            data-bs-target={`#carousel-${post._id}`}
                            data-bs-slide="next"
                            style={{ bottom: "40px" }}
                            disabled={photoIndex === post.photos.length - 1}
                            onClick={() => {
                              photoIndex++;
                            }}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className="d-flex w-100 h-100 align-items-center justify-content-center"
                      onClick={() => router.push(`editPost/${post._id}`)}
                    >
                      <h4 className="text-center p-3">{post.title}</h4>
                    </div>
                  )}
                  <Link href={`editPost/${post._id}`} className="post-details p-2 ">
                    <div className="want-color-generic">
                      <div className="">
                        <h3 className="post-price">
                          ${post.price.toLocaleString()}
                        </h3>
                        <h5 className="p-1 post-title">{post.title}</h5>
                      </div>
                    </div>
                  </Link>
                  <div className="post-details d-flex text-center justify-content-center align-items-center p-3">
                    <Link href={`/editPost/${post._id}`} className="p-2">
                      <button className=" text-decoration-none p-2 want-button">
                        <i className="bi bi-pencil-fill"></i>
                        {t("myPosts.edit")}
                      </button>
                    </Link>
                    <Link href={`/post/${post._id}`} className="p-2">
                      <button className=" text-decoration-none p-2 generic-button">
                        <i className="bi bi-eye"></i>
                        {t("myPosts.see")}
                      </button>
                    </Link>
                    <div className="p-2">
                    <button
                      className="want-button-danger p-2"
                      onClick={() => {
                        setSelectedPostId(post._id);
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-trash-fill"></i>
                      {t("myPosts.delete")}
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
