import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Modal } from 'react-bootstrap';

const Logout = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout');
      router.push('/');
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Cerrar sesión
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cerrar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas cerrar sesión?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Logout;
