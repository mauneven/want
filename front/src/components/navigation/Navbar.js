import { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import LocationModal from "../locations/LocationPosts";
import { useRouter } from "next/router";
import Image from "next/image";
import Notifications from "../notifications/Notifications";
import CategoriesModal from "../categories/CategoriesPosts";
import { useRef } from "react";

export default function MegaMenu({
  onLocationFilterChange,
  onSearchTermChange,
  onCategoryFilterChange,
}) {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [locationFilter, setLocationFilter] = useState(null);
  const [filterVersion, setFilterVersion] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const searchInputRef = useRef(null); // Nuevo estado

  const router = useRouter();

  const handleLogoClick = () => {
    setSearchTerm("");
    onSearchTermChange("");
    router.push("/");
  };

  const handleCloseCategories = () => setShowCategoriesModal(false);

  const handleCategorySelected = (mainCategory, subCategory) => {
    console.log("Selected Category: ", mainCategory);
    console.log("Selected Subcategory: ", subCategory);
    const selectedCategory = {
      mainCategory: mainCategory,
      subCategory: subCategory !== "" ? subCategory : null,
    };
    onCategoryFilterChange(selectedCategory);
    handleCloseCategories();
  };

  const handleCategoryCleared = () => {
    const clearedCategory = {
      mainCategory: "",
      subCategory: "",
    };
    onCategoryFilterChange(clearedCategory);
  };

  const handleLocationSelected = (country, state, city) => {
    let newLocationFilter = {
      country: country,
      state: state && state !== "Choose an state" ? state : null,
      city: city && city !== "Choose a city" ? city : null,
      timestamp: new Date().getTime(),
    };

    // Si el país ha cambiado o solo el país está seleccionado, limpiar el estado y la ciudad
    if (
      !locationFilter ||
      country !== locationFilter.country ||
      (country && !state && !city)
    ) {
      newLocationFilter.state = null;
      newLocationFilter.city = null;
    }

    // Almacenar los datos de la ubicación en el localStorage
    localStorage.setItem("locationFilter", JSON.stringify(newLocationFilter));

    setLocationFilter(newLocationFilter);
    onLocationFilterChange(newLocationFilter);
    setFilterVersion(filterVersion + 1);
    handleClose();
  };

  useEffect(() => {
    const locationFilterString = localStorage.getItem("locationFilter");
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
    onSearchTermChange(e.target.search.value);
    setSearchTerm(e.target.search.value);
  };

  const handleClose = () => setShowLocationModal(false);
  const handleShow = () => setShowLocationModal(true);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("http://localhost:4000/api/user", {
        method: "GET",
        credentials: "include",
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
    const locationFilterString = localStorage.getItem("locationFilter");
    if (locationFilterString) {
      const parsedLocationFilter = JSON.parse(locationFilterString);
      setLocationFilter(parsedLocationFilter);
      onLocationFilterChange(parsedLocationFilter);
    }
  }, []); // Agrega la matriz de dependencias vacía aquí

  useEffect(() => {
    if (isLogged) {
      const updateSession = async () => {
        const response = await fetch("http://localhost:4000/api/user", {
          method: "GET",
          credentials: "include",
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
    }
  }

  return (
    <Navbar
      style={{ top: 0, zIndex: 1000 }} // Añade estilos en línea aquí
      className="sticky-top sticky-nav"
      bg="light"
      expand="lg"
    >
      <Container className="sticky-top">
      <Navbar.Brand onClick={handleLogoClick} className="divhover">
          <Image
            className="want-logo"
            src="/icons/want-logo.svg"
            alt="Want"
            width={90}
            height={50}
          />
        </Navbar.Brand>
        <Form
          className="d-flex flex-grow-1 w-auto search-bar border rounded-5"
          onSubmit={handleSearchSubmit}
        >
          <LocationModal
            show={showLocationModal}
            onHide={() => setShowLocationModal(false)}
            onLocationSelected={handleLocationSelected}
          />
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
            <CategoriesModal
              isShown={showCategoriesModal}
              onHide={() => setShowCategoriesModal(false)}
              onCategorySelected={handleCategorySelected}
              onCategoryCleared={handleCategoryCleared}
            />
            <Nav.Link className="nav-item" onClick={() => router.push('/createPost')}>
              <Button className="btn-post rounded-pill p-2">
                You Want something?
              </Button>
            </Nav.Link>
            <Nav.Link className="nav-item">
              {user ? <Notifications /> : ""}
            </Nav.Link>
            {user ? (
              <NavDropdown
                className="nav-link"
                title={
                  <>
                    <img
                      src={
                        user.photo
                          ? `http://localhost:4000/${user.photo}`
                          : "icons/person-circle.svg"
                      }
                      alt="Profile"
                      style={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                      }}
                    />{" "}
                    {`${user.firstName}`}
                  </>
                }
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={() => router.push('/myPosts')}>
                  <i className="bi bi-stickies-fill me-3"></i>My posts
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/sentOffers')}>
                  <i className="bi bi-send-check-fill me-3"></i>Sent Offers
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/receivedOffers')}>
                  <i className="bi bi-receipt me-3"></i>Received Offers
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/editProfile')}>
                  <i className="bi bi-person-lines-fill me-3"></i>Profile
                </NavDropdown.Item>
                <hr />
                <NavDropdown.Item onClick={() => router.push('/logout')}>
                  <i className="bi bi-box-arrow-right me-3"></i>Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link onClick={() => router.push('/login')} className="nav-item">
                <span className="nav-link">Login or Sign Up</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
