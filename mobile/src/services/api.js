import axios from 'axios';
import { Platform } from 'react-native';

// In Expo/React Native:
// Web: http://localhost:5000
// Android Emulator: http://10.0.2.2:5000
// Physical Device: Set via process.env.EXPO_PUBLIC_API_URL or host IP
const getDefaultBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getDefaultBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000, // Quick timeout so fallback to mock data is instant if backend is not started
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
