import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PropertyScreen from '../screens/PropertyScreen/PropertyScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
// Make sure these imports work! (see note below)
import PropertyIcon from '../assets/images/property.svg';
import DashboardIcon from '../assets/images/dashboard.svg';
import LoginIcon from '../assets/images/login.svg';
import {useUser} from '../context/UserContext';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

const loadingStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

// Helper to pick the right icon
const tabBarIcon =
  routeName =>
  ({color, size}) => {
    if (routeName === 'Property') {
      return <PropertyIcon width={size} height={size} fill={color} />;
    } else if (routeName === 'Login') {
      return <LoginIcon width={size} height={size} fill={color} />;
    } else if (routeName === 'Dashboard') {
      return <DashboardIcon width={size} height={size} fill={color} />;
    }
    return null;
  };

const BottomTabs = () => {
  const {user, fetchingUserData} = useUser();

  if (fetchingUserData) {
    return (
      <View style={loadingStyle.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: tabBarIcon(route.name),
        headerShown: true,
      })}>
      <Tab.Screen name="Property" component={PropertyScreen} />
      {user ? (
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <Tab.Screen name="Login" component={LoginScreen} />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabs;
