import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "react-bootstrap";
import { useRouter } from "next/router";

const MobileMenu = () => {
  const { t } = useTranslation();
  const [isScrolledUp, setIsScrolledUp] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);

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
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isUp = scrollTop < (window.lastScrollTop || 0);
      setIsScrolledUp(isUp);
      window.lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavItemClick = (path) => {
    router.push(path);
  };

  return (
    <Navbar
      fixed="bottom"
      className={
        isScrolledUp
          ? "navbar-visible p-0 animate__animated animate__slideInUp"
          : "navbar-hidden p-0"
      }
    >
      <div className=" w-100 p-0">
        <div className="d-flex justify-content-center w-100">
          <div
            className="text-center divhover align-items-center m-1"
            onClick={() => handleNavItemClick("/")}
          >
            <a className="justify-content-center align-items-center">
              <i className="bi bi-house-fill"></i>
            </a>
            <div>
              <p className="mobile-menu-text">{t("navbar.home")}</p>
            </div>
          </div>
          {user ? (
            <>
              <div
                className="text-center divhover align-items-center m-1"
                onClick={() => handleNavItemClick("/myPosts")}
              >
                <a className="justify-content-center align-items-center">
                  <i className="bi bi-stickies-fill"></i>
                </a>
                <div>
                  <p className="mobile-menu-text">{t("navbar.myPosts")}</p>
                </div>
              </div>
              <div
                className="text-center divhover align-items-center m-1 justify-content-center"
                onClick={() => handleNavItemClick("/createPost")}
              >
                <a className="justify-content-center align-items-center">
                  <i className="bi bi-plus-circle-fill"></i>
                </a>
                <div>
                  <p className="mobile-menu-text">
                    {t("navbar.wantSomething")}
                  </p>
                </div>
              </div>
              <div
                className="text-center divhover align-items-center m-1"
                onClick={() => handleNavItemClick("/receivedOffers")}
              >
                <a className="justify-content-center align-items-center">
                  <i className="bi bi-box-seam-fill"></i>
                </a>
                <div>
                  <p className="mobile-menu-text">
                    {t("navbar.receivedOffers")}
                  </p>
                </div>
              </div>
              <div
                className="text-center divhover align-items-center m-1"
                onClick={() => handleNavItemClick("/sentOffers")}
              >
                <a className="justify-content-center align-items-center">
                  <i className="bi bi-send-check-fill"></i>
                </a>
                <div>
                  <p className="mobile-menu-text">{t("navbar.sentOffers")}</p>
                </div>
              </div>
              <div
                className="text-center divhover align-items-center m-1"
                onClick={() => handleNavItemClick("/editProfile")}
              >
                <a className="justify-content-center align-items-center">
                  <i className="bi bi-person-lines-fill success"></i>
                </a>
                <div>
                  <p className="mobile-menu-text">{t("navbar.myProfile")}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="text-center divhover align-items-center m-1"
                onClick={() => handleNavItemClick("/login")}
              >
                <a className="justify-content-center align-items-center">
                  <i className="bi bi-person-lines-fill success"></i>
                </a>
                <div>
                  <p className="mobile-menu-text">{t("navbar.login")}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default MobileMenu;