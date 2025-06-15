import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PropertyProvider} from './src/context/PropertyContext';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import {UserProvider} from './src/context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import './i18n';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import {CommonDataProvider} from './src/context/CommonDataContext';

Ionicons.loadFont();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CommonDataProvider>
        <PropertyProvider>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <NavigationContainer>
                <BottomTabs />
              </NavigationContainer>
            </I18nextProvider>
          </UserProvider>
        </PropertyProvider>
      </CommonDataProvider>
    </QueryClientProvider>
  );
}
