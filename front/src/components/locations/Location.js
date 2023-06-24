import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, Dropdown } from 'react-bootstrap';
import { Icon } from 'leaflet';

const Location = ({ onLatitudeChange, onLongitudeChange }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [locationDetected, setLocationDetected] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          onLatitudeChange(lat); // Llama a la función de devolución de llamada en CreatePost
          onLongitudeChange(lng); // Llama a la función de devolución de llamada en CreatePost
          setLocationDetected(true);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();
      setSearchResults(data.map((result) => result.display_name));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationChange = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setLatitude(lat);
    setLongitude(lng);
    onLatitudeChange(lat); // Llama a la función de devolución de llamada en CreatePost
    onLongitudeChange(lng); // Llama a la función de devolución de llamada en CreatePost
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSearchSelect = async (result) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${result}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setSearchQuery('');
        setSearchResults([]);
        mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 13);
        onLatitudeChange(parseFloat(lat)); // Llama a la función de devolución de llamada en CreatePost
        onLongitudeChange(parseFloat(lon)); // Llama a la función de devolución de llamada en CreatePost
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          onLatitudeChange(position.coords.latitude); // Llama a la función de devolución de llamada en CreatePost
          onLongitudeChange(position.coords.longitude); // Llama a la función de devolución de llamada en CreatePost
          setLocationDetected(true);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const mapRef = useRef(null);

  useEffect(() => {
    delete Icon.Default.prototype._getIconUrl;

    Icon.Default.mergeOptions({
      iconRetinaUrl: '/icons/pin-location-icon.svg',
      iconUrl: '/icons/pin-location-icon.svg',
      shadowUrl: null,
    });
  }, []);

  return (
    <div>
      <Form>
        <Form.Group controlId="searchForm">
          <Form.Control
            type="text"
            placeholder="Buscar país, estado o ciudad..."
            value={searchQuery}
            className='rounded-5'
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </Form.Group>
      </Form>
      {searchResults.length > 0 && (
        <div className='mt-2 border rounded-5 resultas-map'>
          <ul className='p-3'>
            {searchResults.map((result, index) => (
              <li className='divhover dropdown-item' key={index} onClick={() => handleSearchSelect(result)}>
                <i className="bi bi-geo-alt p-2"></i>{result}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ height: '400px', width: '100%', position: 'relative', marginTop: '10px' }}>
        {latitude && longitude ? (
          <MapContainer
            ref={mapRef}
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            attributionControl={false} // Desactiva la atribución de Leaflet
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[latitude, longitude]} draggable={true} eventHandlers={{ dragend: handleLocationChange }} icon={new Icon({ iconUrl: '/icons/pin-location-icon.svg', iconSize: [32, 32], iconAnchor: [16, 32] })}>
              <Popup>
                Ubicación actual: {latitude}, {longitude}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div>Cargando ubicación...</div>
        )}
      </div>
      {!locationDetected && (
        <button onClick={handleLocationDetection} style={{ marginTop: '10px' }}>Detectar ubicación</button>
      )}
    </div>
  );
};

export default Location;
