import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

export default function Megamenu() {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://localhost:4000/api/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
        setIsLogged(true);
      } else if (response.status === 401) {
        setIsLogged(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isLogged) {
      const updateSession = async () => {
        const response = await fetch('http://localhost:4000/api/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        } else if (response.status === 401) {
          setIsLogged(false);
        }
      };
      const interval = setInterval(updateSession, 5000);
      return () => clearInterval(interval);
    }
  }, [isLogged]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Want</Navbar.Brand>
        <Form className="d-flex flex-grow-1 w-auto">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2 form-control-sm"
            aria-label="Search"
          />
          <Button variant="outline-success ml-2"><i class="bi bi-search"></i></Button>
        </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Categorys" id="categories-dropdown">
              <NavDropdown title="Tecnología" id="technology-dropdown">
                <NavDropdown.Item href="#tablets">Tablets</NavDropdown.Item>
                <NavDropdown.Item href="#cellphones">Celulares</NavDropdown.Item>
                <NavDropdown.Item href="#computers">Computadores</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Hogar" id="home-dropdown">
                <NavDropdown.Item href="#furniture">Muebles</NavDropdown.Item>
                <NavDropdown.Item href="#tables">Mesas</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Deporte" id="sports-dropdown">
                <NavDropdown.Item href="#shoes">Zapatos</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>
            {user ? (

              <NavDropdown title={`${user.firstName} ${user.lastName}`} id="user-dropdown">
                <NavDropdown.Item href="/editProfile">Perfil</NavDropdown.Item>
                <NavDropdown.Item href="/logout">Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <li className="nav-item">
                <Link href="/login">
                  <span className="nav-link">Iniciar sesión</span>
                </Link>
              </li>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
