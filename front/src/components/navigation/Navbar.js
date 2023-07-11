// MegaMenu.js
import { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl } from "react-bootstrap";
import { useRouter } from "next/router";
import Notifications from "../notifications/Notifications";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../language/LanguageSelector";

export default function MegaMenu({
  mainCategory,
  subcategory,
  thirdCategory,
  searchTerm,
  onSearchTermChange,
  keepCategories,
  onKeepCategoriesChange,
  onCategoryChange,
  onSubcategoryChange,
  onThirdCategoryChange,
  onDetailsCategoryChange,
  onDetailsSubcategoryChange,
  onDetailsThirdCategoryChange,
  resetAll,
  onResetAll,
}) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [updatedKeepCategories, setUpdatedKeepCategories] =
    useState(keepCategories);

  const router = useRouter();

  const clearSearchBar = () => {
    const searchBar = document.querySelector(".search-bar-input");
    if (searchBar) {
      searchBar.value = "";
    }
  };

  const handleLogoClick = () => {
    clearSearchBar();
    onResetAll(true);
    router.push("/");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const newSearchTerm = e.target.search.value.trim();
    if (newSearchTerm !== "") {
      let updatedMainCategory = mainCategory;
      let updatedSubcategory = subcategory;
      let updatedThirdCategory = thirdCategory;
  
      if (updatedKeepCategories !== true) {
        updatedMainCategory = "";
        updatedSubcategory = "";
        updatedThirdCategory = "";
        onDetailsCategoryChange("");
        onDetailsSubcategoryChange("");
        onDetailsThirdCategoryChange("");
      }
  
      onCategoryChange(updatedMainCategory);
      onSubcategoryChange(updatedSubcategory);
      onThirdCategoryChange(updatedThirdCategory);
  
      onKeepCategoriesChange(updatedKeepCategories); // Actualizar el valor de keepCategories aquí
  
      onSearchTermChange(newSearchTerm);
      router.push("/");
  
      // Esperar (40 milisegundos) antes de realizar la búsqueda
      setTimeout(() => {
        onSearchTermChange(newSearchTerm);
      }, 40);
    }
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

  const getCategoryText = () => {
    if (thirdCategory) {
      return t(
        `categories.${mainCategory}.subcategories.${subcategory}.thirdCategories.${thirdCategory}.name`
      );
    } else if (subcategory) {
      return t(`categories.${mainCategory}.subcategories.${subcategory}.name`);
    } else if (mainCategory) {
      return t(`categories.${mainCategory}.name`);
    } else {
      return "";
    }
  };

  useEffect(() => {}, [getCategoryText()]);

  const handleKeepCategoriesChange = (e) => {
    setUpdatedKeepCategories(e.target.checked);
  };

  return (
    <>
      <Navbar className="nav-borders w-100">
        <div className="d-flex w-100">
          {!isMobile ? (
            <Navbar.Brand className="d-flex align-items-center m-0 p-0 col-3 justify-content-center">
              <div className="fs-1 want-color d-flex  m-0 w-100 d-flex">
                <p
                  className="desktop-logo align-items-center justify-content-center want-color m-0 divhover"
                  onClick={handleLogoClick}
                >
                  Want
                </p>{" "}
                <p
                  className="fs-5 m-2 p-1 want-border desktop-logo divhover align-items-center justify-content-center"
                  onClick={handleLogoClick}
                >
                  BETA
                </p>
              </div>
            </Navbar.Brand>
          ) : (
            <Navbar.Brand
              onClick={handleLogoClick}
              className="divhover d-flex align-items-center m-0 p-0 col-3 justify-content-center"
            >
              <div className="fs-1 want-color d-flex  m-0 w-100 h-100 align-items-center want-color mobile-logo">
                Want
                <p className="small text-small m-0 p-1 mobile-logo-beta">
                  BETA
                </p>
              </div>
            </Navbar.Brand>
          )}
          <div className="w-100 d-flex justify-content-center align-items-center">
            <Form
              className="d-flex m-0 w-100 p-0 border want-rounded text-center align-items-center justify-content-center generic-button"
              onSubmit={handleSearchSubmit}
            >
              {getCategoryText() && (
                <div className="form-check m-0 d-flex align-items-center mr-2 border-end ms-2">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    value={updatedKeepCategories}
                    onChange={handleKeepCategoriesChange}
                    id="keepCategoriesCheckbox"
                  />
                  <label
                    className="form-check-label d-flex text-categories-navbar"
                    htmlFor="keepCategoriesCheckbox"
                  >
                    {t("navbar.onlyon")} {getCategoryText()}
                  </label>
                </div>
              )}
              <FormControl
                type="search"
                placeholder={t("navbar.searchPlaceholder")}
                className="mr-2 form-control p-1 px-3 search-bar-input align-items-center justify-content-center"
                aria-label="Search"
                name="search"
              />
              <button type="submit" className="search-btn want-rounded m-1">
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
                    onClick={() => {user ? router.push("/createPost") : router.push("/login") } }
                  >
                    <button className="want-button border-selected want-rounded align-items-center">
                      {t("navbar.wantSomething")}
                    </button>
                  </Nav.Link>
                </>
              )}
              <LanguageSelector />
              {user ? (
                <div className="d-flex align-items-center justify-content-center">
                  <Notifications />
                </div>
              ) : null}
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
      <p> MC {mainCategory}</p>
      <p> SC {subcategory}</p>
      <p> TC {thirdCategory}</p>
    </>
  );
}
