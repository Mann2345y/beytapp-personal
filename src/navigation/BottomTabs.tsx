import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PropertyScreen from '../screens/PropertyScreen/PropertyScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
// Make sure these imports work! (see note below)
import PropertyIcon from '../assets/images/property.svg';
import DashboardIcon from '../assets/images/dashboard.svg';
import LoginIcon from '../assets/images/login.svg';
import PlaceholderIcon from '../assets/images/PlaceholderIcon';
import {useUser} from '../context/UserContext';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';

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
  (routeName: string) =>
  ({color, size}: {color: string; size: number}) => {
    if (routeName === 'Property') {
      return <PropertyIcon width={size} height={size} fill={color} />;
    } else if (routeName === 'Login') {
      return <LoginIcon width={size} height={size} fill={color} />;
    } else if (routeName === 'Dashboard') {
      return <DashboardIcon width={size} height={size} fill={color} />;
    } else if (routeName === 'Add property') {
      // Gradient highlight handled in tabBarButton below
      return <PlaceholderIcon size={size} />;
    }
    return null;
  };

// Custom tab bar button for gradient highlight
type GradientTabBarButtonProps = {
  children: React.ReactNode;
  accessibilityState: {selected: boolean};
  onPress?: () => void;
};

const GradientTabBarButton = (props: any) => {
  const {children, accessibilityState, onPress} = props;
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{flex: 1}}>
      <LinearGradient
        colors={['#059669', '#10b981']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          flex: 1,
          borderRadius: 16,
          margin: 6,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: focused ? 1 : 0.7,
        }}>
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const tabScreenOptions = (route: any, t: any) => {
  const options: any = {
    tabBarIcon: tabBarIcon(route.name),
    headerShown: true,
    tabBarLabel: t(
      route.name === 'Property'
        ? 'header.properties'
        : route.name === 'Add property'
        ? 'header.addProperty'
        : route.name === 'Dashboard'
        ? 'userOptions.dashboard'
        : route.name === 'Login'
        ? 'header.login'
        : route.name,
    ),
  };
  if (route.name === 'Add property') {
    options.tabBarButton = GradientTabBarButton;
  }
  return options;
};

const BottomTabs = () => {
  const {user, fetchingUserData} = useUser();
  const {t} = useTranslation();

  if (fetchingUserData) {
    return (
      <View style={loadingStyle.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Tab.Navigator screenOptions={({route}) => tabScreenOptions(route, t)}>
      <Tab.Screen name="Property" component={PropertyScreen} />
      <Tab.Screen name="Add property" component={AddPropertyScreen} />
      {user ? (
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <Tab.Screen name="Login" component={LoginScreen} />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabs;
