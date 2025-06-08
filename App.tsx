import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PropertyProvider} from './src/context/PropertyContext';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import {UserProvider} from './src/context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

Ionicons.loadFont();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PropertyProvider>
        <UserProvider>
          <NavigationContainer>
            <BottomTabs />
          </NavigationContainer>
        </UserProvider>
      </PropertyProvider>
    </QueryClientProvider>
  );
}
