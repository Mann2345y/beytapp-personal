import React, {createContext, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import {Alert} from 'react-native';

interface UserContextType {
  user: any;
  loginUser: (userData: any) => void;
  logoutUser: () => void;
  fetchingUserData: boolean;
}

const defaultUserContext: UserContextType = {
  user: null,
  loginUser: () => {},
  logoutUser: () => {},
  fetchingUserData: false,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<any>(null);
  const [fetchingUserData, setFetchingUserData] = useState<boolean>(false);

  const loginUser = async (userDataOrToken: any) => {
    Alert.alert('[LOGIN][UserContext] loginUser called with:');
    let token = userDataOrToken;
    // If login returns an object with token property
    if (userDataOrToken && userDataOrToken.token) {
      token = userDataOrToken.token;
      console.log(
        '[LOGIN][UserContext] Extracted token from userData object:',
        token,
      );
    } else {
      console.log('[LOGIN][UserContext] Using provided token:', token);
    }
    try {
      console.log('[LOGIN][UserContext] Saving token to AsyncStorage...');
      await AsyncStorage.setItem('token', token);
      console.log('[LOGIN][UserContext] Token saved successfully.');

      console.log('[LOGIN][UserContext] Requesting user data from API...');
      const res = await api.get('/users/get-logged-user', {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log('[LOGIN][UserContext] Received response from API:', res.data);

      setUser(res.data);
      console.log('[LOGIN][UserContext] User state updated.');

      setFetchingUserData(true);
      console.log(
        '[LOGIN][UserContext] Set fetchingUserData to true. Starting timer...',
      );

      setTimeout(() => {
        setFetchingUserData(false);
        console.log(
          '[LOGIN][UserContext] Timer complete. Set fetchingUserData to false.',
        );
      }, 500);
    } catch (err) {
      console.log('[LOGIN][UserContext] loginUser error:', err);
      setUser(null);
      console.log('[LOGIN][UserContext] Set user state to null due to error.');
    }
  };

  const logoutUser = () => {
    console.log('[LOGIN][UserContext] logoutUser called');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{user, loginUser, logoutUser, fetchingUserData}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
