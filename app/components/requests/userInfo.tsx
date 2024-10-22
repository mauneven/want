import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../endpoints/api';

export async function checkUserSession(): Promise<boolean> {
  const cookie = await AsyncStorage.getItem('cookie');
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: { Cookie: cookie },
    });

    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    return false;
  }
}

export default checkUserSession;