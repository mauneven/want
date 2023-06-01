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

export default function MegaMenu({
  onLocationFilterChange,
  onSearchTermChange,
  onCategoryFilterChange,
  currentPage,
  setCurrentPage,
}) {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [locationFilter, setLocationFilter] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [categoriesButtonText, setCategoriesButtonText] = useState("Select a category");
  const [selectedLocation, setSelectedLocation] = useState({ country: "", state: "", city: "" });

  const router = useRouter();

  const handleLogoClick = () => {
    setCurrentPage(1);
    onSearchTermChange("");
    onCategoryFilterChange({ mainCategory: "", subCategory: "" });
    setCategoriesButtonText("Select a category");
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

    // Actualiza el texto del botón
    if (subCategory) {
      setCategoriesButtonText(subCategory);
    } else if (mainCategory) {
      setCategoriesButtonText(mainCategory);
    } else {
      setCategoriesButtonText("Select a category");
    }
  };

  const handleLocationSelected = (country, state, city) => {
    const newLocation = { country, state, city };
    setSelectedLocation(newLocation);
    setLocationFilter(newLocation);
    onLocationFilterChange(newLocation);
    localStorage.setItem("locationFilter", JSON.stringify(newLocation));
  };

  useEffect(() => {
    const locationFilterString = localStorage.getItem("locationFilter");
    if (locationFilterString) {
      const parsedLocationFilter = JSON.parse(locationFilterString);
      setLocationFilter(parsedLocationFilter);
      onLocationFilterChange(parsedLocationFilter);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newSearchTerm = e.target.search.value;
    setSearchTerm(newSearchTerm);
    onSearchTermChange(newSearchTerm);
    const pageParam = currentPage ? `?page=${currentPage}` : '';
    router.push('/' + pageParam);
  };

  const handleClose = () => setShowLocationModal(false);
  const handleShow = () => setShowLocationModal(true);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
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
  }, [router.pathname]);

  useEffect(() => {
    const locationFilterString = localStorage.getItem("locationFilter");
    if (locationFilterString) {
      const parsedLocationFilter = JSON.parse(locationFilterString);
      setLocationFilter(parsedLocationFilter);
      onLocationFilterChange(parsedLocationFilter);
    }
  }, []);

  return (
    <Navbar
      style={{ top: 0, zIndex: 1000 }}
      className="sticky-top sticky-nav navbar-blur"
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
            onLocationFilterChange={onLocationFilterChange} // Agrega esta línea
            selectedLocation={selectedLocation}
          />
          <FormControl
            type="search"
            placeholder="The people want..."
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
              buttonText={categoriesButtonText}
            />
            <Nav.Link className="nav-item" onClick={() => router.push('/createPost')}>
              <Button className="btn-post rounded-pill p-2">
                Want Something?
              </Button>
            </Nav.Link>
            {user ? <Nav.Link className="nav-item"><Notifications /></Nav.Link> : null}
            {user ? (
              <NavDropdown
                className="nav-link"
                title={
                  <>
                    <img
                      src={
                        user.photo
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`
                          : "icons/person-circle.svg"
                      }
                      alt="Profile"
                      className="createdBy-photo"
                    />{" "}
                    {`${user.firstName}`}
                  </>
                }
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={() => router.push('/myPosts')}>
                  <i className="bi bi-stickies-fill me-3"></i>Things that i Want
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/sentOffers')}>
                  <i className="bi bi-send-check-fill me-3"></i>Sent offers
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/receivedOffers')}>
                  <i className="bi bi-receipt me-3"></i>Received offers
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/editProfile')}>
                  <i className="bi bi-person-lines-fill me-3"></i>My profile
                </NavDropdown.Item>
                <hr />
                <NavDropdown.Item onClick={() => router.push('/logout')}>
                  <i className="bi bi-box-arrow-right me-3"></i>Log out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link onClick={() => router.push('/login')} className="nav-item">
                <span className="nav-link">Login</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
