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
import { useTranslation } from "react-i18next";
import LanguageSelector from "../language/LanguageSelector";
import CategorySlider from "../categories/CategorySlider";

export default function MegaMenu({
  onLocationFilterChange,
  onSearchTermChange,
  onCategoryFilterChange,
  currentPage,
  setCurrentPage,
}) {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [locationFilter, setLocationFilter] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [resetSlider, setResetSlider] = useState(false);
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
    onSearchTermChange("");
    onCategoryFilterChange({
      mainCategory: "",
      subCategory: "",
      thirdCategory: "",
    });
    setCategoriesButtonText(t("navbar.selectCategory"));
    router.push("/");
    setResetSlider(true);
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
      <Navbar className="nav-borders ps-5 pe-5">
        <div className="d-flex w-100">
          <Navbar.Brand
            onClick={handleLogoClick}
            className="divhover align-center m-0 p-0 col-3 justify-content-start"
          >
            <Image
              src={"icons/want-logo-new.svg"}
              className="w-50 h-100"
              width={100}
              height={100}
            ></Image>
          </Navbar.Brand>
          <div className="col-6 text-center align-items-center justify-content-center d-flex">
            <Form
              className="d-flex search-bar border rounded-5 search-bar-navbar text-center align-items-center justify-content-center"
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
                className="mr-2 form-control p-1 px-3 search-bar-input align-items-center "
                aria-label="Search"
                name="search"
              />
              <Button
                type="submit"
                variant=""
                className=" search-btn border-0 m-1"
              >
                <i className="bi bi-search"></i>
              </Button>
            </Form>
          </div>
          <div className="col-3 justify-content-end d-flex">
            {isMobile && user && (
              <Nav.Link className="nav-item ms-2">
                <Notifications />
              </Nav.Link>
            )}
            {!isMobile && (
              <Nav className="">
                <LanguageSelector />
                <Nav.Link
                  className="nav-item"
                  onClick={() => router.push("/createPost")}
                >
                  <Button className="btn btn-post rounded-5 align-items-center nav-item">
                    {t("navbar.createPost")}
                  </Button>
                </Nav.Link>
                {user ? (
                  <NavDropdown
                    className="nav-item rounded-5 border-0 "
                    title={
                      <>
                        <img
                          src={
                            user.photo
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.photo}`
                              : "/icons/person-circle.svg"
                          }
                          alt="Profile"
                          className="navbar-user-photo"
                        />{" "}
                      </>
                    }
                  >
                    <NavDropdown.Item onClick={() => router.push("/myPosts")}>
                      <i className="bi bi-stickies-fill me-3"></i>
                      {t("navbar.myPosts")}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => router.push("/sentOffers")}
                    >
                      <i className="bi bi-send-check-fill me-3"></i>
                      {t("navbar.sentOffers")}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => router.push("/receivedOffers")}
                    >
                      <i className="bi bi-receipt me-3"></i>
                      {t("navbar.receivedOffers")}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => router.push("/editProfile")}
                    >
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
          </div>
        </div>
      </Navbar>
      {isMobile && (
        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{t("navbar.menu")}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="container">
              <div className="row mt-3">
                <div className="col">
                  <Button
                    variant="outline-secondary"
                    className="w-100 mb-3"
                    onClick={handleShow}
                  >
                    {categoriesButtonText}
                  </Button>
                </div>
              </div>
              {user && (
                <div className="row mt-3">
                  <div className="col">
                    <Button
                      variant="outline-secondary"
                      className="w-100 mb-3"
                      onClick={() => router.push("/createPost")}
                    >
                      {t("navbar.createPost")}
                    </Button>
                  </div>
                </div>
              )}
              <div className="row mt-3">
                <div className="col">
                  <Button
                    variant="outline-secondary"
                    className="w-100 mb-3"
                    onClick={() => router.push("/login")}
                  >
                    {t("navbar.login")}
                  </Button>
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
      {router.pathname === "/" ? (
        <div className="pe-5 ps-5 nav-borders d-flex">
          <div className="col-11">
            <CategorySlider
              onCategorySelected={handleCategorySelected}
              resetSlider={resetSlider}
              setResetSlider={setResetSlider}
            />
          </div>
          <div className="col-1 align-content-center justify-content-center text-center bg-white">
            <CategoriesModal
              isShown={showCategoriesModal}
              onHide={handleCloseCategories}
              onCategorySelected={handleCategorySelected}
              buttonText={categoriesButtonText}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
