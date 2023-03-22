import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card } from 'react-bootstrap';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegistering) {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        router.push('/'); // Redirigir al usuario a la página principal después de registrarse
      } else {
        // Manejo de errores
        const data = await response.json();
        console.error(data.message);
      }
    } else {
      // Lógica para iniciar sesión con un usuario existente
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <h2 className="card-title mb-4">{isRegistering ? 'Registro' : 'Inicio de sesión'}</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 form-check">
                  <Form.Check
                    type="checkbox"
                    label="Registrarse"
                    checked={isRegistering}
                    onChange={() => setIsRegistering(!isRegistering)}
                  />
                </Form.Group>
                <Button type="submit">{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
