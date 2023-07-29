import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { Form, Dropdown } from 'react-bootstrap';
import { Icon } from 'leaflet';

const CreatePostLocation = ({ onLatitudeChange, onLongitudeChange }) => {
  const { t } = useTranslation();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [locationDetected, setLocationDetected] = useState(false);

  useEffect(() => {
    // Check if latitude and longitude exist in localStorage
    const storedLatitude = localStorage.getItem('latitude');
    const storedLongitude = localStorage.getItem('longitude');

    if (storedLatitude && storedLongitude) {
      setLatitude(parseFloat(storedLatitude));
      setLongitude(parseFloat(storedLongitude));
      setLocationDetected(true);
      onLatitudeChange(parseFloat(storedLatitude));
      onLongitudeChange(parseFloat(storedLongitude));
    } else {
      // If not in localStorage, get location from geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            onLatitudeChange(lat);
            onLongitudeChange(lng);
            setLocationDetected(true);
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
              const data = await response.json();
              const { city } = data.address;
              if (city) {
                setSearchQuery(city);
              }
            } catch (error) {
              console.error(error);
            }
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
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
            placeholder=""
            value={searchQuery}
            className='want-rounded'
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </Form.Group>
      </Form>
      {searchResults.length > 0 && (
        <div className='mt-2  want-rounded results-map'>
          <ul className='p-0 geo-results '>
            {searchResults.map((result, index) => (
              <li className='divhover dropdown-item pt-2 ps-0' key={index} onClick={() => handleSearchSelect(result)}>
                <i className="bi bi-geo-alt p-2"></i>{result}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div >
        {latitude && longitude ? (
          <div style={{ height: '300px', position: 'relative', marginTop: '10px' }}>
          <MapContainer
            ref={mapRef}
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            attributionControl={false} // Desactiva la atribución de Leaflet
            dragging={false}
            zoomSnap={false}
            doubleClickZoom={false}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[latitude, longitude]} draggable={true} eventHandlers={{ dragend: handleLocationChange }} icon={new Icon({ iconUrl: '/icons/pin-location-icon.svg', iconSize: [32, 32], iconAnchor: [16, 32] })}>
            </Marker>
          </MapContainer>
          </div>
        ) : (
          <div><p className='want-color'>{t('postsLocation.allowLocationAccess')}</p></div>
        )}
      </div>
    </div>
  );
};

export default CreatePostLocation;
