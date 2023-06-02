import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import MegaMenu from '@/components/navigation/Navbar';
import { useState, useEffect } from 'react';
import Footer from '@/components/footer/Footer';

export default function MyApp({ Component, pageProps }) {
  const [locationFilter, setLocationFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, []);

  useEffect(() => {
    const isFirstLoad = localStorage.getItem("isFirstLoad");

    if (!isFirstLoad) {
      localStorage.setItem("isFirstLoad", "true");
      // Borra la caché y recarga la página
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }
      window.location.reload(true);
    }
  }, []);

  return (
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
      <Container className='containerboy'>
        <Component
          {...pageProps}
          locationFilter={locationFilter}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
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
  );
}