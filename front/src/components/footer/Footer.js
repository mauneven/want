import React, { useState, useEffect } from "react";
import { Navbar } from "react-bootstrap";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../language/LanguageSelector";

const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 750);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function once to set the initial state
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar fixed="bottom" className="nav-borders footer-fixed">
      <div className="w-100 p-0 d-flex align-items-center p-2 border-top justify-content-start text-start">
        <div className="align-items-center col">&copy; Want S.A.S</div>
        <div className="divhover p-3 pt-0 pb-0 p-3">
          <LanguageSelector/>
        </div>
        <div
          className="divhover p-3 pt-0 pb-0 p-3"
          onClick={() => router.push("/about/terms-and-conditions")}
        >
          {isMobile ? <i className="bi bi-file-earmark-text"></i> : t("footer.termsAndConditions")}
        </div>
        <div className="divhover p-3 pt-0 pb-0 p-3" onClick={() => router.push("/about/privacy")}>
          {isMobile ? <i className="bi bi-shield-lock"></i> : t("footer.privacy")}
        </div>
        <div className="divhover p-3 pt-0 pb-0 p-3" onClick={() => router.push("/about/about-us")}>
          {isMobile ? <i className="bi bi-info-circle"></i> : t("footer.aboutUs")}
        </div>
      </div>
    </Navbar>
  );
};

export default Footer;