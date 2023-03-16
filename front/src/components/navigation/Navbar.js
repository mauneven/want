import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

function MegaMenu() {
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
            <Nav.Link href="#account">Mi cuenta</Nav.Link>
            <Nav.Link href="#login">Ingresar sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MegaMenu;
