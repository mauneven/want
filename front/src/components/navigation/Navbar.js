import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import LocationModal from '../locations/LocationPosts';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MegaMenu({ onLocationFilterChange,  onSearchTermChange }) {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [locationFilter, setLocationFilter] = useState(null);
  const [filterVersion, setFilterVersion] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();
  
  const handleLocationSelected = (country, state, city) => {
    let newLocationFilter = {
      country: country,
      state: state && state !== 'Seleccione un estado' ? state : null,
      city: city && city !== 'Seleccione una ciudad' ? city : null,
      timestamp: new Date().getTime(),
    };
  
    // Si el país ha cambiado o solo el país está seleccionado, limpiar el estado y la ciudad
    if (!locationFilter || country !== locationFilter.country || (country && !state && !city)) {
      newLocationFilter.state = null;
      newLocationFilter.city = null;
    }
  
    // Almacenar los datos de la ubicación en el localStorage
    localStorage.setItem('locationFilter', JSON.stringify(newLocationFilter));
  
    setLocationFilter(newLocationFilter);
    onLocationFilterChange(newLocationFilter);
    setFilterVersion(filterVersion + 1);
    handleClose();
  };  

  useEffect(() => {
    const locationFilterString = localStorage.getItem('locationFilter');
    if (locationFilterString) {
      const parsedLocationFilter = JSON.parse(locationFilterString);
      setLocationFilter(parsedLocationFilter);
      onLocationFilterChange(parsedLocationFilter);
    }
  }, []); // Elimina la dependencia de locationFilter
  
  useEffect(() => {
    if (locationFilter) {
      onLocationFilterChange(locationFilter);
    }
  }, [locationFilter]); // Deja solo la dependencia de locationFilter  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.search.value);
    onSearchTermChange(e.target.search.value); // Agrega esta línea
    setSearchTerm(e.target.search.value);
  };

  const handleClose = () => setShowLocationModal(false);
  const handleShow = () => setShowLocationModal(true);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Want</Navbar.Brand>
        <Form className="d-flex flex-grow-1 w-auto" onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2 form-control-sm p-1"
            aria-label="Search"
            name="search"
          />
          <Button type="submit" variant="outline-success ml-2">
            <i className="bi bi-search"></i>
          </Button>
        </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className='btn btn-warning' href="/createPost">I Want Something</Nav.Link>
            <LocationModal
              show={showLocationModal}
              onHide={() => setShowLocationModal(false)}
              onLocationSelected={handleLocationSelected}
            />
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
              <NavDropdown title={<><img src={user.photo ? `http://localhost:4000/${user.photo}` : '/default-profile-picture.png'} alt="Profile" style={{ borderRadius: '50%', width: '30px', height: '30px' }} /> {`${user.firstName}`}</>} id="user-dropdown">
                <NavDropdown.Item href="/myPosts">My posts</NavDropdown.Item>
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
