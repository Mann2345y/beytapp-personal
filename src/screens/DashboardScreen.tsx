import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useUser} from '../context/UserContext';

const DashboardScreen = () => {
  const {user} = useUser();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {user.image && <Image source={{uri: user.image}} style={styles.avatar} />}
      <Text style={styles.name}>{user.name || 'User'}</Text>
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
  },
});

export default DashboardScreen;
