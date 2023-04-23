// _app.js
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import MegaMenu from '@/components/navigation/Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import Footer from '@/components/footer/Footer';
import MobileMenu from '@/components/navigation/MobileMenu';

export default function MyApp({ Component, pageProps }) {
  const [locationFilter, setLocationFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Agrega el estado searchTerm
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };  

  const handleLocationFilterChange = (filter) => {
    setLocationFilter(filter);
  };

  // Agrega una función para manejar el cambio en searchTerm desde el componente Megamenu
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
    // Seleccionar todos los elementos que activan los popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

    // Crear un nuevo objeto Popover para cada elemento de popoverTriggerList
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
  }, []);

  return (
    <div>
    <header className="sticky-top">
      {isMobile ? (
        <MobileMenu
          onLocationFilterChange={handleLocationFilterChange}
          onSearchTermChange={handleSearchTermChange}
          onCategoryFilterChange={handleCategoryFilterChange}
        />
      ) : (
        <MegaMenu
          onLocationFilterChange={handleLocationFilterChange}
          onSearchTermChange={handleSearchTermChange}
          onCategoryFilterChange={handleCategoryFilterChange}
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
        />
        <link rel="stylesheet" href="/css/posts.css" />
        <link rel="stylesheet" href="/css/modals.css" />
        <link rel="stylesheet" href="/css/login.css" />
        <link rel="stylesheet" href="/css/notifications.css" />
        <link rel="stylesheet" href="/css/postById.css" />
      </Container>
      <footer>
        <Footer />
        <link rel="stylesheet" href="/css/footer.css" />
      </footer>
    </div>
  );
}
