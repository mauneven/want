// pages/myPosts.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();


useEffect(() => {
    fetch('http://localhost:4000/api/currentUser', { credentials: 'include' })
        .then((response) => response.json())
        .then((data) => setCurrentUser(data))
        .catch((error) => console.error('Error fetching current user:', error));
}, []);
const checkAuthentication = () => {
  if (!currentUser) {
      router.push('/login'); // Redirige al usuario a la página de inicio de sesión si no está autenticado
  }
};

useEffect(() => {
  const fetchMyPosts = async () => {
      checkAuthentication(); // Asegura que el usuario esté autenticado antes de cargar la lista de posts
      const response = await fetch('http://localhost:4000/api/my-posts', {
          credentials: 'include',
      });

      if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData);
      }
  };

  fetchMyPosts();
}, [currentUser]); // Agrega currentUser como dependencia

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${selectedPostId}`, {
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
        <h1>Mis Posts</h1>
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link href={`/editPost/${post._id}`}>
                      <span className="link-with-icon">
                        {post.title}
                        <i className="bi bi-pencil-fill ms-2"></i>
                      </span>
                    </Link>
                  </h5>
                  <p className="card-text">{post.description}</p>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setSelectedPostId(post._id);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );  
}
