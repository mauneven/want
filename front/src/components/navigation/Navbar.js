import { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Offcanvas,
} from "react-bootstrap";
import LocationModal from "../locations/LocationPosts";
import { useRouter } from "next/router";
import Image from "next/image";
import Notifications from "../notifications/Notifications";
import CategoriesModal from "../categories/CategoriesPosts";
import { useTranslation, I18nextProvider } from "react-i18next";
import LanguageSelector from "../language/LanguageSelector";
import i18n from "../../../i18n";

export default function MegaMenu({
  onLocationFilterChange,
  onSearchTermChange,
  onCategoryFilterChange,
  currentPage,
  setCurrentPage,
}) {
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [locationFilter, setLocationFilter] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [categoriesButtonText, setCategoriesButtonText] = useState(
    t("navbar.selectCategory")
  );
  const [selectedLocation, setSelectedLocation] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedThirdCategory, setSelectedThirdCategory] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const router = useRouter();

  const clearSearchBar = () => {
    const searchBar = document.querySelector(".search-bar-input");
    if (searchBar) {
      searchBar.value = "";
    }
  };

  const handleLogoClick = () => {
    clearSearchBar();
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedThirdCategory("");
    setCurrentPage(1);
    onSearchTermChange("");
    onCategoryFilterChange({
      mainCategory: "",
      subCategory: "",
      thirdCategory: "",
    });
    setCategoriesButtonText(t("navbar.selectCategory"));
    router.push("/");
  };

  const handleCloseCategories = () => {
    setShowCategoriesModal(false);
    setShowOffcanvas(false);
  };

  const handleCategorySelected = (mainCategory, subCategory, thirdCategory) => {
    clearSearchBar();
    setCurrentPage(1);
    onSearchTermChange("");
    const selectedCategory = {
      mainCategory: mainCategory || "",
      subCategory: subCategory || "",
      thirdCategory: thirdCategory || "",
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
      setCategoriesButtonText(t("navbar.selectCategory"));
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
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedThirdCategory("");
    setCurrentPage(1);
    onSearchTermChange("");
    onCategoryFilterChange({
      mainCategory: "",
      subCategory: "",
      thirdCategory: "",
    });
    setCategoriesButtonText(t("navbar.selectCategory"));
    const newSearchTerm = e.target.search.value;
    setSearchTerm(newSearchTerm);
    onSearchTermChange(newSearchTerm);
    router.push("/");
  };

  const handleClose = () => setShowLocationModal(false);
  const handleShow = () => setShowLocationModal(true);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
        {
          method: "GET",
          credentials: "include",
        }
      );

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

  useEffect(() => {
    setCategoriesButtonText(t("navbar.selectCategory")); // Actualizar el estado con la traducción inicial
  }, [t]);

  return (
    <>
      <Navbar
        style={{ top: 0, zIndex: 1000 }}
        className="sticky-top sticky-nav"
        bg="light"
        expand="lg"
      >
        <Container className="sticky-top">
          <Navbar.Brand
            onClick={handleLogoClick}
            className="divhover text-center align-center m-0"
          >
            <Image
              className="want-logo"
              src={
                isMobile ? "/icons/want-logo-mini.png" : "/icons/want-logo.svg"
              }
              alt="Want"
              width={isMobile ? 30 : 90}
              height={isMobile ? 30 : 50}
            />
          </Navbar.Brand>
          <Form
            className="d-flex flex-grow-1 w-auto search-bar border rounded-4 search-bar-navbar"
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
              placeholder={t("navbar.searchPlaceholder")}
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
              <LanguageSelector />
              <Nav.Link className="nav-item">
                <CategoriesModal
                  isShown={showCategoriesModal}
                  onHide={handleCloseCategories}
                  onCategorySelected={handleCategorySelected}
                  buttonText={categoriesButtonText}
                />
              </Nav.Link>
              <Nav.Link
                className="nav-item"
                onClick={() => router.push("/createPost")}
              >
                <Button className="btn btn-post rounded-4 align-items-center nav-item">
                  {t("navbar.createPost")}
                </Button>
              </Nav.Link>
              {user && (
                <Nav.Link className="nav-item">
                  <Notifications />
                </Nav.Link>
              )}
              {user ? (
                <NavDropdown
                  className="nav-item rounded-4 border-0"
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
                  <NavDropdown.Item onClick={() => router.push("/myPosts")}>
                    <i className="bi bi-stickies-fill me-3"></i>
                    {t("navbar.myPosts")}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => router.push("/sentOffers")}>
                    <i className="bi bi-send-check-fill me-3"></i>
                    {t("navbar.sentOffers")}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => router.push("/receivedOffers")}
                  >
                    <i className="bi bi-receipt me-3"></i>
                    {t("navbar.receivedOffers")}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => router.push("/editProfile")}>
                    <i className="bi bi-person-lines-fill me-3"></i>
                    {t("navbar.myProfile")}
                  </NavDropdown.Item>
                  <hr />
                  <NavDropdown.Item onClick={() => router.push("/logout")}>
                    <i className="bi bi-box-arrow-right me-3"></i>
                    {t("navbar.logout")}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  onClick={() => router.push("/login")}
                  className="nav-item"
                >
                  <span className="nav-link">{t("navbar.login")}</span>
                </Nav.Link>
              )}
            </Nav>
          )}
          {isMobile && (
            <>
              <LanguageSelector />
              <Button
                variant="outline-success"
                className="ms-2"
                onClick={() => setShowOffcanvas(true)}
              >
                <i className="bi bi-list"></i>
              </Button>
            </>
          )}
        </Container>
      </Navbar>

      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-success">
            {t("navbar.menu")}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav.Link
            className="nav-item p-3"
            onClick={() => {
              router.push("/");
              setShowOffcanvas(false);
            }}
          >
            <i className="bi bi-house me-2"></i>
            {t("navbar.home")}
          </Nav.Link>
          <Nav.Link
            className="nav-item p-3"
            onClick={() => {
              router.push("/");
              setShowOffcanvas(false);
            }}
          >
            <i className="bi bi-house me-2"></i>
            {t("navbar.home")}
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
            <Nav.Link
              className="nav-item"
              onClick={() => {
                router.push("/createPost");
                setShowOffcanvas(false);
              }}
            >
              <Button className="btn btn-post rounded-4 align-items-center">
                {t("navbar.createPost")}
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
                  />{" "}
                  {user.firstName}
                </Nav.Link>
                <Nav.Link
                  className="nav-item"
                  onClick={() => {
                    router.push("/myPosts");
                    setShowOffcanvas(false);
                  }}
                >
                  <i className="bi bi-stickies-fill me-3"></i>
                  {t("navbar.myPosts")}
                </Nav.Link>
                <Nav.Link
                  className="nav-item"
                  onClick={() => {
                    router.push("/sentOffers");
                    setShowOffcanvas(false);
                  }}
                >
                  <i className="bi bi-send-check-fill me-3"></i>
                  {t("navbar.sentOffers")}
                </Nav.Link>
                <Nav.Link
                  className="nav-item"
                  onClick={() => {
                    router.push("/receivedOffers");
                    setShowOffcanvas(false);
                  }}
                >
                  <i className="bi bi-receipt me-3"></i>
                  {t("navbar.receivedOffers")}
                </Nav.Link>
                <Nav.Link
                  className="nav-item"
                  onClick={() => {
                    router.push("/editProfile");
                    setShowOffcanvas(false);
                  }}
                >
                  <i className="bi bi-person-lines-fill me-3"></i>
                  {t("navbar.myProfile")}
                </Nav.Link>
                <hr />
                <Nav.Link
                  className="nav-item"
                  onClick={() => {
                    router.push("/logout");
                    setShowOffcanvas(false);
                  }}
                >
                  <i className="bi bi-box-arrow-right me-3"></i>
                  {t("navbar.logout")}
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                onClick={() => {
                  router.push("/login");
                  setShowOffcanvas(false);
                }}
                className="nav-item pt-3"
              >
                <i className="bi bi-door-open"></i>
                {t("navbar.login")}
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
