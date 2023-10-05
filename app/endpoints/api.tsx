let BASE_URL: String;

// Comprobamos si estamos en modo desarrollo
if (__DEV__) {
    // Mao ip 192.168.1.3
    // Brayan ip 192.168.1.19
    // for dev on baseurl `http://${IP_ADDRESS}:4000`
    const IP_ADDRESS = '192.168.1.3';
    BASE_URL = 'https://want.com.co';
} else {
    // Modo producción
    BASE_URL = 'https://want.com.co';
}

export { BASE_URL };
export const API_BASE_URL = `${BASE_URL}/api`;