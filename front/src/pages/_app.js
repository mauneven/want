// _app.js
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import MegaMenu from '@/components/navigation/Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import Footer from '@/components/footer/Footer';

export default function MyApp({ Component, pageProps }) {
  const [locationFilter, setLocationFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Agrega el estado searchTerm
  const [categoryFilter, setCategoryFilter] = useState(null);

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
    // Seleccionar todos los elementos que activan los popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

    // Crear un nuevo objeto Popover para cada elemento de popoverTriggerList
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
  }, []);

  return (
    <div>
      <header className='sticky-top'>
        <MegaMenu
          onLocationFilterChange={handleLocationFilterChange}
          onSearchTermChange={handleSearchTermChange}
          onCategoryFilterChange={handleCategoryFilterChange}
        />
        <link rel="stylesheet" href="/css/navbar.css" />
        <link rel="stylesheet" href="/css/notifications.css" />
      </header>
      <Container className='containerboy'>
        <Component
          {...pageProps}
          locationFilter={locationFilter}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
        />
        <link rel="stylesheet" href="/css/posts.css" />
      </Container>
      <footer>
        <Footer />
        <link rel="stylesheet" href="/css/footer.css" />
      </footer>
    </div>
  );
}
