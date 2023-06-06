// pages/myPosts.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { validations } from '@/utils/validations';


export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const router = useRouter();

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
          <Modal.Title>Delete this post</Modal.Title>
        </Modal.Header>
        <Modal.Body>You sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1 className='my-4'>Your posts</h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {posts.map((post) => (
            <div key={post._id} className="col">
              <div className="card post rounded-5">
                {post.photos && post.photos.length > 0 && (
                  <div
                    id={`carousel-${post._id}`}
                    className="carousel slide"
                    data-bs-ride="carousel"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <div className="carousel-inner">
                      {post.photos.map((photos, index) => {
                        console.log("Image URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/${photos}`);
                        return (
                          <div
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                            key={index}
                          >
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photos}`}
                              className="d-block w-100"
                              alt={`Slide ${index}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carousel-${post._id}`}
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
                      data-bs-target={`#carousel-${post._id}`}
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
                  <h5 className="card-title post-title mb-2">{post.title}
                  </h5>
                  <h5 className="text-success">
                    ${post.price.toLocaleString()}
                  </h5>
                  <p className="card-text post-text mb-2">
                    {post.description.length > 100
                      ? post.description.substring(0, 100) + "..."
                      : post.description}
                  </p>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setSelectedPostId(post._id);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-trash-fill">Delete</i>
                  </button>
                  <Link href={`/editPost/${post._id}`}>
                    <button className="ms-2 text-decoration-none btn btn-outline-success btn-sm">
                      <i className="bi bi-pencil-fill">Edit</i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}