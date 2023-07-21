// PostDetailsLocation.js
import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { Icon } from "leaflet";

const PostDetailsLocation = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const [locationName, setLocationName] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    delete Icon.Default.prototype._getIconUrl;

    Icon.Default.mergeOptions({
      iconRetinaUrl: "/icons/pin-location-icon.svg",
      iconUrl: "/icons/pin-location-icon.svg",
      shadowUrl: null,
    });
  }, []);

  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const city = response.data.address.city || response.data.address.town;
        setLocationName(city);
      } catch (error) {
        console.error("Error al obtener el nombre de la ciudad:", error);
      }
    };

    if (latitude && longitude) {
      fetchLocationName();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude]);

  return (
    <>
      {latitude && longitude && (
        <div
          style={{
            height: "200px",
            width: "100%",
            position: "relative",
            marginTop: "10px",
          }}
          className=""
        >
          <div style={{ textAlign: "", marginTop: "10px" }}>
            {locationName && <h3>{locationName} | {t('postsLocation.approximateLocation')}</h3>}
          </div>
          <MapContainer
            ref={mapRef}
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            attributionControl={false}
            dragging={false}
            zoomSnap={false}
            doubleClickZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle
              center={[latitude, longitude]}
              radius={1500}
              pathOptions={{ color: "#036cd7" }}
            />
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default PostDetailsLocation;
