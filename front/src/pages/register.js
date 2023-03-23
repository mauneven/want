import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

const Register = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', userData);
      console.log(response.data);
      router.push('/');
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Container className="my-5">
      <h1>Registro de usuario</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="firstName" value={userData.firstName} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPhoneNumber">
          <Form.Label>Número celular</Form.Label>
          <Form.Control type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="email" value={userData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={userData.password} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrarse
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
