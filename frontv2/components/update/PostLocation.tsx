import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Input, Stack } from "@mantine/core";

declare global {
  interface Window {
    google: typeof google;
  }
}

const PostLocation: React.FC<{
  onLocationSelect?: (lat: number, lng: number) => void;
  initialLongitude?: number;
  initialLatitude?: number;
}> = ({ onLocationSelect, initialLongitude, initialLatitude }) => {
  const [opened, setOpened] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "";

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && initialLongitude && initialLatitude) {
      // Realiza la geocodificación inversa para obtener el nombre de la ciudad
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: initialLatitude, lng: initialLongitude } }, (results, status) => {
        if (status === "OK" && results) {
          for (const element of results[0].address_components) {
            const component = element;
            if (component.types.includes("locality")) {
              const newCityName = component.long_name;
              setCityName(newCityName);
              setSelectedCity(newCityName);
              break;
            }
          }
        }
      });
    }
  }, [initialLongitude, initialLatitude]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input: query, types: ["(cities)"] },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSearchResults(
              predictions.slice(0, 3).map((pred) => pred.description)
            );
          }
        }
      );
    }
  }, [query]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (typeof window !== "undefined" && window.google) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input: value, types: ["(cities)"] },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSearchResults(
              predictions.slice(0, 3).map((pred) => pred.description)
            );
          }
        }
      );
    }
  };

  const handleSearchSelect = (value: string) => {
    setQuery(value);
    setSearchResults([]);
    setSelectedCity(value.split(",")[0]);

    if (typeof window !== "undefined" && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === "OK" && results) {
          const coords = results[0].geometry.location;

          if (onLocationSelect) {
            onLocationSelect(coords.lat(), coords.lng());
          }
        }
      });
    }
    setOpened(false);
  };

  return (
    <div>
      <Button mt={4} mb={20} onClick={() => setOpened(true)} variant="light">
        {selectedCity ?? "Select a city"}
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Search a city"
        size={isMobile ? "100%" : "30%"}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Input
          type="text"
          value={query}
          onChange={handleSearchChange}
          style={{ width: "100%", marginBottom: "1em" }}
          placeholder="Write a city name here like"
        />
        {searchResults.map((result) => (
          <Stack key={result}>
            <Button
              variant="light"
              style={{ marginBottom: "0.5em", cursor: "pointer" }}
              onClick={() => handleSearchSelect(result)}
            >
              {result}
            </Button>
          </Stack>
        ))}
      </Modal>
    </div>
  );
};

export default PostLocation;
