import React, { useState, useEffect, Suspense } from "react";
import MegaMenu from "@/components/navigation/Navbar";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import { Provider } from "react-redux";
import store from "@/store/store";
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
import MobileMenu from "@/components/navigation/MobileMenu";

export default function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);

  const [locationFilter, setLocationFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };

  const handleLocationFilterChange = (filter) => {
    setLocationFilter(filter);
    localStorage.setItem("locationFilter", JSON.stringify(filter));
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleCategoryFilterChange = (filter) => {
    setCategoryFilter(filter);
  };

  useEffect(() => {
    setIsMobile(isMobileDevice());
    setHasMounted(true); // indicamos que la aplicación se ha montado
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
            onSearchTermChange={handleSearchTermChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </header>

        <div className="">
          <Provider store={store}>
            <Suspense fallback="Loading...">
              <Component
                {...pageProps}
                locationFilter={locationFilter}
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Suspense>
          </Provider>
        </div>

        <footer>
          <div className="want-container">
            <MobileMenu/>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}
