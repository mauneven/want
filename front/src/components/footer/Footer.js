import React from "react";
import { Navbar, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Navbar fixed="bottom" className="navbar-visible p-0">
      <div className=" w-100 p-0 d-flex align-items-center p-2 border-top justify-content-start text-start">
        <div className="align-items-center col">&copy; Want S.A.S</div>
        <div
          className="divhover links p-3 pt-0 pb-0 p-3"
          onClick={() => router.push("/about/terms-and-conditions")}
        >
          {t("footer.termsAndConditions")}
        </div>
        <div className="divhover links p-3 pt-0 pb-0 p-3" onClick={() => router.push("/about/privacy")}>
          {t("footer.privacy")}
        </div>
        <div className="divhover links p-3 pt-0 pb-0 p-3" onClick={() => router.push("/about/about-us")}>
          {t("footer.aboutUs")}
        </div>
      </div>
    </Navbar>
  );
};

export default Footer;
