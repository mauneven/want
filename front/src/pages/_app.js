// _app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Megamenu from '@/components/navigation/Navbar';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [locationFilter, setLocationFilter] = useState(null);

  const handleLocationFilterChange = (filter) => {
    setLocationFilter(filter);
  }

  return (
    <div>
      <header>
        <Megamenu onLocationFilterChange={handleLocationFilterChange} />
      </header>
      <Container>
        <Component {...pageProps} locationFilter={locationFilter} />
      </Container>
    </div>
  );
}
