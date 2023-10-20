'use client'
import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Modal, Paper, Stack, Text } from "@mantine/core";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const MapComponent: React.FC<{ onLocationSelect?: Function }> = ({
  onLocationSelect,
}) => {
  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const defaultRadius = 5; // Radio por defecto
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOpened(true);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleLocationSelect = () => {
    if (location && onLocationSelect) {
      onLocationSelect(location.lat, location.lng, defaultRadius);
      setOpened(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSearchResults(
              predictions.slice(0, 3).map((pred) => pred.description)
            );
          }
        }
      );
    }, 500);
  };

  const handleSearchSelect = (value: string) => {
    setQuery(value);
    setSearchResults([]);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: value }, (results, status) => {
      if (status === "OK" && results) {
        const coords = results[0].geometry.location;
        setLocation({ lat: coords.lat(), lng: coords.lng() });
      }
    });
  };

  return (
    <>
      <Button onClick={fetchLocation} variant="light">
        Location
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Tu ubicación actual"
        size="90%"
      >
        <Input
          type="text"
          value={query}
          onChange={handleSearchChange}
          style={{ width: "100%", marginBottom: "1em" }}
        />
        {searchResults.map((result) => (
          <Stack key={result}>
            <Button
              variant="light"
              style={{ marginBottom: "0.5em", cursor: "pointer" }}
              onClick={() => handleSearchSelect(result)}
            >
              <Text>{result}</Text>
            </Button>
          </Stack>
        ))}
        <GoogleMap
          center={location || { lat: -34.397, lng: 150.644 }}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "400px" }}
          options={{ streetViewControl: false, mapTypeControl: false }}
        >
          {location && <MarkerF position={location} />}
        </GoogleMap>
        <Button onClick={handleLocationSelect} variant="light">
          Select Location
        </Button>
      </Modal>
    </>
  );
};

const AppWithGoogleMap: React.FC<{ onLocationSelect?: Function }> = ({
  onLocationSelect,
}) => {
  const isScriptLoaded = window.google && window.google.maps;

  return isScriptLoaded ? (
    <MapComponent onLocationSelect={onLocationSelect} />
  ) : (
    <LoadScript
      googleMapsApiKey="AIzaSyD7noZo9tRRp0iHN5BQClJBEtOP6E8uoCc"
      libraries={["places"]}
    >
      <MapComponent onLocationSelect={onLocationSelect} />
    </LoadScript>
  );
};

export default AppWithGoogleMap;
