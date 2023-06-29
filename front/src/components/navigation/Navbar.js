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
    setCurrentPage(1);
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
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedThirdCategory("");
  }, [searchTerm]);  

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
      <Navbar className="nav-borders w-100">
        <div className="d-flex w-100">
          {!isMobile ? (
            <Navbar.Brand
              onClick={handleLogoClick}
              className="divhover d-flex align-items-center m-0 p-0 col-3 justify-content-center"
            >
              <div className="fs-1 want-color d-flex  m-0 w-100 h-100 align-items-center want-color">
                Want <p className="small fs-5 m-2 p-1 want-border"> βeta V2</p>
              </div>
            </Navbar.Brand>
          ) : null}
          <div className="w-100 d-flex justify-content-center align-items-center">
            <Form
              className="d-flex m-0 w-100 p-1 want-rounded text-center align-items-center justify-content-center generic-button"
              onSubmit={handleSearchSubmit}
            >
              <FormControl
                type="search"
                placeholder={t("navbar.searchPlaceholder")}
                className="mr-2 form-control p-1 px-3 search-bar-input align-items-center justify-content-center"
                aria-label="Search"
                name="search"
              />
              <button
                type="submit"
                className=" search-btn  m-1"
              >
                <i className="bi bi-search"></i>
              </button>
            </Form>
          </div>
          <div className="col-3 justify-content-end d-flex align-items-center">
            <Nav className="align-items-center justify-content-center">
              {!isMobile && (
                <>
                  <Nav.Link
                    className="nav-item"
                    onClick={() => router.push("/createPost")}
                  >
                    <button className="want-button want-rounded align-items-center">
                      {t("navbar.wantSomething")}
                    </button>
                  </Nav.Link>
                </>
              )}
              <LanguageSelector />
              {user ? <div className="d-flex align-items-center justify-content-center"><Notifications /></div>  : null}
              {!isMobile && (
                <>
                  {user ? (
                    <NavDropdown
                      className="nav-item want-rounded  "
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
                </>
              )}
            </Nav>
          </div>
        </div>
      </Navbar>
    </>
  );
}
