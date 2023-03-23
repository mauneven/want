import { useState } from 'react';
<<<<<<< Updated upstream
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
=======

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
>>>>>>> Stashed changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
<<<<<<< Updated upstream

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', userData);
      console.log(response.data);
      router.push('/');
    } catch (error) {
      console.log(error.response.data);
=======
    const email = event.target.email.value;
    const password = event.target.password.value;
    let firstName, lastName, phone, birthdate;
    if (!isLogin) {
      firstName = event.target.firstName.value;
      lastName = event.target.lastName.value;
      phone = event.target.phone.value;
      birthdate = event.target.birthdate.value;
>>>>>>> Stashed changes
    }
    const data = {
      email,
      password,
      ...(isLogin ? {} : { firstName, lastName, phone, birthdate }),
    };
    const response = await fetch(`http://localhost:4000/api/${isLogin ? 'login' : 'register'}`, {
      method: 'POST', // Cambiar a POST
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
  };

  return (
<<<<<<< Updated upstream
    <Container className="my-5">
      <h1>Iniciar sesión</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="email" value={userData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={userData.password} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Iniciar sesión
        </Button>
      </Form>
    </Container>
=======
    <div className="container">
      <h1 className="text-center">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico:</label>
          <input type="email" className="form-control" id="email" name="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input type="password" className="form-control" id="password" name="password" required />
        </div>
        {!isLogin && (
          <>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Nombre:</label>
              <input type="text" className="form-control" id="firstName" name="firstName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Apellido:</label>
              <input type="text" className="form-control" id="lastName" name="lastName" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Número de teléfono:</label>
              <input type="tel" className="form-control" id="phone" name="phone" required />
            </div>
            <div className="mb-3">
              <label htmlFor="birthdate" className="form-label">Fecha de nacimiento:</label>
              <input type="date" className="form-control" id="birthdate" name="birthdate" required />
            </div>
          </>
        )}
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</button>
        </div>
      </form>
      <div>
        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
        <button onClick={toggleForm} className="btn btn-link">{isLogin ? 'Regístrate' : 'Inicia sesión'}</button>
      </div>
    </div>
>>>>>>> Stashed changes
  );
}
