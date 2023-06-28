import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "react-bootstrap";
import { useRouter } from "next/router";

const MobileMenu = () => {
  const { t } = useTranslation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isScrolledDown = prevScrollPos - currentScrollPos >= 50;

    setVisible(isScrolledDown || currentScrollPos === 0);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
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
      bg="light"
      variant="light"
      fixed="bottom"
      className={visible ? "navbar-visible p-0 animate__animated animate__slideInUp" : "navbar-hidden p-0 animate__slideOutDown"}
    >
      <div className="container-fluid w-100 border p-0">
        <div className="d-flex justify-content-center w-100">
          <div
            className="text-center divhover align-items-center m-1"
            onClick={() => handleNavItemClick("/")}
          >
            <a href="#" className="justify-content-center align-items-center">
              <i className="bi bi-house-fill"></i>
            </a>
            <div>
              <p className="mobile-menu-text">{t("navbar.home")}</p>
            </div>
          </div>
          <div
            className="text-center divhover  align-items-center m-1"
            onClick={() => handleNavItemClick("/myPosts")}
          >
            <a href="#" className="justify-content-center align-items-center">
              <i className="bi bi-stickies-fill"></i>
            </a>
            <div>
              <p className="mobile-menu-text">{t("navbar.myPosts")}</p>
            </div>
          </div>
          <div
            className="text-center divhover  align-items-center m-1 justify-content-center"
            onClick={() => handleNavItemClick("/createPost")}
          >
            <a href="#" className="justify-content-center align-items-center">
            <i className="bi bi-plus-circle-fill"></i>
            </a>
            <div>
              <p className="mobile-menu-text">{t("navbar.createPost")}</p>
            </div>
          </div>
          <div
            className="text-center divhover  align-items-center m-1"
            onClick={() => handleNavItemClick("/sentOffers")}
          >
            <a href="#" className="justify-content-center align-items-center">
              <i className="bi bi-send-check-fill"></i>
            </a>
            <div>
              <p className="mobile-menu-text">{t("navbar.sentOffers")}</p>
            </div>
          </div>
          <div
            className="text-center divhover  align-items-center m-1"
            onClick={() => handleNavItemClick("/editProfile")}
          >
            <a href="#" className="justify-content-center align-items-center">
              <i className="bi bi-person-lines-fill success"></i>
            </a>
            <div>
              <p className="mobile-menu-text">{t("navbar.myProfile")}</p>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default MobileMenu;
