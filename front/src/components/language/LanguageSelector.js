import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bootstrap";

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    setShowModal(false);
    localStorage.setItem("selectedLanguage", language);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      const browserLanguage =
        navigator.language ||
        navigator.userLanguage ||
        navigator.languages[0] ||
        "en";
      const language = browserLanguage.split("-")[0];
      if (["en", "es", "fr"].includes(language)) {
        setSelectedLanguage(language);
        localStorage.setItem("selectedLanguage", language);
      } else {
        setSelectedLanguage("en");
        localStorage.setItem("selectedLanguage", "en");
      }
    }
  }, []);

  const languageOptions = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
  ];

  return (
    <div className="">
      <div
        className="align-items-center"
        onClick={() => setShowModal(true)}
      >
        {selectedLanguage ? selectedLanguage.toUpperCase() : ""}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center justify-content-center">
            {t("languageSelector.selectLanguage")}{" "}
            <p className="want-rounded d-flex want-color mb-0 ms-2 align-items-center justify-content-center">
              BETA
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("languageSelector.languageSelectionDescription")}</p>
          <div className="d-flex">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                className="want-button m-2"
                onClick={() => handleChangeLanguage(option.code)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
