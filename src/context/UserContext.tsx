import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import {ROUTES} from '../constants/routes';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import EventEmitter from 'eventemitter3';

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

// Custom event emitter for AsyncStorage token changes
const tokenEventEmitter = new EventEmitter();

// Helper to set token and emit event
export const setToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
  tokenEventEmitter.emit('tokenChange');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
  tokenEventEmitter.emit('tokenChange');
};

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<any>(null);
  const [fetchingUserData, setFetchingUserData] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fetch user by token from AsyncStorage
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return null;
    }
    try {
      const res = await api.get(ROUTES.GET_LOGGED_USER, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return res.data;
    } catch (err) {
      return null;
    }
  };

  // Query for user, refetch on mount and when AsyncStorage changes
  const {data: persistedUser, isFetching} = useQuery({
    queryKey: ['loggedUser'],
    queryFn: fetchUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    setUser(persistedUser || null);
    setFetchingUserData(isFetching);
  }, [persistedUser, isFetching]);

  // Listen for token changes
  useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({queryKey: ['loggedUser']});
    };
    tokenEventEmitter.on('tokenChange', handler);
    return () => {
      tokenEventEmitter.off('tokenChange', handler);
    };
  }, [queryClient]);

  const loginUser = async (userDataOrToken: any) => {
    setFetchingUserData(true);

    let token = userDataOrToken;
    if (userDataOrToken && userDataOrToken.token) {
      token = userDataOrToken.token;
    }
    try {
      await setToken(token);

      const res = await api.get(ROUTES.GET_LOGGED_USER, {
        headers: {Authorization: `Bearer ${token}`},
      });

      setUser(res.data);

      setTimeout(() => {
        setFetchingUserData(false);
      }, 500);
    } catch (err) {
      setUser(null);
    }
  };

  const logoutUser = async () => {
    await removeToken();
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
