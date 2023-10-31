import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Input, Stack } from "@mantine/core";

const PostLocation: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

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
  };

  const handleSearchSelect = (value: string) => {
    setQuery(value);
    setSearchResults([]);
  };

  return (
    <div>
      <Button mt={20} mb={20} onClick={() => setOpened(true)} variant="light">
        Location
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Verify the location"
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