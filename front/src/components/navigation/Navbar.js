import { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button, Offcanvas } from "react-bootstrap";
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedThirdCategory, setSelectedThirdCategory] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const router = useRouter();

  const handleLogoClick = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedThirdCategory('');
    setCurrentPage(1);
    onSearchTermChange('');
    onCategoryFilterChange({ mainCategory: '', subCategory: '', thirdCategory: '' });
    setCategoriesButtonText('Select a category');
    router.push('/');
  };

  const handleCloseCategories = () => {
    setShowCategoriesModal(false);
    setShowOffcanvas(false);
  };

  const handleCategorySelected = (mainCategory, subCategory, thirdCategory) => {
    const selectedCategory = {
      mainCategory: mainCategory || '',
      subCategory: subCategory || '',
      thirdCategory: thirdCategory || '',
    };
    onCategoryFilterChange(selectedCategory);
    handleCloseCategories();

    // Update the button text
    if (thirdCategory) {
      setCategoriesButtonText(thirdCategory);
    } else if (subCategory) {
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
    handleLogoClick();
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
    setIsMobile(window.innerWidth < 1000);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setShowLocationModal(false);
      setShowCategoriesModal(false);
      setShowOffcanvas(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Navbar
        style={{ top: 0, zIndex: 1000 }}
        className="sticky-top sticky-nav"
        bg="light"
        expand="lg"
      >
        <Container className="sticky-top">
          <Navbar.Brand onClick={handleLogoClick} className="divhover text-center align-center m-0">
            <Image
              className="want-logo"
              src={isMobile ? "/icons/want-logo-mini.png" : "/icons/want-logo.svg"}
              alt="Want"
              width={isMobile ? 30 : 90}
              height={isMobile ? 30 : 50}
            />
          </Navbar.Brand>
          <Form
            className="d-flex flex-grow-1 w-auto search-bar border rounded-5 search-bar-navbar"
            onSubmit={handleSearchSubmit}
          >
            {isMobile ? null : (
              <LocationModal
                show={showLocationModal}
                onHide={() => setShowLocationModal(false)}
                onLocationSelected={handleLocationSelected}
                onLocationFilterChange={onLocationFilterChange}
                selectedLocation={selectedLocation}
              />
            )}
            <FormControl
              type="search"
              placeholder="The people want..."
              className="mr-2 form-control p-1 px-3 search-bar-input"
              aria-label="Search"
              name="search"
            />
            <Button type="submit" variant="ml-2 search-btn btn">
              <i className="bi bi-search"></i>
            </Button>
          </Form>
          {isMobile && user && (
            <Nav.Link className="nav-item ms-2">
              <Notifications />
            </Nav.Link>
          )}
          {!isMobile && (
            <Nav className="ms-auto">
              <Nav.Link className="nav-item">
                <CategoriesModal
                  isShown={showCategoriesModal}
                  onHide={handleCloseCategories}
                  onCategorySelected={handleCategorySelected}
                  buttonText={categoriesButtonText}
                />
              </Nav.Link>
              <Nav.Link className="nav-item" onClick={() => router.push('/createPost')}>
                <Button className="btn btn-post rounded-5 align-items-center nav-item">
                  Want Something?
                </Button>
              </Nav.Link>
              {user && (
                <Nav.Link className="nav-item">
                  <Notifications />
                </Nav.Link>
              )}
              {user ? (
                <NavDropdown
                  className="nav-item rounded-5 border-0"
                  title={
                    <>
                      <img
                        src={
                          user.photo
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`
                            : "/icons/person-circle.svg"
                        }
                        alt="Profile"
                        className="createdBy-photo"
                      />{" "}
                      {`${user.firstName}`}
                    </>
                  }
                  id="user-dropdown"
                  style={{
                    boxShadow: "none",
                  }}
                  menuVariant="light"
                  renderMenuOnMount={true}
                >
                  <style>{`
                    .dropdown-menu {
                      border: none;
                      border-radius: 10px;
                      box-shadow: 0px 0px 15px -1px #00000042;
                    }
                  `}</style>
                  <NavDropdown.Item onClick={() => router.push('/myPosts')}>
                    <i className="bi bi-stickies-fill me-3"></i>Things that I Want
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
          )}
          {isMobile && (
            <Button variant="outline-success" className="ms-2" onClick={() => setShowOffcanvas(true)}>
              <i className="bi bi-list"></i>
            </Button>
          )}
        </Container>
      </Navbar>

      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-success">Want | Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav.Link className="nav-item p-3" onClick={() => { router.push('/'); setShowOffcanvas(false) }}>
            <i className="bi bi-house me-2"></i>Home
          </Nav.Link>
          <Nav className="flex-column">
            <Nav.Link className="nav-item">
              <i className="bi bi-globe-americas"></i>
              <LocationModal
                show={showLocationModal}
                onHide={() => setShowLocationModal(false)}
                onLocationSelected={handleLocationSelected}
                onLocationFilterChange={onLocationFilterChange}
                selectedLocation={selectedLocation}
              />
            </Nav.Link>
            <Nav.Link className="nav-item">
              <i className="bi bi-tags"></i>
              <CategoriesModal
                isShown={showCategoriesModal}
                onHide={handleCloseCategories}
                onCategorySelected={handleCategorySelected}
                buttonText={categoriesButtonText}
              />
            </Nav.Link>
            <Nav.Link className="nav-item" onClick={() => { router.push('/createPost'); setShowOffcanvas(false) }}>
              <Button className="btn btn-post rounded-5 align-items-center">
                Want Something?
              </Button>
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link className="nav-item">
                  <img
                    src={
                      user.photo
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`
                        : "/icons/person-circle.svg"
                    }
                    alt="Profile"
                    className="createdBy-photo"
                  /> {user.firstName}
                </Nav.Link>
                <Nav.Link className="nav-item" onClick={() => { router.push('/myPosts'); setShowOffcanvas(false) }}>
                  <i className="bi bi-stickies-fill me-3"></i>Things that I Want
                </Nav.Link>
                <Nav.Link className="nav-item" onClick={() => { router.push('/sentOffers'); setShowOffcanvas(false) }}>
                  <i className="bi bi-send-check-fill me-3"></i>Sent offers
                </Nav.Link>
                <Nav.Link className="nav-item" onClick={() => { router.push('/receivedOffers'); setShowOffcanvas(false) }}>
                  <i className="bi bi-receipt me-3"></i>Received offers
                </Nav.Link>
                <Nav.Link className="nav-item" onClick={() => { router.push('/editProfile'); setShowOffcanvas(false) }}>
                  <i className="bi bi-person-lines-fill me-3"></i>My profile
                </Nav.Link>
                <hr />
                <Nav.Link className="nav-item" onClick={() => { router.push('/logout'); setShowOffcanvas(false) }}>
                  <i className="bi bi-box-arrow-right me-3"></i>Log out
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() => { router.push('/login'); setShowOffcanvas(false) }} className="nav-item pt-3">
                <i className="bi bi-door-open"></i> Login/Register
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}