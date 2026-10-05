import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from './api';
import { MOCK_USER } from '../constants/mockData';

const USER_STORAGE_KEY = '@drivenearby_user';
const TOKEN_STORAGE_KEY = '@drivenearby_token';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.data) {
      const { user, token } = response.data.data;
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setAuthToken(token);
      return user;
    }
  } catch (err) {
    console.log('Auth service: login falling back to demo session');
  }

  // Demo user session
  const user = { ...MOCK_USER, email: email || MOCK_USER.email };
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, 'demo_jwt_token_sample');
  setAuthToken('demo_jwt_token_sample');
  return user;
};

export const register = async (name, email, phone, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, phone, password });
    if (response.data && response.data.data) {
      const { user, token } = response.data.data;
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setAuthToken(token);
      return user;
    }
  } catch (err) {
    console.log('Auth service: register falling back to demo session');
  }

  const user = { ...MOCK_USER, name, email, phone };
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, 'demo_jwt_token_sample');
  setAuthToken('demo_jwt_token_sample');
  return user;
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
  } catch (e) {
    console.warn('Logout storage error:', e);
  }
};

export const checkStoredSession = async () => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
    const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedUser && storedToken) {
      setAuthToken(storedToken);
      return JSON.parse(storedUser);
    }
  } catch (e) {
    console.warn('Check session error:', e);
  }
  return null;
};

export default {
  login,
  register,
  logout,
  checkStoredSession,
};
