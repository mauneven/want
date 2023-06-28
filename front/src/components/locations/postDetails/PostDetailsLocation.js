// PostDetailsLocation.js
import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { Icon } from "leaflet";

const PostDetailsLocation = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    delete Icon.Default.prototype._getIconUrl;

    Icon.Default.mergeOptions({
      iconRetinaUrl: "/icons/pin-location-icon.svg",
      iconUrl: "/icons/pin-location-icon.svg",
      shadowUrl: null,
    });
  }, []);

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
        >
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
            <Marker
              position={[latitude, longitude]}
              draggable={false}
              icon={
                new Icon({
                  iconUrl: "/icons/pin-location-icon.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                })
              }
            ></Marker>
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default PostDetailsLocation;