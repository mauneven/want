"use client";
import React, { useState, useEffect } from "react";
import { Group, Text } from "@mantine/core";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import "./maps.css";

const PostInfoMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const [location, setLocation] = useState({ lat, lng });
  const [cityName, setCityName] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "";
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

  const calculateCircleDiameter = (
    radiusInKm: number,
    lat: number,
    zoom: number
  ) => {
    const metersPerPixel =
      (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
    return (2 * radiusInKm * 1000) / metersPerPixel;
  };

  const getCityName = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const locality = results[0].address_components.find((component) =>
          component.types.includes("locality")
        );
        if (locality) {
          setCityName(locality.long_name);
        }
      }
    });
  };

  useEffect(() => {
    setLocation({ lat, lng });
  }, [lat, lng]);

  useEffect(() => {
    if (location && googleApiLoaded) {
      getCityName(location.lat, location.lng);
    }
  }, [location, googleApiLoaded]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleApiLoaded(true);
    } else if (!document.querySelector(`[src*="maps.googleapis.com/maps/api/js"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleApiLoaded(true);
      document.head.appendChild(script);
    }
  }, [apiKey]);

  return (
    <Group>
      <Text fw={700} size="xl">
        {`${cityName} • The location is approximated` || null}
      </Text>
      {googleApiLoaded && location && (
        <GoogleMap
          center={location}
          zoom={10.9}
          mapContainerStyle={{ width: "100%", height: "200px" }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            zoomControl: false,
            scrollwheel: false,
            draggable: false,
          }}
        >
          <MarkerF position={location} />
          <div
            className="circle"
            style={{
              top: "50%",
              left: "50%",
              width: `${calculateCircleDiameter(
                10,
                location.lat,
                10
              )}px`,
              height: `${calculateCircleDiameter(
                10,
                location.lat,
                10
              )}px`,
            }}
          ></div>
        </GoogleMap>
      )}
    </Group>
  );
};

export default PostInfoMap;