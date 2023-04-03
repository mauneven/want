// pages/myPosts.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';


export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoggedInAndBlockedAndVerified = async () => {
      const loggedInResponse = await fetch('want.com.co/api/is-logged-in', {
        credentials: 'include',
      });
  
      if (!loggedInResponse.ok) {
        router.push('/login');
        return;
      }
  
      const blockedResponse = await fetch('want.com.co/api/is-blocked', {
        credentials: 'include',
      });
  
      if (!blockedResponse.ok) {
        router.push('/blocked');
        return;
      }
  
      const verifiedResponse = await fetch('want.com.co/api/is-verified', {
        credentials: 'include',
      });
  
      if (!verifiedResponse.ok) {
        router.push('/verify-email');
      }
    };
  
    checkLoggedInAndBlockedAndVerified();
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const response = await fetch('want.com.co/api/my-posts', {
        credentials: 'include',
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`want.com.co/api/posts/${selectedPostId}`, {
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
          <Modal.Title>Eliminar Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar este post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1>My Posts</h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {posts.map((post) => (
            <div key={post._id} className="col">
              <div className="card post rounded-5">
                {post.photo && (
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                      src={`http://localhost:4000/${post.photo}`}
                      className="card-img-top"
                      alt={post.title}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
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
                    <i className="bi bi-trash-fill">Delete this post</i>
                  </button>
                  <Link href={`/editPost/${post._id}`}>
                      <button className="ms-2 text-decoration-none btn btn-outline-success btn-sm">
                        <i className="bi bi-pencil-fill">Edit post</i>
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