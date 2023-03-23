import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

function MegaMenu() {
  const [cookies] = useCookies(['connect.sid']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      // Verifica si el token está presente en las cookies
      console.log('Token desde las cookies:', cookies.token);

      try {
        const response = await fetch('http://localhost:4000/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Agrega esta línea
        });


        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (cookies.token) {
      getUserInfo();
    }
  }, [cookies.token]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Want</Navbar.Brand>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Buscar"
            className="mr-2"
            aria-label="Buscar"
          />
          <Button variant="outline-success">Buscar</Button>
        </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Categorías" id="categories-dropdown">
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
              <NavDropdown title={user.name} id="account-dropdown">
                <NavDropdown.Item href="#my-posts">Mis publicaciones</NavDropdown.Item>
                <NavDropdown.Item href="#settings">Configuración</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="#account">Mi cuenta</Nav.Link>
                <Nav.Link href="login">Ingresar sesión</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MegaMenu;
