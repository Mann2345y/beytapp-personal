import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import {authorize} from 'react-native-app-auth';
import {useUser} from '../../../context/UserContext';
import api from '../../../api/axiosConfig';
import {ROUTES} from '../../../constants/routes';

const config = {
  issuer: 'https://accounts.google.com',
  clientId:
    '1095880119542-6sm3rf8982kbn9cuepti5178o4vtqa20.apps.googleusercontent.com',
  redirectUrl: 'com.beytapp:/oauthredirect',
  scopes: ['openid', 'profile', 'email'],
  additionalParameters: {
    access_type: 'offline',
    prompt: 'consent' as 'consent',
  },
};

export default function GoogleSignInButton() {
  const {loginUser} = useUser();
  console.log(loginUser);

  const handlePress = async () => {
    try {
      const authState = await authorize(config);
      const {idToken} = authState;
      if (!idToken) {
        return;
      }

      const response = await api.get(ROUTES.GOOGLE_APP_CALLBACK, {
        params: {idToken},
      });

      const {token} = response.data;

      if (token) {
        loginUser({token});
      } else {
        throw new Error('No session token returned');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
});
