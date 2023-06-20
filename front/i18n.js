import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import frTranslations from "./locales/fr.json";

// Configuración de i18next
if (typeof window !== "undefined") {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  const fallbackLanguage = savedLanguage || "en";
  const currentLanguage = savedLanguage || "en";

  i18n.use(initReactI18next).init({
    fallbackLng: fallbackLanguage,
    lng: currentLanguage,
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;