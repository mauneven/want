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
import { useRouter } from "next/router";
import Notifications from "../notifications/Notifications";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../language/LanguageSelector";

export default function MegaMenu({
  onSearchTermChange,
  onCategoryFilterChange,
  currentPage,
  setCurrentPage,
}) {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("");
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
    router.push("/");
  };

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
    const newSearchTerm = e.target.search.value;
    setSearchTerm(newSearchTerm);
    onSearchTermChange(newSearchTerm);
    router.push("/");
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
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
        } else if (response.status === 401) {
          setUser(null);
          console.log("no logged");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
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

  return (
    <>
      <Navbar className="nav-borders">
        <div className="d-flex w-100">
          <Navbar.Brand
            onClick={handleLogoClick}
            className="divhover d-flex align-items-center m-0 p-0 col-3 justify-content-center"
          >
            <p className="fs-1 text-success d-flex  m-0 w-100 h-100 align-items-center">
              Want
            </p>
          </Navbar.Brand>
          <div className="col-6 text-center justify-content-center align-items-center d-flex">
            <Form
              className="d-flex search-bar border rounded-5 search-bar-navbar text-center align-items-center justify-content-center"
              onSubmit={handleSearchSubmit}
            >
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
                <div className="col"></div>
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
    </>
  );
}
