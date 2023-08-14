import React, { useState, useEffect, Suspense } from "react";
import MegaMenu from "@/components/navigation/Navbar";
import MobileMenu from "@/components/navigation/MobileMenu";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import Footer from "@/components/footer/Footer";
import i18n from "../../i18n";
import 'animate.css';
import "../../node_modules/leaflet/dist/leaflet.css";
import "../../public/css/app.css";
import "../../public/css/categories.css";
import "../../public/css/navbar.css";
import "../../public/css/mobile-menu.css";
import "../../public/css/posts.css";
import "../../public/css/about-us.css";
import "../../public/css/modals.css";
import "../../public/css/login.css";
import "../../public/css/notifications.css";
import "../../public/css/postById.css";
import "../../public/css/receivedOffers.css";
import "../../public/css/footer.css";
import "../../public/css/post-category.css";
import "../../public/css/user.css";

export default function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubcategory] = useState("");
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
      <div className="app-container">
        <header className="sticky-top">
          <MegaMenu
            mainCategory={mainCategory}
            subCategory={subCategory}
            thirdCategory={thirdCategory}
            onCategoryChange={setMainCategory}
            onSubcategoryChange={setSubcategory}
            onThirdCategoryChange={setThirdCategory}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            keepCategories={keepCategories}
            onKeepCategoriesChange={setKeepCategories}
            onResetAll={setResetAll}
            resetAll={resetAll}
          />
        </header>

        <div className="content-container">
          <Suspense fallback="Loading...">
            <div className="want-container pt-2 pb-5">
              <Component
                {...pageProps}
                mainCategory={mainCategory}
                subCategory={subCategory}
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
            </div>
          </Suspense>
        </div>

        <footer className="footer-container pt-4">
          <div className="want-container">
            <Footer />
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}