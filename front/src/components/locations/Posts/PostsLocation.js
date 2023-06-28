import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, Modal, Button } from 'react-bootstrap';
import { Icon } from 'leaflet';

const PostsLocation = ({ onLatitudeChange, onLongitudeChange, onRadiusChange }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [radius, setRadius] = useState(5); // Valor predeterminado de radio: 5 km
  const radiusOptions = [1, 2, 5, 10, 20, 30, 50, 80, 100, 10000000000]; // Opciones de radio en km
  const [locationName, setLocationName] = useState(null); // Nombre de la ubicación
  const [zoomLevel, setZoomLevel] = useState(13); // Nivel de zoom predeterminado: 13

  useEffect(() => {
    const storedRadius = localStorage.getItem('radius');
    if (storedRadius) {
      setRadius(parseInt(storedRadius));
      onRadiusChange(parseInt(storedRadius));
    }

    const storedZoomLevel = localStorage.getItem('zoomLevel');
    if (storedZoomLevel) {
      setZoomLevel(parseInt(storedZoomLevel));
    }
  }, []);

  useEffect(() => {
    const storedLatitude = localStorage.getItem('latitude');
    const storedLongitude = localStorage.getItem('longitude');
    const storedRadius = localStorage.getItem('radius');
    const storedLocationName = localStorage.getItem('locationName');
    const storedZoomLevel = localStorage.getItem('zoomLevel');

    if (storedLatitude && storedLongitude && storedRadius) {
      setLatitude(parseFloat(storedLatitude));
      setLongitude(parseFloat(storedLongitude));
      setRadius(parseInt(storedRadius));
      onLatitudeChange(parseFloat(storedLatitude));
      onLongitudeChange(parseFloat(storedLongitude));
      onRadiusChange(parseInt(storedRadius));
      setLocationName(storedLocationName);
      setZoomLevel(parseInt(storedZoomLevel));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          onLatitudeChange(lat);
          onLongitudeChange(lng);
          setLocationDetected(true);
          fetchLocationName(lat, lng);
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

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const cityName = data.address.city || data.address.town || data.address.village;
      setLocationName(cityName);
      localStorage.setItem('locationName', cityName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationChange = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setLatitude(lat);
    setLongitude(lng);
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
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setSearchQuery('');
        setSearchResults([]);
        mapRef.current.setView([parseFloat(lat), parseFloat(lon)], zoomLevel);
        onLatitudeChange(parseFloat(lat));
        onLongitudeChange(parseFloat(lon));
        fetchLocationName(parseFloat(lat), parseFloat(lon));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationDetection = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const { city } = data.address;
            setLatitude(lat);
            setLongitude(lng);
            onLatitudeChange(lat);
            onLongitudeChange(lng);
            setLocationDetected(true);
            if (city) {
              setSearchQuery(city);
            }
            fetchLocationName(lat, lng);
            localStorage.setItem('latitude', lat);
            localStorage.setItem('longitude', lng);
            localStorage.setItem('radius', radius.toString());
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
  };

  const handleRadiusChange = (event) => {
    const selectedRadius = parseInt(event.target.value);
    setRadius(selectedRadius);
    onRadiusChange(selectedRadius);
    localStorage.setItem('radius', selectedRadius.toString());

    // Ajustar el nivel de zoom según el radio seleccionado
    let zoomLevel = 13; // Valor predeterminado de zoom
    if (selectedRadius === 1) {
      zoomLevel = 14;
    } else if (selectedRadius === 5) {
      zoomLevel = 12;
    } else if (selectedRadius === 10) {
      zoomLevel = 11;
    } else if (selectedRadius === 20) {
      zoomLevel = 10;
    } else if (selectedRadius === 30) {
      zoomLevel = 10;
    } else if (selectedRadius === 50) {
      zoomLevel = 9;
    } else if (selectedRadius === 80) {
      zoomLevel = 8;
    } else if (selectedRadius === 100) {
      zoomLevel = 8;
    }

    setZoomLevel(zoomLevel);
    localStorage.setItem('zoomLevel', zoomLevel.toString());

    mapRef.current.setView([latitude, longitude], zoomLevel);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleLocationSelection = async () => {
    setIsLoading(true);

    // Aquí puedes realizar las acciones que deseas realizar al seleccionar la ubicación
    // y enviar los datos de longitud, latitud y radio.
    // Por ejemplo:
    onLatitudeChange(latitude);
    onLongitudeChange(longitude);
    onRadiusChange(radius);

    // Guardar la ubicación en localStorage
    localStorage.setItem('latitude', latitude.toString());
    localStorage.setItem('longitude', longitude.toString());
    localStorage.setItem('radius', radius.toString());

    // Cerrar el modal después de seleccionar la ubicación
    closeModal();
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
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const cityName = data.address.city || data.address.town || data.address.village;
        setLocationName(cityName);
        localStorage.setItem('locationName', cityName);
      } catch (error) {
        console.error(error);
      }
    };

    if (latitude && longitude) {
      fetchLocationName();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.setView([latitude, longitude], zoomLevel);
    }
  }, [latitude, longitude]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button onClick={openModal} className="ms-2 btn text-success rounded-5 border-0">
      <i className="bi bi-geo-alt-fill"></i>{locationName ? `${locationName} · ${radius} km` : 'Select a location to see posts'}
      </button>

      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="searchForm">
              <Form.Control
                type="text"
                placeholder="Search for your location..."
                value={searchQuery}
                className="rounded-5"
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
          {searchResults.length > 0 && (
            <div className="mt-2 border rounded-5 results-map">
              <ul className="p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {searchResults.map((result, index) => (
                  <li
                    className="divhover dropdown-item"
                    key={index}
                    onClick={() => handleSearchSelect(result)}
                  >
                    <i className="bi bi-geo-alt p-2"></i>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            {latitude && longitude ? (
              <div style={{ height: '400px', position: 'relative', marginTop: '10px' }}>
                <MapContainer
                  ref={mapRef}
                  center={[latitude, longitude]}
                  zoom={zoomLevel}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  attributionControl={false} // Desactiva la atribución de Leaflet
                  dragging={false}
                  zoomSnap={false}
                  doubleClickZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[latitude, longitude]}
                    draggable={true}
                    eventHandlers={{ dragend: handleLocationChange }}
                    icon={
                      new Icon({
                        iconUrl: '/icons/pin-location-icon.svg',
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                      })
                    }
                  >
                    <Popup>
                      Current Location: {latitude}, {longitude}
                    </Popup>
                  </Marker>
                  {radius > 0 && (
                    <Circle
                      center={[latitude, longitude]}
                      pathOptions={{ color: 'blue', fillColor: '#blue', fillOpacity: 0.2 }}
                      radius={radius * 1000} // Convert km to meters
                    />
                  )}
                </MapContainer>
              </div>
            ) : (
              <div>
                <p className="text-success p-2">
                  Allow Want access to your location to find the posts near you. If you don't want to allow access to your location, enter the location where you Want to see the posts.
                </p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Form.Label>Select Radius (km):</Form.Label>
          <Form>
            <Form.Group controlId="radiusSelect">
              <Form.Control as="select" value={radius} onChange={handleRadiusChange}>
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={30}>30 km</option>
                <option value={50}>50 km</option>
                <option value={80}>80 km</option>
                <option value={100}>100 km</option>
                <option value={10000000000}>Everywhere</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Button variant="secondary" className="rounded-5" onClick={handleLocationDetection}>
            Use My Current Location
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostsLocation;