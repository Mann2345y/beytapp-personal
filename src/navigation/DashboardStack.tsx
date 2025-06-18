import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import EditProfileScreen from '../screens/Dashboard/EditProfileScreen';
import MyProperties from '../screens/Dashboard/MyProperties';
import SavedProperties from '../screens/Dashboard/SavedProperties';

const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DashboardHome"
      component={DashboardScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{title: 'Edit Profile'}}
    />
    <Stack.Screen
      name="MyProperties"
      component={MyProperties}
      options={{title: 'My Properties'}}
    />
    <Stack.Screen
      name="SavedProperties"
      component={SavedProperties}
      options={{title: 'Saved Properties'}}
    />
  </Stack.Navigator>
);

export default DashboardStack;
