import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { validations } from '@/utils/validations';
import { useTranslation } from 'react-i18next';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-posts`, {
        credentials: 'include',
      });

      if (response.ok) {
        const postsData = await response.json();
        const sortedPostsData = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPostsData);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${selectedPostId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Actualiza la lista de posts después de eliminar un post exitosamente
      setPosts(posts.filter((post) => post._id !== selectedPostId));
      setShowModal(false); // Cierra el modal
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('myPosts.deletePostTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('myPosts.deletePostConfirmation')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('myPosts.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            {t('myPosts.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1 className='my-4'>{t('myPosts.yourPosts')}</h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {posts.map((post) => {
          const userReputation = 5 - 0.3 * post.createdBy.reports.length;
          let photoIndex = 0;
          return (
            <div key={post._id} className="col post-card rounded-5">
              <div className="card rounded-5 divhover">
                {post.photos && post.photos.length > 0 && (
                  <div
                    id={`carousel-${post._id}`}
                    className="carousel slide rounded-5 me-2 ms-2 mt-3 img-post"
                    data-bs-ride="carousel"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <div
                      className="carousel-inner "
                      onClick={() => router.push(`/post/${post._id}`)}
                    >
                      {post.photos.map((photo, index) => (
                        <div
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                          key={index}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                            className="d-block w-100"
                            alt={`Image ${index}`}
                            loading="lazy"
                            onClick={() => router.push(`/post/${post._id}`)}
                          />
                        </div>
                      ))}
                    </div>
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
                          <i class="bi bi-chevron-left"></i>
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
                          <i class="bi bi-chevron-right"></i>
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="card-body">
                  <h4
                    className="card-title post-title"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    {post.title}
                  </h4>
                  <h3
                    className="text-price"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    ${post.price.toLocaleString()}
                  </h3>
                  <div
                    className="d-flex"
                    onClick={() => openModal(post.createdBy)}
                  >
                    <img
                      src={
                        post.createdBy.photo
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                          : "/icons/person-circle.svg"
                      }
                      alt=""
                      className="createdBy-photo p-1"
                    />
                    <div className="ms-2">
                      <small className="text-muted ">
                        {post.createdBy.firstName}
                      </small>
                      <div className="d-flex">
                        <i className="bi bi-star-fill me-1"></i>
                        <small className="text-muted">
                          {userReputation.toFixed(1)}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="m-4 text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setSelectedPostId(post._id);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-trash-fill">{t('myPosts.delete')}</i>
                  </button>
                  <Link href={`/editPost/${post._id}`}>
                    <button className="ms-2 text-decoration-none btn btn-outline-success btn-sm">
                      <i className="bi bi-pencil-fill">{t('myPosts.edit')}</i>
                    </button>
                  </Link>
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
