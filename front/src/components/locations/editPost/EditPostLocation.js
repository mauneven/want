import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { Form, Dropdown } from 'react-bootstrap';
import { Icon } from 'leaflet';

const EditPostLocation = ({ latitude, longitude, onLatitudeChange, onLongitudeChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
    onLatitudeChange(lat);
    onLongitudeChange(lng);
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
        onLatitudeChange(parseFloat(lat));
        onLongitudeChange(parseFloat(lon));
        setSearchQuery('');
        setSearchResults([]);
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

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude]);

  return (
    <div>
      <Form>
        <Form.Group controlId="searchForm">
          <Form.Control
            type="text"
            placeholder="Busca tu ciudad aquí..."
            value={searchQuery}
            className='rounded-5'
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </Form.Group>
      </Form>
      {searchResults.length > 0 && (
        <div className='mt-2 border rounded-5 results-map'>
          <ul className='p-3'>
            {searchResults.map((result, index) => (
              <li className='divhover dropdown-item' key={index} onClick={() => handleSearchSelect(result)}>
                <i className="bi bi-geo-alt p-2"></i>{result}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        {latitude && longitude && (
          <div style={{ height: '300px', position: 'relative', marginTop: '10px' }}>
            <MapContainer
              ref={mapRef}
              center={[latitude, longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              attributionControl={false} // Desactiva la atribución de Leaflet
              dragging={false}
              zoomSnap={false}
              doubleClickZoom={false}
            >
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker
                position={[latitude, longitude]}
                draggable={true}
                eventHandlers={{ dragend: handleLocationChange }}
                icon={new Icon({ iconUrl: '/icons/pin-location-icon.svg', iconSize: [32, 32], iconAnchor: [16, 32] })}
              >
                <Popup>
                  Ubicación actual: {latitude}, {longitude}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPostLocation;