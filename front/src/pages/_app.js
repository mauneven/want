// _app.js
import React, { useState, useEffect, Suspense } from "react";
import MegaMenu from "@/components/navigation/Navbar";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import Footer from "@/components/footer/Footer";
import i18n from "../../i18n";
import "../../node_modules/leaflet/dist/leaflet.css";
import "../../public/css/app.css";
import "../../public/css/categories.css";
import "../../public/css/navbar.css";
import "../../public/css/mobile-menu.css";
import "../../public/css/posts.css";
import "../../public/css/modals.css";
import "../../public/css/login.css";
import "../../public/css/notifications.css";
import "../../public/css/postById.css";
import "../../public/css/receivedOffers.css";
import "../../public/css/footer.css";
import "../../public/css/post-category.css";
import MobileMenu from "@/components/navigation/MobileMenu";

export default function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [detailsCategory, setDetailsCategory] = useState("");
  const [detailsSubcategory, setDetailsSubcategory] = useState("");
  const [detailsThirdCategory, setDetailsThirdCategory] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [thirdCategory, setThirdCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [keepCategories, setKeepCategories] = useState(false);
  const [resetAll, setResetAll] = useState();

  const isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };

  useEffect(() => {
    setIsMobile(isMobileDevice());
    setHasMounted(true);
  }, []);

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

  useEffect(() => {
    const checkLocalStorage = () => {
      const savedLanguage = localStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    };

    checkLocalStorage();
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <LanguageProvider>
      <div className="container-fluid">
        <header className="sticky-top">
          <MegaMenu
            mainCategory={mainCategory}
            subcategory={subcategory}
            thirdCategory={thirdCategory}
            onCategoryChange={setMainCategory}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            keepCategories={keepCategories}
            onKeepCategoriesChange={setKeepCategories}
            setMainCategory={setMainCategory}
            setSubcategory={setSubcategory}
            setThirdCategory={setThirdCategory}
            onResetAll={setResetAll}
            resetAll={resetAll}
          />
        </header>

        <div className="">
          <Suspense fallback="Loading...">
            <Component
              {...pageProps}
              onDetailsCategoryChange={setDetailsCategory}
              onDetailsSubcategoryChange={setDetailsSubcategory}
              onDetailsThirdCategoryChange={setDetailsThirdCategory}
              detailsCategory={detailsCategory}
              detailsSubcategory={detailsSubcategory}
              detailsThirdCategory={detailsThirdCategory}
              mainCategory={mainCategory}
              subcategory={subcategory}
              thirdCategory={thirdCategory}
              onMainCategoryChange={setMainCategory}
              onSubcategoryChange={setSubcategory}
              onThirdCategoryChange={setThirdCategory}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              keepCategories={keepCategories}
              onKeepCategoriesChange={setKeepCategories}
              onResetAll={setResetAll}
              resetAll={resetAll}
            />
          </Suspense>
        </div>

        <footer>
          <div className="want-container">
            {isMobile ? <MobileMenu /> : <Footer />}
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}