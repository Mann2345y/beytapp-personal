// i18n.ts
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './src/locales/en.json';
import ar from './src/locales/ar.json';

const resources = {
  en: {translation: en},
  ar: {translation: ar},
};

const LNG_KEY = 'en';

const languageDetector = {
  type: 'languageDetector',
  async: true,

  // Called once at app launch
  detect: async (callback: (lng: string) => void) => {
    // 1. Was a language saved previously?
    const stored = await AsyncStorage.getItem(LNG_KEY);
    if (stored) {
      return callback(stored);
    }

    // 2. Otherwise fall back to device locale
    const device = RNLocalize.getLocales()[0]?.languageCode || 'en';
    callback(device);
  },

  init: () => {},

  // Called by i18next every time you run i18n.changeLanguage()
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem(LNG_KEY, lng).catch(() => {});
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v4', // keep v4 if you prefer; either works
    interpolation: {escapeValue: false},
    // ⬇️ remove lng:'en' so the detector actually runs
  });

export default i18n;
