import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button, NavItem } from 'react-bootstrap';
import LocationModal from '../locations/LocationPosts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function MegaMenu({ onLocationFilterChange, onSearchTermChange }) {
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

  useEffect(() => {
    const checkSession = async () => {
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

    checkSession();
  }, [router.pathname]); // Agrega la dependencia del router.pathname aquí

  useEffect(() => {
    const locationFilterString = localStorage.getItem('locationFilter');
    if (locationFilterString) {
      const parsedLocationFilter = JSON.parse(locationFilterString);
      setLocationFilter(parsedLocationFilter);
      onLocationFilterChange(parsedLocationFilter);
    }
  }, []); // Agrega la matriz de dependencias vacía aquí

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
  }, [isLogged]); // Agrega la matriz de dependencias con isLogged aquí  

  function getUserImageUrl() {
    if (user && user.photo) {
      return `http://localhost:4000/${user.photo}`;
    } else {
      // Aquí puedes especificar la URL de una imagen predeterminada, si lo deseas.
      return 'https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'; // Imagen de ejemplo. Reemplazar con una imagen real.
    }
  }

  return (
    <Navbar style={{ top: 0, zIndex: 1000 }} // Añade estilos en línea aquí
      className='sticky-top sticky-nav'
      bg="light"
      expand="lg">
      <Container className='sticky-top'>
        <Navbar.Brand href="/"><Image className='want-logo' src="/icons/want-logo.svg" alt="Want" width={90} height={50} /></Navbar.Brand>
        <Form className="d-flex flex-grow-1 w-auto search-bar border rounded-5" onSubmit={handleSearchSubmit}>
          <FormControl
            type="search"
            placeholder=" The people want..."
            className="mr-2 form-control-sm p-1 px-3 search-bar-input border-top-0 border-bottom-0 border-start-0 border-end"
            aria-label="Search"
            name="search"
          />
          <Button type="submit" variant="ml-2 search-btn">
            <i className="bi bi-search"></i>
          </Button>
        </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className='nav-item' href="/createPost"><Button className='btn-post rounded-pill p-2'>Want something?</Button></Nav.Link>
            <LocationModal
              show={showLocationModal}
              onHide={() => setShowLocationModal(false)}
              onLocationSelected={handleLocationSelected}
            />
            <Button type="submit" variant="ml-1">
              <i className="bi bi-bell fs-20 navbar-icon"></i>
            </Button>
            <NavDropdown className='nav-link' title="Categories" id="categories-dropdown">
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
              <Nav.Link  href="/login" className='nav-item'>
                
                  <span className="nav-link">Iniciar sesión</span>
               
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
