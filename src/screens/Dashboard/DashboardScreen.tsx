import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useUser} from '../../context/UserContext';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StackNavigationProp} from '@react-navigation/stack';
import RNRestart from 'react-native-restart'; // yarn add react-native-restart

// Define the type for the DashboardStack
export type DashboardStackParamList = {
  DashboardHome: undefined;
  EditProfile: undefined;
  MyProperties: undefined;
  SavedProperties: undefined;
};

const DashboardScreen = () => {
  const {user} = useUser();
  const navigation =
    useNavigation<StackNavigationProp<DashboardStackParamList>>();

  if (!user) {
    return null;
  }

  const handleNavigate = (screen: keyof DashboardStackParamList) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    await RNRestart.restart();
    navigation.reset({index: 0, routes: [{name: 'Property' as never}]});
  };

  return (
    <View style={styles.container}>
      {user.image && <Image source={{uri: user.image}} style={styles.avatar} />}
      <Text style={styles.name}>{user.name || 'User'}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate('EditProfile')}>
        <Text style={styles.buttonText}>Edit profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate('MyProperties')}>
        <Text style={styles.buttonText}>My properties</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate('SavedProperties')}>
        <Text style={styles.buttonText}>Saved Properties</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    width: 220,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
  },
});

export default DashboardScreen;
