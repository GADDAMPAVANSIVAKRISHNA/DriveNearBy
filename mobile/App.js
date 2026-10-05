import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { BookingProvider } from './src/context/BookingContext';
import AppNavigator from './src/navigation/AppNavigator';
import ResponsiveContainer from './src/components/ResponsiveContainer';

export default function App() {
  return (
    <SafeAreaProvider>
      <ResponsiveContainer>
        <AuthProvider>
          <LocationProvider>
            <BookingProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <AppNavigator />
              </NavigationContainer>
            </BookingProvider>
          </LocationProvider>
        </AuthProvider>
      </ResponsiveContainer>
    </SafeAreaProvider>
  );
}
