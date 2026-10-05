import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import BookingsScreen from '../screens/main/BookingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { useResponsive } from '../hooks/useResponsive';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.cyan,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.42)',
        tabBarStyle: isMobile
          ? {
              backgroundColor: '#050814',
              borderTopColor: 'rgba(0, 242, 254, 0.15)',
              borderTopWidth: 1,
              height: 64,
              paddingBottom: 8,
              paddingTop: 8,
              elevation: 16,
              shadowColor: COLORS.cyan,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
            }
          : {
              position: 'absolute',
              bottom: 16,
              left: 0,
              right: 0,
              marginHorizontal: 'auto',
              width: isDesktop ? 640 : isTablet ? 560 : '90%',
              maxWidth: 680,
              height: 66,
              paddingBottom: 10,
              paddingTop: 10,
              borderRadius: 33,
              backgroundColor: 'rgba(7, 12, 28, 0.94)',
              borderWidth: 1.5,
              borderColor: 'rgba(0, 242, 254, 0.28)',
              shadowColor: COLORS.cyan,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 18,
              elevation: 20,
            },
        tabBarLabelStyle: {
          fontSize: isMobile ? 10 : 11,
          fontWeight: '800',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'ExploreTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'BookingsTab') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={focused ? styles.activeIconWrap : null}>
              <Ionicons name={iconName} size={isMobile ? 21 : 23} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Hub' }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{ tabBarLabel: 'Fleet' }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{ tabBarLabel: 'Missions' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Identity' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeIconWrap: {
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});

export default TabNavigator;
