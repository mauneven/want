import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import GoBackButton from "@/components/reusable/GoBackButton";

const LandingPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="container">
      <GoBackButton/>
      <div className="row pb-5">
        <div className="col-md-6 d-grid align-items-center">
          <h1 className="display-4">
            <span className="want-color">{t("landingPage.title")}</span> - {t("landingPage.subtitle")}
          </h1>
          <p>{t("landingPage.description")}</p>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div id="earth"></div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h1 className="display-5">{t("landingPage.buyTitle")}</h1>
            <p>{t("landingPage.buyDescription")}</p>
            <div className="text-center">
              <i className="bi bi-person-check-fill about-icon"></i>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h1 className="display-5">{t("landingPage.sellTitle")}</h1>
            <p>{t("landingPage.sellDescription")}</p>
            <div className="text-center">
              <i className="bi bi-shop about-icon"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h1 className="display-5">{t("landingPage.anywhereTitle")}</h1>
            <p>{t("landingPage.anywhereDescription")}</p>
            <div className="text-center">
              <i className="bi bi-geo-alt about-icon"></i>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h1 className="display-5">{t("landingPage.secureTitle")}</h1>
            <p>{t("landingPage.secureDescription")}</p>
            <div className="text-center">
              <i className="bi bi-shield-check about-icon"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h1 className="display-5">{t("landingPage.secureDataTitle")}</h1>
            <p>{t("landingPage.secureDataDescription")}</p>
            <div className="text-center">
              <i className="bi bi-lock about-icon"></i>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h1 className="display-5">{t("landingPage.privacyTitle")}</h1>
            <p>{t("landingPage.privacyDescription")}</p>
            <div className="text-center">
              <i className="bi bi-safe about-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;