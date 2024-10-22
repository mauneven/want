import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const GoHomeButton = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <>
      <button className="want-rounded want-button d-flex justify-content-center align-items-center mb-5" onClick={handleGoBack}>
        <i className="bi bi-arrow-left fs-1 me-2"></i>
        <p className="justify-content-center text-center align-items-center fs-3 m-0">{t("goBackButton.homeButton")}</p>
      </button>
    </>
  );
};

export default GoHomeButton;