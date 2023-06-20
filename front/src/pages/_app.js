import React, { useState, useEffect, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import MegaMenu from "@/components/navigation/Navbar";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import Footer from "@/components/footer/Footer";
import i18n from "../../i18n";

export default function MyApp({ Component, pageProps }) {
  const { t } = useTranslation();
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
      <div>
        <header className="sticky-top">
          <MegaMenu
            onLocationFilterChange={handleLocationFilterChange}
            onSearchTermChange={handleSearchTermChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <link rel="stylesheet" href="/css/navbar.css" />
        </header>

        <Container className="containerboy">
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
          <link rel="stylesheet" href="/css/posts.css" />
          <link rel="stylesheet" href="/css/modals.css" />
          <link rel="stylesheet" href="/css/login.css" />
          <link rel="stylesheet" href="/css/notifications.css" />
          <link rel="stylesheet" href="/css/postById.css" />
          <link rel="stylesheet" href="/css/receivedOffers.css" />
        </Container>

        <footer>
          <Footer />
          <link rel="stylesheet" href="/css/footer.css" />
        </footer>
      </div>
    </LanguageProvider>
  );
}