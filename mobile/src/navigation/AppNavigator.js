import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import NearbyDriversScreen from '../screens/main/NearbyDriversScreen';
import NearbyCarsScreen from '../screens/main/NearbyCarsScreen';
import CarDriverScreen from '../screens/main/CarDriverScreen';
import DriverDetailsScreen from '../screens/main/DriverDetailsScreen';
import CarDetailsScreen from '../screens/main/CarDetailsScreen';
import BookingScreen from '../screens/main/BookingScreen';
import BookingConfirmationScreen from '../screens/main/BookingConfirmationScreen';
import ActiveTripScreen from '../screens/main/ActiveTripScreen';
import TripCompletedScreen from '../screens/main/TripCompletedScreen';
import RatingReviewScreen from '../screens/main/RatingReviewScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main Tabs Container */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Discovery & Booking Screens */}
      <Stack.Screen name="NearbyDrivers" component={NearbyDriversScreen} />
      <Stack.Screen name="NearbyCars" component={NearbyCarsScreen} />
      <Stack.Screen name="CarDriver" component={CarDriverScreen} />
      <Stack.Screen name="DriverDetails" component={DriverDetailsScreen} />
      <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
      <Stack.Screen name="TripCompleted" component={TripCompletedScreen} />
      <Stack.Screen name="RatingReview" component={RatingReviewScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
