// src/utils/changeLanguage.ts
import i18n from '../../i18n';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart'; // yarn add react-native-restart

export const changeLanguage = async (lng: 'en' | 'ar') => {
  if (i18n.language === lng) {
    return;
  } // already active

  const rtl = lng === 'ar';

  // 1️⃣ update text
  await i18n.changeLanguage(lng);

  // 2️⃣ update layout direction & restart if needed
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(true); // let JS decide
    I18nManager.forceRTL(rtl);
    RNRestart.restart(); // soft-relaunch bundle :contentReference[oaicite:2]{index=2}
  }
};
