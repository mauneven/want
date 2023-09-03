var BASE_URL: String;

// Comprobamos si estamos en modo desarrollo
if (__DEV__) {
    const IP_ADDRESS = '192.168.1.3';
    BASE_URL = `http://${IP_ADDRESS}:4000`;
} else {
    // Modo producción
    BASE_URL = 'https://want.com.co';
}

export { BASE_URL };
export const API_BASE_URL = `${BASE_URL}/api`;