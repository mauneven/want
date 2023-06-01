import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import MegaMenu from '@/components/navigation/Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import Footer from '@/components/footer/Footer';
import MobileMenu from '@/components/navigation/MobileMenu';

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

  return (
    <div>
      <header className="sticky-top">
        {isMobile ? (
          <MobileMenu
            onLocationFilterChange={handleLocationFilterChange}
            onSearchTermChange={handleSearchTermChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <MegaMenu
            onLocationFilterChange={handleLocationFilterChange}
            onSearchTermChange={handleSearchTermChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
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