/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PropertyScreen from '../screens/PropertyScreen/PropertyScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
import PropertyIcon from '../assets/images/property.svg';
import DashboardIcon from '../assets/images/dashboard.svg';
import LoginIcon from '../assets/images/login.svg';
import AddPropertyIcon from '../assets/images/add-property.svg';
import {useUser} from '../context/UserContext';
import {ActivityIndicator, View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import DashboardStack from '../navigation/DashboardStack';

const Tab = createBottomTabNavigator();

const loadingStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const gradientTabBarButtonStyle = StyleSheet.create({
  touchable: {
    flex: 1,
    position: 'absolute',
    bottom: 26, // pop out from bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  gradient: {
    width: 140,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 6,
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
      return (
        <AddPropertyIcon width={size * 0.8} height={size * 0.8} fill="#fff" />
      );
    }
    return null;
  };

const GradientTabBarButton = (props: any) => {
  const {user} = useUser();
  const navigation = useNavigation<any>();
  const {children} = props;
  const handlePress = () => {
    if (!user) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Add property');
    }
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={gradientTabBarButtonStyle.touchable}>
      <LinearGradient
        colors={['#059669', '#10b981']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={gradientTabBarButtonStyle.gradient}>
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const tabScreenOptions = (route: any, t: any) => {
  const options: any = {
    tabBarIcon: tabBarIcon(route.name),
    headerShown: false,
    tabBarLabel: ({color}: {color: string}) => (
      <Text
        style={[
          {
            fontSize: route.name === 'Add property' ? 15 : 12,
            fontWeight: '700',
          },
          route.name === 'Add property' ? {color: '#fff'} : {color},
        ]}>
        {t(
          route.name === 'Property'
            ? 'header.properties'
            : route.name === 'Add property'
            ? 'header.addProperty'
            : route.name === 'Dashboard'
            ? 'userOptions.dashboard'
            : route.name === 'Login'
            ? 'header.login'
            : route.name,
        )}
      </Text>
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
        <Tab.Screen name="Dashboard" component={DashboardStack} />
      ) : (
        <Tab.Screen name="Login" component={LoginScreen} />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabs;
