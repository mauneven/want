import React, { useEffect } from 'react';
import { Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AES from 'crypto-js/aes';

const SECRET_KEY = 'your_secret_key_here';

function encryptData( data: any) {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

async function fetchLocation() {
  const response = await fetch('https://ipapi.co/json');
  const data = await response.json();
  return data;
}

export default function WelcomeModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [locationStatus, setLocationStatus] = React.useState('initial');

  useEffect(() => {
    const isNewUser = localStorage.getItem('isNewUser') !== 'false';
    if (isNewUser) {
      open();
    }
  }, [open]);

  const handleLocationPermission = async () => {
    setLocationStatus('waiting');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radio: 5, // default radius value
          };
          localStorage.setItem('location', encryptData(locationData));
          localStorage.setItem('isNewUser', 'false');
          close();
        },
        async () => {
          const locationData = await fetchLocation();
          locationData.radio = 5; // default radius value
          localStorage.setItem('location', encryptData(locationData));
          localStorage.setItem('isNewUser', 'false');
          close();
        }
      );
    } else {
      const locationData = await fetchLocation();
      locationData.radio = 5; // default radius value
      localStorage.setItem('location', encryptData(locationData));
      localStorage.setItem('isNewUser', 'false');
      close();
    }
  };

  const handleContinueWithoutPermission = async () => {
    const locationData = await fetchLocation();
    locationData.radio = 5; // default radius value
    localStorage.setItem('location', encryptData(locationData));
    localStorage.setItem('isNewUser', 'false');
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        localStorage.setItem('isNewUser', 'false');
      }}
      title="Welcome To WANT"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      {locationStatus === 'initial' && (
        <Button onClick={handleLocationPermission}>
          Usar Want con mi ubicacion actual
        </Button>
      )}
      {locationStatus === 'waiting' && <p>Esperando tu decisión...</p>}
      <Button onClick={handleContinueWithoutPermission}>
        Continuar
      </Button>
    </Modal>
  );
}