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
  setCurrentPage, // Agrega la prop setCurrentPage
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
    setCategoriesButtonText("Select a category"); // Actualiza el estado categoriesButtonText
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
  }, []); // Elimina la dependencia de locationFilter

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
    <Navbar className="mobile-navbar navbar-blur p-3" expand="lg">
      <Nav className="d-flex justify-content-start align-items-center">
        <Navbar.Brand onClick={handleLogoClick} className="divhover">
          <Image
            className="want-logo"
            src="/icons/want-logo.svg"
            alt="Want"
            width={90}
            height={50}
          />
        </Navbar.Brand>
      </Nav>
      {user ? <Notifications /> : null}
      <Nav className="d-flex justify-content-end align-items-center">
        <Navbar.Toggle
          aria-controls="mobile-navbar-nav"
          className="navbar-light"
        />
      </Nav>
      <Navbar.Collapse
        id="mobile-navbar-nav"
        className="justify-content-end px-3"
      >
        <Nav>
          {user ? (
            <>
              <div className="row">
                <div className="col-auto">
                  <img
                    src={
                      user.photo
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`
                        : "icons/person-circle.svg"
                    }
                    alt="Profile"
                    style={{
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                    }}
                    onClick={() => router.push("/editProfile")}
                    className="d-flex"
                  />
                </div>
                <div className="col-auto my-auto mx-2">
                  <p>{user.firstName}</p>
                </div>
              </div>
              <Nav.Link onClick={() => { router.push("/createPost"); closeMenu(); }}>
                I want something
              </Nav.Link>
              <Nav.Link onClick={() => { router.push("/myPosts"); closeMenu(); }}>
                Things that i want
              </Nav.Link>
              <Nav.Link onClick={() => { router.push("/sentOffers"); closeMenu(); }}>
                Sent offers
              </Nav.Link>
              <Nav.Link onClick={() => { router.push("/receivedOffers"); closeMenu(); }}>
                Received offers
              </Nav.Link>
              <Nav.Link onClick={() => { router.push("/editProfile"); closeMenu(); }}>
                My profile
              </Nav.Link>
              <Nav.Link onClick={() => { router.push("/logout"); closeMenu(); }}>
                Log out
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link onClick={() => { router.push("/login"); closeMenu(); }}>
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
      <Form
        className="d-flex w-100 search-bar border rounded-5"
        onSubmit={handleSearchSubmit}
      >
        <FormControl
          type="search"
          placeholder="The people Want..."
          className="mr-2 form-control-sm p-1 px-3 search-bar-input border-top-0 border-bottom-0 border-start-0 border-end"
          aria-label="Search"
          name="search"
        />
        <Button type="submit" variant="ml-2 search-btn">
          <i className="bi bi-search"></i>
        </Button>
      </Form>
      <LocationModal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
        onLocationSelected={handleLocationSelected}
        onLocationFilterChange={onLocationFilterChange} // Agrega esta línea
        selectedLocation={selectedLocation}
      />
      <CategoriesModal
        isShown={showCategoriesModal}
        onHide={() => setShowCategoriesModal(false)}
        onCategorySelected={handleCategorySelected}
        buttonText={categoriesButtonText}
      />
    </Navbar>
  );
}